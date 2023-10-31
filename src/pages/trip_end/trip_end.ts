import { Platform, ModalController,NavController, ViewController, NavParams, App, LoadingController, ToastController, AlertController} from 'ionic-angular';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GoogleMaps, GoogleMap, CameraPosition, LatLng,LatLngBounds, GoogleMapsEvent, Marker, Polyline, MarkerOptions } from '@ionic-native/google-maps';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';

import { FarePage } from '../fare/fare';
import { TabsPage } from '../tabs/tabs';
import { RiderinfoPage } from '../riderinfo/riderinfo';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

@Component({
	selector: 'page-trip_end',
	templateUrl: 'trip_end.html'
})

export class Trip_endPage {
	@ViewChild('map') mapElement: ElementRef;
	map: GoogleMap;
	ridername:string;
	dropoff:string;
	profileImg:string

	ride_data:any;
	rider_data:any;
	response:any;
	show:boolean=true;
	hide:boolean=false;
	count:any;
res:any;
resps:any;
	private selfmarker: Marker;
	private selfmarker2: Marker;
	private polyline: Polyline;

	options: GeolocationOptions;
	success: any;

	locationLastUpdateTime: any;
	locationMinUpdateFrequency: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController, public zone: NgZone, private _googleMaps: GoogleMaps, private _geoLoc: Geolocation, private toastCtrl: ToastController, private bmpapiProvider: BmpapiProvider, private alertCtrl: AlertController, public platform: Platform,private launchNavigator: LaunchNavigator, private loadingcontroller: LoadingController, public app: App) {

		this.ride_data = JSON.parse(localStorage.getItem('bmp_cp_ride_data'));
		this.rider_data = JSON.parse(localStorage.getItem('bmp_cp_rider_data'));


		this.ridername = this.rider_data.full_name;
		this.dropoff = this.ride_data.dropoff_name;
		this.profileImg = this.rider_data.user_profile_img;

	}

	ionViewDidEnter() {
		this.platform.ready().then(() => {
			this.initMap();
		});
	}

	initMap() {
		let loc: LatLng;
		let loc2: LatLng;
		if (!this.map){
			this.map = GoogleMaps.create(this.mapElement.nativeElement);
		}

		this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

			//console.log('thanks for coming');
			this.options = {
				enableHighAccuracy : true,
				timeout: 20000
			}

			/* //get user location
			this.getLocation().then( res => {
				//once location is gotten, we set the location on the camera.
				loc = new LatLng(res.coords.latitude, res.coords.longitude);
				this.moveCamera(loc);

				this.createMarker(loc, "Me", "driver").then((marker: Marker) => {
					marker.showInfoWindow();
				});
			}).catch( err => {
				//prompt the user to turn on location
				this.toastCtrl.create({
					message: 'Your device location is not available. Please turn on your GPS.',
					position: 'middle',
					showCloseButton: true,
					closeButtonText: 'OK'
				 });
				console.log(err);
			});
			// */

			this.locationLastUpdateTime = null;
			this.locationMinUpdateFrequency = 10 * 1000;
			//subscribe to user location
			this._geoLoc.watchPosition().subscribe( res => {
				//once location is gotten, we set the location on the camera.
				let now = new Date();
				let duration;
				try {
					duration = now.getTime() - this.locationLastUpdateTime.getTime();
				} catch (error) {
					duration = 999999999;
				}

				if (this.locationLastUpdateTime == null || duration >= this.locationMinUpdateFrequency) {
					loc = new LatLng(res.coords.latitude, res.coords.longitude);

					var arrlatlng2 = this.ride_data.dropoff_gps.split(",");
					const lat2 = arrlatlng2[0];
					const lng2 = arrlatlng2[1];
					loc2 = new LatLng(lat2,lng2);
					console.log(loc2);

					//add marker for driver
					if (this.selfmarker != null) {
						this.selfmarker.setPosition(loc);
						//this.map.addMarker(this.selfmarker);
					} else {
						let markerIcon = {
							'url': './assets/imgs/ic_car.png'
						}
						let markerOptions: MarkerOptions = {
							position: loc,
							icon: markerIcon
						};
						 this.map.addMarker(markerOptions).then((marker) => { this.selfmarker = marker; });
					}

					//add marker for user
					if (this.selfmarker2 != null) {
						this.selfmarker2.setPosition(loc2);
						//this.map.addMarker(this.selfmarker);
					} else {

						let markerOptions2: MarkerOptions = {
							position: loc2
						};
						 this.map.addMarker(markerOptions2).then((marker) => { this.selfmarker2 = marker; });
					}

					let points = [
						{
							lat: Number(res.coords.latitude),
							lng: Number(res.coords.longitude)
						},
						{
							lat: Number(lat2),
							lng: Number(lng2)
						}
					];

					console.log("here are my points");
					console.log(points);
					console.log("points ends here");


					this.map.addPolyline({
					points: points,
					'color' : '#54b61e',
					'width': 3,
					'visible':false,
					'geodesic': true
					}).then((polyline) => { this.polyline = polyline; });

					//zoom map
					/*
					let latLngBounds = new LatLngBounds(points);
					this.map.moveCamera({
					'target': latLngBounds
					});
					*/

					this.map.moveCamera({
					'target': loc,
					zoom: 12,
					tilt: 10
					});

					this.locationLastUpdateTime = now;

					//update the location
					var latlngs = res.coords.latitude+','+res.coords.longitude;
					this.updatelocation(latlngs);
				}else{
					//console.log('Ignore position update: ', duration);
				}

			}), ( err => {
				//prompt the user to turn on location
				this.toastCtrl.create({
					message: "L'emplacement de votre appareil n'est pas disponible. Veuillez allumer votre GPS.",
					position: 'middle',
					showCloseButton: true,
					closeButtonText: 'OK'
				 });
				console.log(err);
			});
			//

		});
	}

	//end trip and wait for rider here

	stats(){
		const ride_id = this.ride_data.ride_id;
		const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
		let loading = this.loadingcontroller.create({
			content: 'Ending Trip ...'
		});
		loading.present();

		this.bmpapiProvider.ends(bmp_jwt,ride_id).subscribe(response => {
			loading.dismiss();
			this.response = response;
	if(this.response.message==="success"){
	this.show=false;
	this.hide=true;
	let toast = this.toastCtrl.create({
	message: "Ce voyage sera annulé prochainement si le coureur refuse de confirmer la fin du voyage...",
	duration: 3000
	});
	toast.present();
	//set timeout to check if rider has approved arrival
	this.count=setInterval(()=>{
	this.check();
	this.expiry();
	},2000)
	}
	else{console.log(this.response.message)}
	});
	}

