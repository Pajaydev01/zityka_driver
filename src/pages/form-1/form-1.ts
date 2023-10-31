import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastController, AlertController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import{ dataService } from '../../services/data-service';
import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';
import { LoadingController } from 'ionic-angular';
import { Base64 } from '@ionic-native/base64';
import { HttpEvent, HttpEventType } from '@angular/common/http';
@IonicPage()
@Component({
  selector: 'page-form-1',
  templateUrl: 'form-1.html',
})
export class Form_1Page {
details:any;
progress:any;
progresser:boolean=false;
//images datas
image:any;
car_reg:any;
pass:any;
insurance:any;
car_photo:any;
license:any;


credentialsForm: FormGroup;
email:any;
resp:any;


//divs
non:boolean=true;
snapped:boolean=false;
snapped_1:boolean=false;
snapped_2:boolean=false;
snapped_3:boolean=false;
passport:boolean=false;
form:boolean=false;
wait:boolean=false;

//account
r_banktype:string;
r_account_number:string;
r_color:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
   private toastcontroller: ToastController, public alertController: AlertController,private emailComposer: EmailComposer,private formBuilder: FormBuilder,private data:dataService, private bmpapiProvider: BmpapiProvider,private loadingcontroller: LoadingController,private base64: Base64) {
     this.credentialsForm = this.formBuilder.group({
       banktype: ['',Validators.required],
       account_number: ['',Validators.required],
       color: ['',Validators.required]
     });
  }



  ionViewDidLoad() {
  }

//take a selfie here
  snap(){
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // Handle error
      let filepath: string=imageData;
      this.base64.encodeFile(filepath).then((base64File: string) => {
        this.image=base64File.replace("data:image/*;charset=utf-8;base64,","");
        this.non=false;
        this.snapped=true;
      }, (err) => {
        console.log(err);
      });
}, (err) => {
});
  }

  //upload vehicle document here
    snap_d(){
      const options: CameraOptions = {
        quality: 30,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
      //  saveToPhotoAlbum: false,
        correctOrientation: true,
        allowEdit: true
      }
      this.camera.getPicture(options).then((imageData) => {
        // Handle error
          let filepath: string=imageData.substring(0, imageData.lastIndexOf('?'));;
        this.base64.encodeFile(filepath).then((base64File: string) => {
          this.car_reg=base64File.replace("data:image/*;charset=utf-8;base64,","");
          this.snapped=false;
          this.snapped_1=true;
        }, (err) => {
          console.log(err);
        });


  }, (err) => {

  });
    }

    //upload vehicle document here
      snap_a(){
        const options: CameraOptions = {
          quality: 30,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: this.camera.DestinationType.FILE_URI,
        //  saveToPhotoAlbum: false,
          correctOrientation: true,
          allowEdit: true
        }
        this.camera.getPicture(options).then((imageData) => {
          // Handle error
            let filepath: string=imageData.substring(0, imageData.lastIndexOf('?'));;
          this.base64.encodeFile(filepath).then((base64File: string) => {
            this.insurance=base64File.replace("data:image/*;charset=utf-8;base64,","");
            this.snapped_1=false;
            this.snapped_2=true;
          }, (err) => {
            console.log(err);
          });


    }, (err) => {

    });
      }


      //upload vehicle document here
        snap_b(){
          const options: CameraOptions = {
            quality: 30,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.FILE_URI,
          //  saveToPhotoAlbum: false,
            correctOrientation: true,
            allowEdit: true
          }
          this.camera.getPicture(options).then((imageData) => {
            // Handle error
              let filepath: string=imageData.substring(0, imageData.lastIndexOf('?'));;
            this.base64.encodeFile(filepath).then((base64File: string) => {
              this.car_photo=base64File.replace("data:image/*;charset=utf-8;base64,","");
              this.snapped_2=false;
              this.snapped_3=true;
            }, (err) => {
              console.log(err);
            });


      }, (err) => {

      });
        }

        //upload vehicle document here
          snap_c(){
            const options: CameraOptions = {
              quality: 30,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.FILE_URI,
            //  saveToPhotoAlbum: false,
              correctOrientation: true,
              allowEdit: true
            }
            this.camera.getPicture(options).then((imageData) => {
              // Handle error
                let filepath: string=imageData.substring(0, imageData.lastIndexOf('?'));;
              this.base64.encodeFile(filepath).then((base64File: string) => {
                this.license=base64File.replace("data:image/*;charset=utf-8;base64,","");
                this.snapped_3=false;
                this.passport=true;
              }, (err) => {
                console.log(err);
              });


        }, (err) => {

        });
          }

    //upload passport
      snap_p(){
        const options: CameraOptions = {
          quality: 30,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: this.camera.DestinationType.FILE_URI,
          //saveToPhotoAlbum: false,
          correctOrientation: true,
          allowEdit: true
        }
        this.camera.getPicture(options).then((imageData) => {
          // Handle error
          let filepath:string=imageData.substring(0, imageData.lastIndexOf('?'));

          this.base64.encodeFile(filepath).then((base64File: string) => {
            this.pass=base64File.replace("data:image/*;charset=utf-8;base64,","");
            this.passport=false;
            this.form=true;
          }, (err) => {
            console.log(err);
          });
      }, (err) => {
      });
      }


send(){
  if (this.credentialsForm.valid){
    this.r_banktype = this.credentialsForm.controls['banktype'].value;
    this.r_account_number= this.credentialsForm.controls['account_number'].value;
    this.r_color = this.credentialsForm.controls['color'].value;

//retrive saved datas here
let datas=this.data.pull_datas();
this.details=datas;
//load and process
let loading = this.loadingcontroller.create({
  content: "Kindly excercise patience while your documents are being uploaded, this may take a little while."
});
loading.present();
//convert files and upload

this.bmpapiProvider.register(this.details.email,this.details.firstname,this.details.lastname,this.details.phone,this.details.location,this.details.ridetype,this.r_banktype,this.r_account_number,this.r_color,this.image,this.car_reg,this.pass,this.insurance,this.car_photo,this.license).subscribe((event: HttpEvent<any>)=>{
  loading.dismiss();
  this.form=false;
  this.progresser=true;

  switch (event.type) {
         case HttpEventType.Sent:
           console.log('Request has been made!');
           break;
         case HttpEventType.ResponseHeader:
           console.log('Response header has been received!');
           break;
         case HttpEventType.UploadProgress:
      this.progress =Math.round(event.loaded / event.total * 100);
            //this.progress = Math.round(event.loaded / event.total);
           console.log(`Uploaded! ${this.progress}%`);
           break;
         case HttpEventType.Response:
         this.resp=event.body
           console.log('User successfully created!', event.body);
           setTimeout(() => {
             this.progress = 0;
           }, 1500);
           if(this.resp.message==='success'){
             this.progresser=false;
             //  this.form=false;
               this.wait=true;
           }
           else{
             //  loading.dismiss();
               this.toast('Erreur de téléchargement');
           }
break;
       }
})

  }
  else{
this.toast('Merci de compléter tous les champs')
  }
}

//go back to login
back(){
  this.navCtrl.setRoot(LoginPage);
}

  toast(param){
    let toast = this.toastcontroller.create({
      message: param,
      duration: 3000
    });
    toast.present();
  }

}
