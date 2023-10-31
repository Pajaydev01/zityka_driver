import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
@Component({
  selector: 'page-fare',
  templateUrl: 'fare.html'
})
export class FarePage {

  ride_data:any;
  rider_data:any;
  ride_summary:any;
  response:any;

  rideamount:string;
  paymentmethod:string;
  profileImg:string;
  ridername:string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.ride_data = JSON.parse(localStorage.getItem('bmp_cp_ride_data'));
    this.rider_data = JSON.parse(localStorage.getItem('bmp_cp_rider_data'));
    this.ride_summary = JSON.parse(localStorage.getItem('bmp_cp_ride_summary'));

    this.rideamount = this.ride_summary.ride_amount;
    this.paymentmethod = this.ride_summary.payment_method;
    this.profileImg = this.rider_data.user_profile_img;
    this.ridername = this.ride_data.rider_name;

  }

  tabs(){
    localStorage.setItem('bmp_currentPage', "");
    this.navCtrl.setRoot(TabsPage);
  }
}