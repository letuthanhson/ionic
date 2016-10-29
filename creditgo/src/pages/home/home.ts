import { Component } from '@angular/core';

import { NavController, ModalController , Platform } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';
import { LoginPage } from '../login/login';
import { LogonUser } from '../../models/logon-user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public platform: Platform, public navCtrl: NavController, public modalCtrl: ModalController) {
        platform.ready().then(() => {
          NativeStorage.getItem(LoginPage.SS_USER_KEY)
            .then(data  => {
                let savedUser: LogonUser = data;
                if (savedUser != undefined && savedUser.rememberMe)
                  this.showLoginPage(savedUser);
                else
                  this.showLoginPage(new LogonUser());
            },
            error => {
              // do nothing - no data
              this.showLoginPage(new LogonUser());
            });
        });
    
  }
  showLoginPage(savedUser: LogonUser){
    let profileModal = this.modalCtrl.create(LoginPage, {"logonUser": savedUser});
    profileModal.present();
  }
}
