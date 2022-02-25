import { Platform, ModalController,NavController, ViewController, NavParams, App, LoadingController, ToastController, AlertController} from 'ionic-angular';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GoogleMaps, GoogleMap, CameraPosition, LatLng,LatLngBounds, GoogleMapsEvent, Marker, Polyline, MarkerOptions } from '@ionic-native/google-maps';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';

import { CancelridePage } from '../cancelride/cancelride';
import { LocationPage } from '../location/location';
import { RiderinfoPage } from '../riderinfo/riderinfo';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

@Component({
	selector: 'page-accept',
	templateUrl: 'accept.html'
})

export class AcceptPage {
	@ViewChild('map') mapElement: ElementRef;
	map: GoogleMap;
	ridername:string;
	pickup:string;
	ride_data:any;
	rider_data:any;
  	profileImg: String;
	response:any;
watches:any;
	private selfmarker: Marker;
	private selfmarker2: Marker;
	private polyline: Polyline;

	options: GeolocationOptions;
	success: any;
updater:any;
	locationLastUpdateTime: any;
	locationMinUpdateFrequency: any;
	lati:any;
	longi:any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController, public zone: NgZone, private _googleMaps: GoogleMaps, private _geoLoc: Geolocation, private toastCtrl: ToastController, private bmpapiProvider: BmpapiProvider, private alertCtrl: AlertController, public platform: Platform,private launchNavigator: LaunchNavigator, private loadingcontroller: LoadingController, public app: App) {

		this.ride_data = JSON.parse(localStorage.getItem('bmp_cp_ride_data'));
		this.rider_data = JSON.parse(localStorage.getItem('bmp_cp_rider_data'));
		console.log('ride_data');
		console.log(this.ride_data );
		console.log('rider_data');
		console.log(this.rider_data);

		this.ridername = this.ride_data.rider_name;
		this.pickup = this.ride_data.pickup_address;
		this.profileImg = this.ride_data.rider_picture;

	}

	ionViewDidEnter() {
		this.platform.ready().then(() => {
			this.initMap();
    //  this.watch();
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
			this.locationLastUpdateTime = null;
			this.locationMinUpdateFrequency = 10 * 1000;
			//subscribe to user location
			this._geoLoc.watchPosition().subscribe( res => {
this.lati=res.coords.latitude;
this.longi=res.coords.longitude;

				//upload current location for a start
				const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
				const ride_id = this.ride_data.ride_id;

				this.bmpapiProvider.update_loc(bmp_jwt, ride_id, this.longi, this.lati).subscribe(resp=>{
					this.updater=resp;
					if(this.updater.message==="success"){
				// alert('success')
					}
					else{
					//  alert('error')
					}
				})
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

					var arrlatlng2 = this.ride_data.pickup_gps.split(",");
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
						let markerIcon2 = {
							'url': './assets/imgs/rider_marker.png'
						}
						let markerOptions2: MarkerOptions = {
							position: loc2,
							icon: markerIcon2
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
					message: 'Your device location is not available. Please turn on your GPS.',
					position: 'middle',
					showCloseButton: true,
					closeButtonText: 'OK'
				 });
				console.log(err);
			});
			//

		});
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

	cancelride() {
		let modal = this.modalCtrl.create(CancelridePage);
		modal.present();
  }

	riderinfo() {
		let modal = this.modalCtrl.create(RiderinfoPage, { ride_data: this.ride_data, rider_data: this.rider_data });
		modal.present();
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	location() {

		const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
		const ride_id = this.ride_data.ride_id;

		let loading = this.loadingcontroller.create({
			content: 'Confirming Arrival ...'
		});
		loading.present();

		this.bmpapiProvider.driver_arrived(bmp_jwt,ride_id).subscribe(response => {
			loading.dismiss();
			this.response = response;
			console.log(this.response);
			localStorage.setItem('bmp_currentPage', "LocationPage");
			localStorage.setItem('bmp_cp_ride_data', JSON.stringify(this.ride_data));
			localStorage.setItem('bmp_cp_rider_data', JSON.stringify(this.rider_data));
			this.app.getRootNav().setRoot(LocationPage, { ride_data: this.ride_data, rider_data: this.rider_data });
      this.watches.unsubscribe();
		},
		err => {
			loading.dismiss();
			let toast = this.toastCtrl.create({
			message: 'An internet error occured, try again',
			duration: 3000
			});
			toast.present();
		});

	}

  //here, watch ther driver's location to keep updating into the database every 5seconds
//   async watch(){
// this.watches = this._geoLoc.watchPosition();
// this.watches.subscribe((data) => {
// let long=data.coords.longitude;
// let latitude=data.coords.latitude;
// //send to db here
//
// const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
// const ride_id = this.ride_data.ride_id;
//
// this.bmpapiProvider.update_loc(bmp_jwt, ride_id, long, latitude).subscribe(res=>{
//   this.updater=res;
//   if(this.updater.message==="success"){
// // alert('success')
//   }
//   else{
//   //  alert('error')
//   }
// })
//
// });
//   }

	navigate(){
		//send to google map for navigation
		let options: LaunchNavigatorOptions = {
			app: this.launchNavigator.APP.GOOGLE_MAPS
		}

		this.launchNavigator.navigate(this.ride_data.pickup_gps, options)
		.then(
		success => console.log('Launched navigator'),
		error => {
			let toast = this.toastCtrl.create({
			message: 'Error launching navigator, Install google maps',
			duration: 3000
			});
			toast.present();
		}
		);
	}

}
