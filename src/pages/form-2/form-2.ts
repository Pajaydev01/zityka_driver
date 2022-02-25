import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastController, AlertController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { dataService } from '../../services/data-service';
import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';
import { LoadingController } from 'ionic-angular';
import { Base64 } from '@ionic-native/base64';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FilePath } from '@ionic-native/file-path';

declare var require: any;
declare var faceLandmarksDetection;
declare var mobilenet;
@IonicPage()
@Component({
  selector: 'page-form-2',
  templateUrl: 'form-2.html',
})
export class Form_2Page {
  details: any;
  loader
  progress: any;
  //images datas
  image: any;
  poi: any;
  pass: any;
  Dlicence: any;
  statement: any;
  Plicense: any;
  filepath: any;
  progresser: boolean = false;
  credentialsForm: FormGroup;
  email: any;
  resp: any;
  formData;
  imgs
  //divs
  non: boolean = true;
  snapped: boolean = false;
  snapped_1: boolean = false;
  snapped_2: boolean = false;
  snapped_3: boolean = false;
  snapped_4: boolean = false;
  snapped_5: boolean = false;
  snapped_6: boolean = false;

  passport: boolean = false;
  form: boolean = false;
  wait: boolean = false;

  datas: any = {};
  //account
  r_banktype: string;
  r_account_number: string;
  r_color: string;

