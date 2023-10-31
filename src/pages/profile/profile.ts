import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController, ToastController, } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';
import { BrowserPage } from '../browser/browser'
import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  change:boolean=false;
    drivername:string;
    averageRating:string;
    vehicleModel:string;
    vehicleNumber:string;
    profileImg:string;
    data:any;
    ratingStars: any = [];
    address:any="";
  resp:any;
  isExecutive:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, private callNumber: CallNumber, private loadingcontroller: LoadingController, private toastCtrl: ToastController, private bmpapiProvider: BmpapiProvider){
    this.data = JSON.parse(localStorage.getItem("bmp_userdata"));
    //console.log(this.data);
    //console.log(this.data.user_profile_img);
    this.drivername = this.data.user_first_name+" "+this.data.user_last_name;
    this.profileImg = this.data.user_profile_img;
    this.averageRating = this.data.average_rating;
    this.vehicleModel = this.data.vehicle_model;
    this.vehicleNumber = this.data.vehicle_number;

    const averageRating  = this.data.average_rating;

    for(let i=1; i <= 5; i++){
			if (averageRating >= i){
				this.ratingStars.push({enable: true});
			}else{
				this.ratingStars.push({enable: false});
			}
		}
  }

  ionViewDidLoad() {
    ///get user profile
    //console.log('ionViewDidLoad ProfilePage');
  }
  ionViewDidEnter(){
    let loading = this.loadingcontroller.create({
      content: "Fetching user info"
    });

    loading.present();
    this.bmpapiProvider.get_user(this.data.user_id,JSON.parse(localStorage.getItem("bmp_jwt"))).subscribe((res:any)=>{
      loading.dismiss()
     // console.log('driver',res)
     res.data.customer.driverAllowsExecutive==null || res.data.customer.driverAllowsExecutive==false?this.isExecutive=false:this.isExecutive=true;

    })
  }

  aboutPage(){
    this.navCtrl.push(AboutPage);
  }
  helpPage(){
    //this.navCtrl.push(HelpPage);
    this.callNumber.callNumber(`09066416413`, true);
  }
  updateExec=async ()=>{
    let loading = this.loadingcontroller.create({
      content: "Updating info..."
    });

    loading.present();
 //   drivers/executiveRide
    try {

      const body={
       user_id:parseInt(this.data.user_id),
        status:this.isExecutive
      }
      await this.bmpapiProvider.post('url','/drivers/executiveRide',body,'POST');  
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: 'executive status changed',
        duration: 3000
        });
        toast.present();
    //  console.log(send)
    } catch (error) {
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000
        });
        toast.present();
      loading.dismiss()
    }

  }

  documentsPage(){
    //this.navCtrl.push(DocumentsPage);
    let paramObj = {
      title : 'My Documents',
      url : 'https://www.zityka.com/bmp_a/helpers/documents.php'
    };
    this.navCtrl.push(BrowserPage, paramObj);
  }

  wallet(){
    //this.navCtrl.push(WalletPage);
  }

  mytripsPage(){
    //this.navCtrl.push(MytripsPage);
  }

  radius(){
    this.change=true;
  }
  changer(){
    if(this.address==""){
      let toast = this.toastCtrl.create({
			message: 'Veuillez remplir le champ',
			duration: 3000
			});
			toast.present();
    }
    else{
//show loader
let loading = this.loadingcontroller.create({
  content: "Mise à jour de l'emplacement"
});
loading.present();

	const bmp_jwt = JSON.parse(localStorage.getItem('bmp_jwt'));
  let body={
    location:this.address
  }
      this.bmpapiProvider.update_driver_loc(bmp_jwt, body).subscribe(res=>{
        this.resp=res
        console.log(this.resp.longitude)
        if(this.resp.message==="success"){
        loading.dismiss()
          let toast = this.toastCtrl.create({
          message: 'Le lieu de prise en charge a été défini avec succès',
          duration: 3000
          });
          toast.present();
          this.change=false;
        }
        else if(this.resp.message==="empty"){
          loading.dismiss()
          let toast = this.toastCtrl.create({
          message: 'Sorry, enter a valid address',
          duration: 3000
          });
          toast.present();
        }
      })
    }
  }


  logout(){
    localStorage.clear();
    this.app.getRootNav().setRoot(LoginPage);
  }

}
