import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';

import { CounterpartySearchPage } from '../pages/counterparty-search/counterparty-search';
import { CounterpartyInfoPage } from '../pages/counterparty-info/counterparty-info';
import { CounterpartyCaPage } from '../pages/counterparty-ca/counterparty-ca';

import { TabsPage } from '../pages/tabs/tabs';
@NgModule({
  declarations: [
    MyApp,
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
    AboutPage,
    ContactPage,
    HomePage,
    CounterpartySearchPage,
    CounterpartyInfoPage,
    CounterpartyCaPage,
    TabsPage
  ],
  providers: []
})
export class AppModule {}
