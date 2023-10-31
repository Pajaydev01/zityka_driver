import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';

@Component({
  selector: 'page-mytrips',
  templateUrl: 'mytrips.html',
})
export class MytripsPage {

  tab: string = "past";
  response:any;
  upcoming_items : any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private bmpapiProvider: BmpapiProvider, private loadingcontroller: LoadingController, private toastcontroller: ToastController,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MytripsPage');
  }

  ionViewDidEnter() : void
  {
    this.upcoming_items = [];
    const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));

    let loading = this.loadingcontroller.create({
      content: 'Chargement de tous les voyages ...'
    });
    loading.present();

    this.bmpapiProvider.ride_history(bmp_jwt).subscribe(response => {
      loading.dismiss();
      this.response = response;

      //now format the content of item properly
      for(let items of this.response.data) {
        var rideId, rider_name, user_profile_img,pickup_text,dropoff_text,ride_date,ride_amount,ride_status,ride_class,pay_method;
        rideId = items.rideId;
        rider_name = items.rider_name;
        user_profile_img = "https://bmpcar.com/uploads/profile/original/"+items.user_profile_img;
        pickup_text = items.pickup_text;
        dropoff_text = items.dropoff_text;
        ride_date = items.ride_date;
        ride_amount = items.ride_amount;
        ride_status = items.ride_status;
        ride_class = items.ride_class;
        pay_method = items.pay_method+" Payment";

        this.upcoming_items.push({"rideId":rideId, "rider_name":rider_name, "user_profile_img":user_profile_img, "pickup_text":pickup_text, "dropoff_text":dropoff_text, "ride_date":ride_date, "ride_amount": ride_amount, "ride_status":ride_status, "ride_class": ride_class, "pay_method":pay_method});

      }

      //this.items = this.response.data;
    },
    err => {
      loading.dismiss();
      let toast = this.toastcontroller.create({
        message: "Une erreur Internet s'est produite, réessayer",
        duration: 5000
      });
      toast.present();
    });
  }

}
