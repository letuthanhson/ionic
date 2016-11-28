import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NativeStorage, SecureStorage } from 'ionic-native';
import { ModalController, Platform, NavController, ViewController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { LogonUser } from '../../models/logon-user';
import { InstaService } from '../../services/insta-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  logonUser: LogonUser = new LogonUser();
  static readonly SS = "app_storage";
  static readonly SS_USER_KEY = "logonUser";
  userForm: FormGroup;
  baseServiceUrl: string;
  constructor(
          private platform: Platform,
          private nav: NavController,
          private viewCtrl: ViewController,
          private formBuilder: FormBuilder,
          private instaService: InstaService,
          private alertCtrl: AlertController,
          private loadingCtrl: LoadingController,
          navParams: NavParams) {

    this.logonUser = navParams.get('logonUser');  
    this.baseServiceUrl = navParams.get('baseServiceUrl');  

    this.userForm = this.formBuilder.group({
      "userid": [this.logonUser.userid, Validators.required],
      "password": [this.logonUser.password, Validators.required],
      "rememberMe": [this.logonUser.rememberMe]
    });
  }
  rememberMe(rememberUser: LogonUser) {
    let secureStorage: SecureStorage = new SecureStorage();
    secureStorage.create('account_safe')
    .then(
      () => {
        console.log('Secure Storage is ready!');
        secureStorage.set('loginInfo', JSON.stringify(rememberUser))
          .then(
            data  => {
              console.log("Remembering user successfully");
            },
            error => {
              console.log("Failed to remember user");
            });
        }).catch(e => console.log(e))
  }
  login() {
    // login
    this.logonUser = this.userForm.value;
    console.log("User: " + this.logonUser.userid);

    // remember me
    this.rememberMe(this.logonUser);
    // save user
    /*
    NativeStorage.setItem(LoginPage.SS_USER_KEY, this.logonUser)
    .then(
      () => {
        console.log("User remembered");
      },
      error => {
        console.log("Error caching user: " + JSON.stringify(error));
      }
    );
    */
    let loading = this.loadingCtrl.create({
      content: 'please wait'
    });
    loading.present();
    this.instaService.setServiceCredential(
          this.baseServiceUrl,
          //"/api/InstaCredit_External/proxy?wsdl",
          this.logonUser.userid,
          this.logonUser.password);

    this.instaService.authenticate()
      .subscribe(
        ()=> {
          // authenticate successfully
          console.log("Authenticating successfully...")
          this.viewCtrl.dismiss();
          loading.dismissAll();
        },
        error => {
          loading.dismissAll();
          let alert = this.alertCtrl.create({
                  title: 'Login Error!',
                  subTitle: 'Login failed!',
                  buttons: ['OK']
                });
          alert.present();
        });
        
  }
}
