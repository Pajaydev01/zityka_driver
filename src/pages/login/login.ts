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

  login() {
    if (this.credentialsForm.valid) {
      this.r_username = this.credentialsForm.controls['username'].value;
      this.r_password = this.credentialsForm.controls['password'].value;

      let loading = this.loadingcontroller.create({
        content: "S'il vous plaît, attendez ..."
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
            title: 'Infructueux',
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
              title: 'Infructueux',
              subTitle: err.error.message,
              buttons: ['Ok']
            });
            alert.present();
          } else {
            let toast = this.toastcontroller.create({
              message: "Une erreur Internet s'est produite, réessayez",
              duration: 5000
            });
            toast.present();
          }
        });

    } else {
      let toast = this.toastcontroller.create({
        message: 'Tous les champs sont obligatoires',
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
      message: "Pour vous inscrire en tant que conducteur sur BMP car, vous devez préparer les documents suivants, car vous les téléchargerez au cours du processus d'inscription :<br><strong><i>1. Certificat d' immatriculation</i><br> <i>2. Assurance du véhicule</i><br><i> 3. Photo du véhicule / Moto/Moto</i><br><i>4. Permis de conduire</i><br><i>5. Carte Nationale d'identité ou Passeport International</i></strong><br><p>Veuillez cliquer sur D'accord pour continuer uniquement si vous avez préparé ces documents à télécharger pour vérification.</p>",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'D accord',
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
      title: "Mot de passe oublié",
      url: 'https://www.zityka.com/bmp_a/helpers/driverforgotpassword.php'
    };
    this.navCtrl.push(BrowserPage, paramObj);
  }

}
