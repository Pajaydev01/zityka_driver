import { Component, ViewChild, OnInit, ElementRef, NgZone } from '@angular/core';
import { Platform, NavController, ModalController, ToastController, AlertController, App } from 'ionic-angular';
import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent, Marker, MarkerOptions } from '@ionic-native/google-maps';
import { Geolocation, GeolocationOptions, Geoposition  } from '@ionic-native/geolocation';
import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { RequestPage } from '../request/request';
import { AcceptPage } from '../accept/accept';
import { LocationPage } from '../location/location';
import { Trip_endPage } from '../trip_end/trip_end';
import { FarePage } from '../fare/fare';
import { PowerManagement } from '@ionic-native/power-management/ngx';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	@ViewChild('map') mapElement: ElementRef;
	map: GoogleMap;
	checked: boolean;
	private selfmarker: Marker;
set:boolean=false;
	options: GeolocationOptions;
	success: any;

	locationLastUpdateTime: any;
	locationMinUpdateFrequency: any;
	toneurl : string;
	lookup_triedIDs: any;
	lookup_triedIDsXX: any;
timer:any;
	constructor(public navCtrl: NavController, public app: App, public modalCtrl: ModalController, public zone: NgZone, private _googleMaps: GoogleMaps, private _geoLoc: Geolocation, private toastCtrl: ToastController, private bmpapiProvider: BmpapiProvider, private alertCtrl: AlertController, public platform: Platform, public backgroundMode: BackgroundMode, public localNotifications: LocalNotifications,
  private nativeAudio: NativeAudio,
  public foregroundService: ForegroundService,
   private ringtones: NativeRingtones,private powerManagement: PowerManagement) {

		if (localStorage.getItem("bmp_onlinemode") == "online"){
			this.checked = true;
		}else{
			this.checked = false;
		}
	}


//fetch rides here
load(){
  if (localStorage.getItem("bmp_onlinemode") == "online"){
    console.log(this.lookup_triedIDs);
    const jwt=JSON.parse(localStorage.getItem('bmp_jwt'));
    this.bmpapiProvider.triplookup(jwt,this.lookup_triedIDs).subscribe(response => {
      this.success = response;
      console.log(this.success);
      console.log(this.success.data.ride_id);
      if (this.success.data.ride_id != null){
        if(this.lookup_triedIDs == ""){
          this.lookup_triedIDs = this.success.data.ride_id

        }else{
          this.lookup_triedIDs = this.lookup_triedIDs+","+this.success.data.ride_id;


          //bring up request page
          this.backgroundMode.unlock();
          this.backgroundMode.moveToForeground();
          // this.foregroundService.start('New Ride','Ride Offer','drawable/fsicon',3);
          // clearInterval(this.timer);
          this.show_notify();
          this.app.getRootNav().setRoot(RequestPage,{ride_data: this.success.data.details});
          this.backgroundMode.disable();
          		localStorage.setItem('bmp_onlinemode', "offline");
        }


      }
      else{
        if (this.backgroundMode.isEnabled()){
          // this.backgroundMode.disable();
        }else{
          this.backgroundMode.enable();
        }
      setTimeout(()=>{
          this.background();
      },10000);

        this.remind();


      }
    },err => {
    });

  }
}

remind(){
  if(this.set===false){
    //set time out to wake screen to app in 3mins
      this.set=true;
    setTimeout(()=>{
      this.backgroundMode.unlock();
      this.backgroundMode.moveToForeground();
      this.show_timer();
    },180000);
  }
  else{

  }
}

show_timer(){
    this.set=false;
  this.localNotifications.schedule({
    id:2,
    text:"Listening for ride while app runs in background",
    // silent:t,
    data:{test:"sample"}
  })
}