//check if the riderhas  ended the trip
	check(){
		const rideId = this.ride_data.ride_id;
		const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
		this.bmpapiProvider.checker(bmp_jwt,rideId).subscribe(resp=>{
			this.resps=resp;
			if(this.resps.message=="checked"){
				//call end of trip here
				this.fare();
				clearInterval(this.count);
			}
			else{
			// 	this.count=setInterval(()=>{
			// 	this.check();
			// },2000);
			console.log(this.resps.message);
			}
		})
	}

	//destroy trip if rider refuses to pick after 30min
	expiry(){
		const rideId = this.ride_data.ride_id;
		const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
		this.bmpapiProvider.expire(bmp_jwt,rideId).subscribe(resp=>{
			this.res=resp;
			if(this.res.message==="expired"){
				let loading = this.loadingcontroller.create({
					content: "Le cycliste n'a pas répondu après 3 minutes de fin de trajet, arrêtant le trajet"
				});
				loading.present();

				this.bmpapiProvider.cancelTrip(bmp_jwt,rideId).subscribe(respo=>{
					this.res=respo;
						console.log(this.res.message);
					if(this.res.message==="success"){
						clearInterval(this.count);
						loading.dismiss();
						//go home
						localStorage.setItem('bmp_currentPage', "");
						this.navCtrl.setRoot(TabsPage);
					}
					else{
							loading.dismiss();
						console.log(this.res.message);
					}
				})

			}
			else{
			console.log(this.res.message);
			}
		})
	}

	updatelocation(latlngs){
        const bmp_jwt = localStorage.getItem('bmp_jwt');
        const bmp_userdata = JSON.parse(localStorage.getItem('bmp_userdata'));
        var user_id = bmp_userdata.user_id;
        this.bmpapiProvider.update_location(bmp_jwt,latlngs,user_id).subscribe(response => {
            console.log(response);
        },err => {
		});
    }

	getLocation(){
		return this._geoLoc.getCurrentPosition();
	}

	moveCamera(loc: LatLng){
		let options: CameraPosition<any> = {
		  //specify center of map
		  target: loc,
		  zoom: 15,
		  tilt: 10
		}
		this.map.moveCamera(options)
	}

	createMarker(loc: LatLng, title: string, usedfor: string){
		var myLocationIcon;
		if (usedfor == "user"){
		  myLocationIcon = './assets/imgs/rider_marker.png';
		}else if(usedfor == "driver"){
		  myLocationIcon = './assets/imgs/ic_car.png';
		}

		let MarkerOptions: MarkerOptions = {
		  position: loc,
		  //title: title,
		  icon: { url : myLocationIcon }
		};

		return this.map.addMarker(MarkerOptions);
	}

	navigate(){
		//send to google map for navigation
		let options: LaunchNavigatorOptions = {
			app: this.launchNavigator.APP.GOOGLE_MAPS
		}

		this.launchNavigator.navigate(this.ride_data.dropoff_gps, options)
		.then(
		success => console.log('Launched navigator'),
		error => {
			let toast = this.toastCtrl.create({
			message: 'Erreur lors du lancement du navigateur, installez google maps',
			duration: 3000
			});
			toast.present();
		}
		);
	}

	fare() {

		const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
		const ride_id = this.ride_data.ride_id;

		let loading = this.loadingcontroller.create({
			content: 'Fin du voyage ...'
		});
		loading.present();

		this.bmpapiProvider.end_trip(bmp_jwt,ride_id).subscribe(async response => {
			try {
							//call the other guy
			const caller:any=await this.bmpapiProvider.post('url','/ride/executive/calculateFare',{trip_id:parseInt(ride_id)},'POST');
			loading.dismiss();
			console.log('info',JSON.stringify(caller))
			this.response = response;
			//for 0
			if(!caller.error && caller.is_executive){
				//change the fare
			
				this.response.data['ride_amount']=caller.amount;
				console.log("end trip response");
				console.log(this.response);
				localStorage.setItem('bmp_currentPage', "FarePage");
				localStorage.setItem('bmp_cp_ride_data', JSON.stringify(this.ride_data));
				localStorage.setItem('bmp_cp_rider_data', JSON.stringify(this.rider_data));
				localStorage.setItem('bmp_cp_ride_summary', JSON.stringify(this.response.data));
				this.app.getRootNav().setRoot(FarePage, { ride_data: this.ride_data, rider_data: this.rider_data, ride_summary: this.response.data });
			}
			else if(caller.error && caller.is_executive==null){
				console.log("end trip response");
				console.log(this.response);
				localStorage.setItem('bmp_currentPage', "FarePage");
				localStorage.setItem('bmp_cp_ride_data', JSON.stringify(this.ride_data));
				localStorage.setItem('bmp_cp_rider_data', JSON.stringify(this.rider_data));
				localStorage.setItem('bmp_cp_ride_summary', JSON.stringify(this.response.data));
				this.app.getRootNav().setRoot(FarePage, { ride_data: this.ride_data, rider_data: this.rider_data, ride_summary: this.response.data });
			}
			else{
				loading.dismiss();
				let toast = this.toastCtrl.create({
				message: "Une erreur Internet s'est produite, réessayez",
				duration: 3000
				});
				toast.present();	
		}
			} catch (error) {
				console.log('error',error)
				loading.dismiss();
				let toast = this.toastCtrl.create({
				message: "Une erreur Internet s'est produite, réessayez",
				duration: 3000
				});
				toast.present();	
			}
	},
		err => {
			loading.dismiss();
			let toast = this.toastCtrl.create({
			message: "Une erreur Internet s'est produite, réessayez",
			duration: 3000
			});
			toast.present();
		});

	}

}
