import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, NavParams} from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

//import { CancelridePage } from '../cancelride/cancelride';
@Component({
  selector: 'page-riderinfo',
  templateUrl: 'riderinfo.html'
})
export class RiderinfoPage {

  ride_data:any;
  rider_data:any;

  ridername: string;
  ridername2: string;
  riderphone: string;
  ratingStars: any = [];
  averageRating: string;
  profileImg: string;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public viewCtrl: ViewController, public navParams: NavParams, private callNumber: CallNumber) {
    console.log(navParams.get('ride_data'));
		console.log(navParams.get('rider_data'));
		this.ride_data = navParams.get('ride_data');
    this.rider_data = navParams.get('rider_data');

    this.ridername = this.rider_data.full_name;
    this.ridername2 = this.ride_data.rider_name;
    this.riderphone = this.rider_data.user_mobile;
    this.profileImg = this.rider_data.user_profile_img;

    const averageRating  = this.rider_data.average_rating;

    if(averageRating != null){
      this.averageRating = averageRating;
    }else{
      this.averageRating = "0.0";
    }

		for(let i=1; i <= 5; i++){
			if (averageRating >= i){
				this.ratingStars.push({enable: true});
			}else{
				this.ratingStars.push({enable: false});
			}
		}

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  call(){
    this.callNumber.callNumber(this.riderphone, true);
  }

}
