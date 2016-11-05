import { Component } from '@angular/core';

import { NavController, ModalController , Platform, AlertController, LoadingController} from 'ionic-angular';
import { NativeStorage, SecureStorage } from 'ionic-native';
import { LoginPage } from '../login/login';
import { LogonUser } from '../../models/logon-user';
import { InstaService } from '../../services/insta-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public platform: Platform, 
      public navCtrl: NavController, 
      public modalCtrl: ModalController,
      private instaService: InstaService,
      private alertCtrl: AlertController,
      private loadingCtrl: LoadingController,
      ) {
        platform.ready().then(() => {

          // Get baseServiceUrl
          let loading = this.loadingCtrl.create({
            content: ''
          });
          loading.present();
          this.instaService.getAppConfig()
            .subscribe(
              data => {
                loading.dismissAll();
                let url = data.serviceBaseUrl;

                console.log('Service end-point: ' + url);
                if (url === undefined) {
                  let alert = this.alertCtrl.create({
                          title: 'Fatal Error!',
                          subTitle: 'Unable to get configuration for service end-point.  Please contact admin.',
                          buttons: ['OK']
                        });
                  alert.present();
                }
                else this.startLogin(url);
              },
              error=>{
                loading.dismissAll();
                console.log(error);
                let alert = this.alertCtrl.create({
                        title: 'Fatal Error!',
                        subTitle: 'Unable to get service end-point.  Please contact admin.',
                        buttons: ['OK']
                      });
                alert.present();
            });

/*
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
*/
        }).catch(e => { console.log(e);});
  }
  showLoginPage(savedUser: LogonUser, baseServiceUrl: string) {
    let profileModal = this.modalCtrl.create(LoginPage, {"logonUser": savedUser, "baseServiceUrl": baseServiceUrl});
    profileModal.present();
  }
  startLogin(baseServiceUrl: string) {
    let secureStorage: SecureStorage = new SecureStorage();
    secureStorage.create('account_safe')
    .then(
      () => {
        console.log('Secure Storage is ready!');
        secureStorage.get('loginInfo')
          .then(
            data  => {
              let savedUser: LogonUser = JSON.parse(data);
              if (savedUser != undefined && savedUser.rememberMe)
                this.showLoginPage(savedUser, baseServiceUrl);
              else
                this.showLoginPage(new LogonUser(), baseServiceUrl);
            },
            error => {
            // nothing saved previously
            this.showLoginPage(new LogonUser(), baseServiceUrl);
            });
        }).catch(e => console.log(e))
  }
}
