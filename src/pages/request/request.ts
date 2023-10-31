import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController, ToastController} from 'ionic-angular';
import { AcceptPage } from '../accept/accept';
import { TabsPage } from '../tabs/tabs';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';

@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {
	ridername:string;
	pickup:string;
	ride_data:any;
	ratingStars: any = [];
  	profileImg: String;
	toneurl : string;
  	response:any;
data:any={}
  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, private ringtones: NativeRingtones, private loadingcontroller: LoadingController, private bmpapiProvider: BmpapiProvider, private toastcontroller: ToastController) {

    console.log('Ride data',JSON.stringify(navParams.get('ride_data')));
		this.ride_data = navParams.get('ride_data');

		this.ridername = this.ride_data.full_name;
		this.pickup = this.ride_data.address;
		this.profileImg = this.ride_data.user_profile_img;
		const averageRating  = this.ride_data.average_rating;
		this.data['info']=navParams.get('details');
		for(let i=1; i <= 5; i++){
			if (averageRating >= i){
				this.ratingStars.push({enable: true});
			}else{
				this.ratingStars.push({enable: false});
			}
    }

  }

  ionViewDidEnter() {
		this.ringtones.getRingtone().then((ringtones) => {
			this.toneurl = ringtones[0].Url;
			console.log(ringtones);
			for(let i = 0; i < 15; i++) {
				this.ringtones.playRingtone(ringtones[0].Url);
			}
		});
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestPage');
  }

  acceptPage() {

		const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
		const ride_id = this.ride_data.ride_id;

		let loading = this.loadingcontroller.create({
			content: 'Accepter la balade...'
		});
		loading.present();

		this.bmpapiProvider.accept_ride(bmp_jwt,ride_id).subscribe(response => {
			loading.dismiss();
			this.response = response;
			console.log(this.response);
			localStorage.setItem('bmp_currentPage', "AcceptPage");
			localStorage.setItem('bmp_cp_ride_data', JSON.stringify(this.response.data));
			localStorage.setItem('bmp_cp_rider_data', JSON.stringify(this.ride_data));
			this.app.getRootNav().setRoot(AcceptPage, { ride_data: this.response.data, rider_data: this.ride_data });
		},
		err => {
			loading.dismiss();
			let toast = this.toastcontroller.create({
			message: "Une erreur Internet s'est produite, réessayer",
			duration: 3000
			});
			toast.present();
		});
	}

	declineRequest(){
		this.app.getRootNav().setRoot(TabsPage);
	}

}
