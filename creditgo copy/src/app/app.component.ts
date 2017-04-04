import { HomePage } from '../../.tmp/pages/home/home';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Events} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  template: `<ion-nav #myNav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  @ViewChild('myNav') nav: NavController;

  rootPage = TabsPage;
  //idleState = 'Not started.';
  //timedOut = false;
  //lastPing?: Date = null;
  constructor(platform: Platform, private idle: Idle, private keepalive: Keepalive, private events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    
    this.events.subscribe('user:signedIn', (data) => {
        this.reset();
    });
    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(10);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(1200);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    // this.idle.onIdleStart.subscribe(() => {this.idleState = 'You\'ve gone idle!';console.log(this.idleState);});
    // this.idle.onTimeoutWarning.subscribe((countdown) => {
    //   this.idleState = 'You will time out in ' + countdown + ' seconds!';
    //   console.log(this.idleState);
    // });

    this.idle.onTimeout.subscribe(() => {
      //this.idleState = 'Timed out!';
      //this.timedOut = true;
      this.nav.popToRoot().then(c=>{ 
        this.nav.setRoot(TabsPage);
      });
    });  

   
    //this.reset();
  }

  reset() {
      this.idle.watch();
    //this.idleState = 'Started.';
    //this.timedOut = false;
   
    
  }
}