show_notify(){
  this.ringtones.getRingtone().then((ringtones) => {
    this.toneurl = ringtones[0].Url;
  //  alert(this.toneurl);
    // alert(ringtones[1]);
    for(let i = 0; i < 15; i++) {
      this.ringtones.playRingtone(ringtones[1].Url);

    }
  });

//   this.nativeAudio.preloadSimple('uniqueId1', 'assets/tones/ring.wav').then(data=>{
//     console.log(data);
//   },
//   err=>{
//     console.log(err)
//   });
// this.nativeAudio.play('uniqueId1');
  //play tone for background mode
  this.localNotifications.schedule({
    id:1,
    text:"New Ride Alert",
    sound:'content://assets/tones/ring.wav',
    led:true,
    vibrate:true,
    launch:true,
    data:{test:"sample "}
  })

}


	ionViewDidEnter(){
    this.platform.ready().then(() => {
      this.initMap();
  this.background();
  }
  );
		console.log(localStorage.getItem("bmp_currentPage"));
		if (localStorage.getItem("bmp_currentPage") == "AcceptPage"){
			this.app.getRootNav().setRoot(AcceptPage);
		}
		if (localStorage.getItem("bmp_currentPage") == "LocationPage"){
			this.app.getRootNav().setRoot(LocationPage);
		}
		if (localStorage.getItem("bmp_currentPage") == "Trip_endPage"){
			this.app.getRootNav().setRoot(Trip_endPage);
		}
		if (localStorage.getItem("bmp_currentPage") == "FarePage"){
			this.app.getRootNav().setRoot(FarePage);
		}
    //set up a funtion to fetch rides upon load itself
    console.log('activated');
    this.lookup_triedIDs = "";
    this.lookup_triedIDsXX = 0;
    //service to look for request
      if(this.backgroundMode.isActive()){
  // this.load();
      }
      else{
        setInterval(x => {
          this.lookup_triedIDsXX = this.lookup_triedIDsXX+1;
          console.log(this.lookup_triedIDsXX);
        this.load();
            }, 5000);
      }
	}

  background(){
    this.backgroundMode.enable();
  			this.backgroundMode.on('activate').subscribe(() => {
          this.backgroundMode.disableWebViewOptimizations();
            this.backgroundMode.overrideBackButton();
//take over power here
this.powerManagement.acquire().then(()=>{

  console.log('activated');
  this.lookup_triedIDs = "";
  this.lookup_triedIDsXX = 0;
    this.show_timer();
    this.lookup_triedIDsXX = this.lookup_triedIDsXX+1;
    console.log(this.lookup_triedIDsXX);
    if(this.backgroundMode.isActive()===true){
this.load();
    }
    else{
      this.backgroundMode.enable();
    }

}).catch(err=>{
console.log(err);
});

  });
  			this.backgroundMode.setDefaults({
          silent: false,
          title:"Listening for rides",
        });
    }

	initMap() {
		let loc: LatLng;
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
			//console.log('ok lets see');
			//subscribe to user location
			this._geoLoc.watchPosition().subscribe( res => {
				//once location is gotten, we set the location on the camera.
				//console.log('ok lets see 2');
				let now = new Date();
				let duration;
				try {
					duration = now.getTime() - this.locationLastUpdateTime.getTime();
				} catch (error) {
					duration = 999999999;
				}

				if (this.locationLastUpdateTime == null || duration >= this.locationMinUpdateFrequency) {
					//console.log('Update is needed: ', duration)
					loc = new LatLng(res.coords.latitude, res.coords.longitude);
					//console.log(loc);
					this.moveCamera(loc);

					if (this.selfmarker != null) {
						this.selfmarker.setPosition(loc);
						this.map.addMarker(this.selfmarker);
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
					this.locationLastUpdateTime = now;

					//update the location
					var latlngs = res.coords.latitude+','+res.coords.longitude;
					this.updatelocation(latlngs);
				} else {
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

	moveCamera(loc: LatLng){
		let options: CameraPosition<any> = {
		  //specify center of map
		  target: loc,
		  zoom: 15,
		  tilt: 10
		}
		this.map.moveCamera(options)
	}

	getLocation(){
		return this._geoLoc.getCurrentPosition();
	}

	onlineOfflineToggle() {
		var msg;

		console.log(localStorage.getItem("bmp_onlinemode"));

		if (this.checked){
			msg = "Are you sure you want to go Online?";
		}else{
			msg = "Are you sure you want to go Offline?";
		}

		let alert = this.alertCtrl.create({
			title: 'Confirm Visibility Mode',
			message: msg,
			buttons: [
				{
					text: 'No',
					handler: () => {
						if (this.checked){
							this.checked = false;
						}else{
							this.checked = true;
						}
					}
				},
				{
					text: 'Yes',
					handler: () => {
						if (this.checked){
							localStorage.setItem('bmp_onlinemode', "online");
							this.checked = true;
							//update the token and set online flag
							const bmp_jwt = localStorage.getItem('bmp_jwt');
							const bmp_userdata = JSON.parse(localStorage.getItem('bmp_userdata'));
    						var user_id = bmp_userdata.user_id;
							this.bmpapiProvider.token_update(bmp_jwt,user_id).subscribe(response => {
								console.log(response);
							},err => {
							});

						}else{
							localStorage.setItem('bmp_onlinemode', "offline");
							this.checked = false;
						}
					}
				}
			]
		});
		alert.present();

		console.log(localStorage.getItem("bmp_onlinemode"));
	}

}
