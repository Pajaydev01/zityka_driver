import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Form_1Page } from '../pages/form-1/form-1';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { BrowserPage } from '../pages/browser/browser';
import { ProfilePage } from '../pages/profile/profile';
import { MytripsPage } from '../pages/mytrips/mytrips';
import { WalletPage } from '../pages/wallet/wallet';
import { AboutPage } from '../pages/about/about';
import { RequestPage } from '../pages/request/request';
import { AcceptPage } from '../pages/accept/accept';
import { CancelridePage } from '../pages/cancelride/cancelride';
import { LocationPage } from '../pages/location/location';
import { RiderinfoPage } from '../pages/riderinfo/riderinfo';
import { FarePage } from '../pages/fare/fare';
import { Trip_endPage } from '../pages/trip_end/trip_end';
import { SignupPage } from '../pages/signup/signup';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { BmpapiProvider } from '../providers/bmpapi/bmpapi';
import { Push } from '@ionic-native/push';
import { CallNumber } from '@ionic-native/call-number';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { PowerManagement } from '@ionic-native/power-management/ngx';
import{ dataService } from '../services/data-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { EmailComposer } from '@ionic-native/email-composer';
import { Base64 } from '@ionic-native/base64';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MytripsPage,
    WalletPage,
    ProfilePage,
    LoginPage,
    TabsPage,
    BrowserPage,
    AboutPage,
    RequestPage,
    AcceptPage,
    CancelridePage,
    LocationPage,
    RiderinfoPage,
    Trip_endPage,
    FarePage,
    SignupPage,
    Form_1Page
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MytripsPage,
    WalletPage,
    ProfilePage,
    LoginPage,
    TabsPage,
    BrowserPage,
    AboutPage,
    RequestPage,
    AcceptPage,
    CancelridePage,
    LocationPage,
    RiderinfoPage,
    Trip_endPage,
    FarePage,
    SignupPage,
    Form_1Page
  ],
  providers: [
  PowerManagement,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BmpapiProvider,
    Geolocation,
    GoogleMaps,
    Push,
    CallNumber,
    NativeRingtones,
    BackgroundMode,
    LaunchNavigator,
    LocalNotifications,
    ForegroundService,
    NativeAudio,
    dataService,
    Camera,
    EmailComposer,
    Base64
  ]
})
export class AppModule {}
