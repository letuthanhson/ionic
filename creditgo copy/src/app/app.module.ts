import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CounterpartySearchPage } from '../pages/counterparty-search/counterparty-search';
import { CounterpartyInfoPage } from '../pages/counterparty-info/counterparty-info';
import { CounterpartyCaPage } from '../pages/counterparty-ca/counterparty-ca';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { InstaService } from '../services/insta-service';
import { ChartModalPage } from '../pages/chart-modal/chart-modal';
import { BubbleChartComponent } from '../components/bubble-chart/bubble-chart';
import { HighchartsChartComponent } from '../components/highcharts-chart/highcharts-chart';

import { TabsPage } from '../pages/tabs/tabs';
@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AboutPage,
    ContactPage,
    HomePage,
    CounterpartySearchPage,
    CounterpartyInfoPage,
    CounterpartyCaPage,
    DashboardPage,
    ChartModalPage,
    TabsPage,
    BubbleChartComponent,
    HighchartsChartComponent,
    
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    NgIdleKeepaliveModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AboutPage,
    ContactPage,
    HomePage,
    CounterpartySearchPage,
    CounterpartyInfoPage,
    CounterpartyCaPage,
    DashboardPage,
    ChartModalPage,
    TabsPage
  ],
  providers: [InstaService]
})
export class AppModule {}