  body: any;
  testy: any;
  @ViewChild('img') img: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
    private toastcontroller: ToastController, public alertController: AlertController, private emailComposer: EmailComposer, private formBuilder: FormBuilder, private data: dataService, private bmpapiProvider: BmpapiProvider, private loadingcontroller: LoadingController, private base64: Base64,
    private filePath: FilePath) {
    this.credentialsForm = this.formBuilder.group({
      banktype: ['', Validators.required],
      account_number: ['', Validators.required],
      color: ['', Validators.required],
      dvla: ['', Validators.required]
    });
    // require('@tensorflow/tfjs-backend-wasm')
    // this.faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');
  }



  ionViewDidLoad() {
  }

  // do(ev) {
  //   console.log(ev)
  //   let file = ev.target.files[0];
  //
  //   const data = new FileReader();
  //   data.readAsDataURL(file);
  //   data.onload = (dataReader) => {
  //     this.formData = dataReader;
  //     this.imgs = this.formData.target.result;
  //     this.main();
  //     let image_data = (this.formData.target.result.substr(0, 22) === "data:image/png;base64,") ? this.formData.target.result.replace("data:image/png;base64,", "") : this.formData.target.result.replace("data:image/jpeg;base64,", "");
  //     console.log(this.formData)
  //
  //     // this.images = image_data;
  //     // this.image=this.formData.target.result;
  //     // this.imager=true;
  //   }
  // }

  //take a selfie here
  snap() {
    // this.main("imgd.aeplcdn.com/1056x594/n/cw/ec/44407/kiger-exterior-right-front-three-quarter-12.jpeg?q=85&wm=1");
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: 1
    }
    this.camera.getPicture(options).then((imageData) => {
      this.loader = this.loadingcontroller.create({
        content: "Please wait while we analyze your selfie picture..."
      });
      this.loader.present();
      this.imgs = (<any>window).Ionic.WebView.convertFileSrc(imageData);
      this.main();
      this.filepath = imageData;
    }, (err) => {
      console.log(err)

    });
  }

  //process image after analyzing with AI here
  processImage() {
    this.base64.encodeFile(this.filepath).then((base64File: string) => {
      this.datas['selfie'] = base64File.replace("data:image/*;charset=utf-8;base64,", "");
      this.loader.dismiss();
      this.non = false;
      this.snapped = true;
    }, (err) => {
      console.log(err);
    });
  }

  //upload vehicle document here
  snap_d() {
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
      let filepath: string = imageData.substring(0, imageData.lastIndexOf('?'));;
      this.base64.encodeFile(filepath).then((base64File: string) => {
        this.poi = base64File.replace("data:image/*;charset=utf-8;base64,", "");
        this.snapped = false;
        this.snapped_1 = true;
      }, (err) => {
        console.log(err);
      });


    }, (err) => {

    });
  }

  //upload vehicle document here
  snap_a() {
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
      let filepath: string = imageData.substring(0, imageData.lastIndexOf('?'));;
      this.base64.encodeFile(filepath).then((base64File: string) => {
        this.Dlicence = base64File.replace("data:image/*;charset=utf-8;base64,", "");
        this.snapped_1 = false;
        this.snapped_2 = true;
      }, (err) => {
        console.log(err);
      });


    }, (err) => {

    });
  }


  //upload vehicle document here
  snap_b() {
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
      let filepath: string = imageData.substring(0, imageData.lastIndexOf('?'));;
      this.base64.encodeFile(filepath).then((base64File: string) => {
        this.statement = base64File.replace("data:image/*;charset=utf-8;base64,", "");
        this.snapped_2 = false;
        this.snapped_3 = true;
      }, (err) => {
        console.log(err);
      });


    }, (err) => {

    });
  }

  //upload vehicle document here
  snap_c() {
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
      let filepath: string = imageData.substring(0, imageData.lastIndexOf('?'));;
      this.base64.encodeFile(filepath).then((base64File: string) => {
        this.Plicense = base64File.replace("data:image/*;charset=utf-8;base64,", "");
        this.snapped_3 = false;
        this.passport = true;
      }, (err) => {
        console.log(err);
      });


    }, (err) => {

    });
  }


  //create a general uploading pane here except for selfie taking
  snap_g(type, view, next) {
    const options: CameraOptions = {
      quality: 15,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      //  saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit: true
    }
    this.camera.getPicture(options).then((imageData) => {
      // Handle error
      let filepath: string = imageData.substring(0, imageData.lastIndexOf('?'));;
      this.base64.encodeFile(filepath).then((base64File: string) => {
        this.datas[type] = base64File.replace("data:image/*;charset=utf-8;base64,", "");
        this[view] = false;
        this[next] = true;
      }, (err) => {
        console.log(err);
      });


    }, (err) => {

    });
  }
  add(type, view, next) {
    this.datas[type] = this.credentialsForm.controls['dvla'].value;
    this[view] = false;
    this[next] = true;
  }


  //upload passport
  snap_p(name) {
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
      let filepath: string = imageData.substring(0, imageData.lastIndexOf('?'));

      this.base64.encodeFile(filepath).then((base64File: string) => {
        this.datas[name] = base64File.replace("data:image/*;charset=utf-8;base64,", "");
        this.passport = false;
        this.form = true;
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
    });
  }


  send() {
    if (this.credentialsForm.valid) {
      this.r_banktype = this.credentialsForm.controls['banktype'].value;
      this.r_account_number = this.credentialsForm.controls['account_number'].value;
      this.r_color = this.credentialsForm.controls['color'].value;

      //retrive saved datas here
      let datas = this.data.pull_datas();
      this.details = datas;
      let body = {
        ...this.details,
        ...this.datas
      }
      body['bankType'] = this.r_banktype;
      body['accountNumber'] = this.r_account_number;
      body['color'] = this.r_color

      //load and process
      let loading = this.loadingcontroller.create({
        content: "Please wait..."
      });
      loading.present();
      //convert files and upload

      this.bmpapiProvider.register(body).subscribe((event: HttpEvent<any>) => {
        //get upload progress
        loading.dismiss();
        this.form = false;
        this.progresser = true;
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            //this.progress = Math.round(event.loaded / event.total);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            this.resp = event.body
            console.log('User successfully created!', event.body);
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
            if (this.resp.message === 'success') {
              this.progresser = false;
              //  this.form=false;
              this.wait = true;
            }
            else {
              //  loading.dismiss();
              this.toast(body);
            }
            break;
        }
      })

    }
    else {
      this.toast('Please complete all fields')
    }
  }

  //go back to login
  back() {
    this.navCtrl.setRoot(LoginPage);
  }

  toast(param) {
    let toast = this.toastcontroller.create({
      message: param,
      duration: 3000
    });
    toast.present();
  }



  //face recognition
  async main() {
    // Load the MediaPipe Facemesh package.
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
    const img = this.img.nativeElement
    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
    // array of detected faces from the MediaPipe graph. If passing in a video
    // stream, a single prediction per frame will be returned.
    try {
      const predictions = await model.estimateFaces({
        input: img
      });

      if (predictions.length > 0) {
        console.log(predictions[0].faceInViewConfidence)
        if (predictions[0].faceInViewConfidence === 1) {
          //proceed
          this.processImage();
        }
        else {
          this.loader.dismiss();
          //return an error to snap picutre again
          this.toast("Kindly position your self well to fully show your face and retake the picture");
        }
      }
      else {
        this.loader.dismiss();
        //return an error to retake pcture here
        this.toast('Sorry, we could not detect any face, kindly retake your picture in a brighter environment');
      }
    }
    catch (err) {
      this.loader.dismiss();
      this.toast("Sorry, an erro occured, please try again");
      console.log(err)
    }
  }
}
