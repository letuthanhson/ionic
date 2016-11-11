import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { DashboardPage } from '../dashboard/dashboard';
import { CounterpartySearchPage } from '../counterparty-search/counterparty-search';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = DashboardPage;
  tab3Root: any = CounterpartySearchPage;
  tab4Root: any = AboutPage;

  constructor() {

  }
}
