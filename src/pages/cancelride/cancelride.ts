import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-cancelride',
  templateUrl: 'cancelride.html'
})
export class CancelridePage {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {

  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
