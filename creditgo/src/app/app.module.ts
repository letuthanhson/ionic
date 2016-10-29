import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CounterpartySearchPage } from '../pages/counterparty-search/counterparty-search';
import { CounterpartyInfoPage } from '../pages/counterparty-info/counterparty-info';
import { CounterpartyCaPage } from '../pages/counterparty-ca/counterparty-ca';
import { InstaService } from '../services/insta-service';

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
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
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
    TabsPage
  ],
  providers: [InstaService]
})
export class AppModule {}
