import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';

import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  response:any;
  account_bal:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private bmpapiProvider: BmpapiProvider, private loadingcontroller: LoadingController, private toastcontroller: ToastController,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
  }

  ionViewDidEnter() : void
  {
    const bmp_userdata = JSON.parse(localStorage.getItem('bmp_userdata'));
    var user_id = bmp_userdata.user_id;
    console.log(bmp_userdata);
    console.log(user_id);

    let loading = this.loadingcontroller.create({
      content: 'Loading Balance ...'
    });
    loading.present();

    this.bmpapiProvider.driver_profile(user_id).subscribe(response => {
      loading.dismiss();
      this.response = response;

      this.account_bal = this.response.data["account_balance"];
      //this.items = this.response.data;

    },
    err => {
      loading.dismiss();
      let toast = this.toastcontroller.create({
        message: 'An internet error occured, try again',
        duration: 3000
      });
      toast.present();
    });

  }

  addmoney(){
    //this.navCtrl.push(AddmoneyPage);
    /*
    let toast = this.toastcontroller.create({
      message: 'Withdrawal Request Sent to Admin For Processing',
      duration: 9000
    });
    toast.present();
    */

    const bmp_userdata = JSON.parse(localStorage.getItem('bmp_userdata'));
    var user_id = bmp_userdata.user_id;
    console.log(bmp_userdata);
    console.log(user_id);

    let loading = this.loadingcontroller.create({
      content: 'Envoi de la demande de retrait...'
    });
    loading.present();

    this.bmpapiProvider.driver_withdraw(user_id).subscribe(response => {
      loading.dismiss();
      this.response = response;

      let toast = this.toastcontroller.create({
        message: "Demande de retrait envoyée à l'administrateur pour traitement",
        duration: 5000
      });
      toast.present();

    },
    err => {
      loading.dismiss();
      let toast = this.toastcontroller.create({
        message: 'An internet error occured, try again',
        duration: 3000
      });
      toast.present();
    });


  }

}
