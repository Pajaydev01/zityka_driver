import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import { BackgroundMode } from '@ionic-native/background-mode';
import { BmpapiProvider } from '../providers/bmpapi/bmpapi';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { RequestPage } from '../pages/request/request';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  notification_data:any;
  response:any;

  constructor(private platform: Platform, private statusBar: StatusBar,  private splashScreen: SplashScreen, private push: Push, private bmpapiProvider: BmpapiProvider) {
    
    this.platform.ready().then(() => {

      this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

      this.pushSetup();

      //set root page based on the login status of the user
      const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
      if (bmp_jwt != null){
        this.rootPage = TabsPage;
      }else{
        this.rootPage = LoginPage;
      }

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
    
  }

  pushSetup(){
    const options: PushOptions = {
        android: {
          senderID: '29794702032'
        },
        ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
        }
    };
    
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      
      console.log('Received a notification', notification);

      this.notification_data = notification.additionalData;
      console.log('the activity : ',this.notification_data.activity);

      if (this.notification_data.activity == "rideRequest" && localStorage.getItem("bmp_onlinemode") == "online"){
        console.log('request came throught');
        this.nav.push(RequestPage,{ ride_data: this.notification_data });
      }
      /*
      this.backgroundMode.on("activate").subscribe(()=>{
        console.log("i am in");
        this.backgroundMode.unlock();
        this.backgroundMode.moveToForeground();
        this.nav.push(RequestPage,{ ride_data: this.notification_data }); 
      });
      */
    });
    
    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration.registrationId);
      this.bmpapiProvider.token = registration.registrationId;

      const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
      if (bmp_jwt != null){
        //updating login data (especially token)
        const r_email = localStorage.getItem('bmp_email');
        const r_password = localStorage.getItem('bmp_password');
    
        this.bmpapiProvider.login(r_email,r_password).subscribe(response => {
          this.response = response;
          console.log(this.response);
          //now check if this.response is successful
          if (this.response.status == 1 ){
            localStorage.setItem('bmp_userdata', JSON.stringify(this.response.data));
            localStorage.setItem('bmp_jwt', JSON.stringify(this.response.jwt));
            console.log("token and driver data updated");
          }
        },err => {
        });
      }
      
    });
    
    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }

}

