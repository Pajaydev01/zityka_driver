import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zityka.driver',
  appName: 'bmpdriver',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '19',
      'android-targetSdkVersion': '29',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      GOOGLE_MAPS_PLAY_SERVICES_VERSION: '15.0.0',
      orientation: 'portrait',
      GOOGLE_MAPS_ANDROID_API_KEY: 'AIzaSyDF15oh2OMtx5BHgA98CXQSbWJ1pgfxsmA',
      GOOGLE_MAPS_IOS_API_KEY: 'AIzaSyBiUJMWjjEHoa7YiCGiovb_inZEY7RU5P0'
    }
  }
};

export default config;
