import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { HomePage } from '../home/home';
import { MytripsPage } from '../mytrips/mytrips';
import { WalletPage } from '../wallet/wallet';
import { ProfilePage } from '../profile/profile';
import { BmpapiProvider } from '../../providers/bmpapi/bmpapi';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MytripsPage;
  tab3Root = WalletPage;
  tab4Root = ProfilePage;

  response:any;
  
  constructor(private bmpapiProvider: BmpapiProvider, public platform: Platform) {

  }

}
