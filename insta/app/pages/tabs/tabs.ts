import {Component} from '@angular/core';
import {HomePage} from '../home/home';
import {AboutPage} from '../about/about';
import {CounterpartySearchPage} from '../counterparty-search/counterparty-search';
import {DashboardPage} from '../dashboard/dashboard';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = DashboardPage;
    this.tab3Root = CounterpartySearchPage;
    this.tab4Root = AboutPage;
  
  }
}
