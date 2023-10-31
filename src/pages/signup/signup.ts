import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Form_1Page } from '../form-1/form-1';
import{ dataService } from '../../services/data-service';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {

  response:any;
  credentialsForm: FormGroup;

  r_firstname:string;
  r_lastname:string;
  r_email:string;
  r_phonenumber:string;
  r_location:string;
  r_rideType:string;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private bmpapiProvider: BmpapiProvider, private loadingcontroller: LoadingController, private toastcontroller: ToastController, public alertController: AlertController, private data:dataService) {
    this.credentialsForm = this.formBuilder.group({
      firstname: ['',Validators.required],
      lastname: ['',Validators.required],
      email: ['',Validators.required],
      phonenumber: ['',Validators.required],
      location: ['',Validators.required],
    rideType: ['',Validators.required]
    });
  }

  signup(){
    if (this.credentialsForm.valid){
      this.r_firstname = this.credentialsForm.controls['firstname'].value;
      this.r_lastname = this.credentialsForm.controls['lastname'].value;
      this.r_email = this.credentialsForm.controls['email'].value;
      this.r_phonenumber = this.credentialsForm.controls['phonenumber'].value;
      this.r_location = this.credentialsForm.controls['location'].value;
      this.r_rideType = this.credentialsForm.controls['rideType'].value;

//save the information into a service page and proceed to the next page to take selfie
let data={
  firstname:this.r_firstname,
  lastname:this.r_lastname,
  email:this.r_email,
  phone:this.r_phonenumber,
  location:this.r_location,
  ridetype:this.r_rideType
}
this.data.store_datas(data);
//move to next page to take selfie
this.navCtrl.setRoot(Form_1Page);
   }
   else{
     let toast = this.toastcontroller.create({
       message: 'Tous les champs sont obligatoires',
       duration: 3000
     });
     toast.present();
 }
  }


 loginPage(){
      this.navCtrl.setRoot(LoginPage);
  }

}
