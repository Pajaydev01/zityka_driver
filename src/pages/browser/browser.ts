import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-browser',
  templateUrl: 'browser.html',
})
export class BrowserPage {

  title:string;
  url:string;
  mainurl:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitize: DomSanitizer) {
    //get passed params
    this.title = this.navParams.get('title');
    this.url = this.navParams.get('url');
    this.mainurl = this.urlpaste();
  }

  urlpaste(){
    return this.sanitize.bypassSecurityTrustResourceUrl(this.url);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrowserPage');
  }

}
