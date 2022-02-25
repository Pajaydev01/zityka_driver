import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';
import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';

import { TabsPage } from '../tabs/tabs';
import { BrowserPage } from '../browser/browser';
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  response: any;
  credentialsForm: FormGroup;
  r_username: string;
  r_password: string;
  r_token: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private bmpapiProvider: BmpapiProvider, private loadingcontroller: LoadingController, private toastcontroller: ToastController, public alertController: AlertController) {

    this.credentialsForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  ionViewWillEnter() {
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function() {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/61dee0d3b84f7301d32aabf1/1fp79sf57';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }

  login() {
    if (this.credentialsForm.valid) {
      this.r_username = this.credentialsForm.controls['username'].value;
      this.r_password = this.credentialsForm.controls['password'].value;

      let loading = this.loadingcontroller.create({
        content: 'Logging you in ...'
      });
      loading.present();

      this.bmpapiProvider.login(this.r_username, this.r_password).subscribe(response => {
        console.log(response);
        //console.log(this.response.data.user_id);
        this.response = response;
        loading.dismiss();

        //now check if this.response is successful
        if (this.response.status == 1) {

          //* store the response data
          localStorage.setItem('bmp_userdata', JSON.stringify(this.response.data));
          localStorage.setItem('bmp_jwt', JSON.stringify(this.response.jwt));
          localStorage.setItem('bmp_email', this.r_username);
          localStorage.setItem('bmp_password', this.r_password);
          localStorage.setItem('bmp_onlinemode', "offline");

          console.log(this.response.data);

          this.navCtrl.setRoot(TabsPage, {
            loginfrom: 'login'
          });

        } else {
          let alert = this.alertController.create({
            title: 'Unsuccessful',
            subTitle: this.response.message,
            buttons: ['Ok']
          });
          alert.present();
        }
      },
        err => {
          console.log(err);
          loading.dismiss();
          if (err.status == 401) {
            let alert = this.alertController.create({
              title: 'Unsuccessful',
              subTitle: err.error.message,
              buttons: ['Ok']
            });
            alert.present();
          } else {
            let toast = this.toastcontroller.create({
              message: 'An internet error occured, try again',
              duration: 5000
            });
            toast.present();
          }
        });

    } else {
      let toast = this.toastcontroller.create({
        message: 'All fields are compulsory',
        duration: 3000
      });
      toast.present();
    }

  }

  async signupPage() {
    //load alert to show the things they'll be needing
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      title: 'ATTENTION',
      message: "To register as a driver on BMP car, you need to prepare the following documents, as you will upload them during the registration process:<br><strong><i>1. Registration certificate</i><br> <i>2. Vehicle insurance</i><br><i> 3. Vehicle photo / Motorcycle</i><br><i>4. Driver's license</i><br><i>5. National Identity or International Passport</i></strong><br><p>Please click OK to continue only if you have prepared these documents to download for review.</p>",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.navCtrl.push(SignupPage);
          }
        }
      ]
    });

    await alert.present();
  }

  forgotPassword() {
    let paramObj = {
      title: 'Forgot Password',
      url: 'https://www.bmpcar.com/bmp_a/helpers/driverforgotpassword.php'
    };
    this.navCtrl.push(BrowserPage, paramObj);
  }

}
