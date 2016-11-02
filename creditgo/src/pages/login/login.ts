import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NativeStorage } from 'ionic-native';
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
    
    this.userForm = this.formBuilder.group({
      "userid": [this.logonUser.userid, Validators.required],
      "password": [this.logonUser.password, Validators.required],
      "rememberMe": [this.logonUser.rememberMe]
    });

    /*
       // get base url
        http.get(InstaService.APP_CONFIG)
          .map(res => res.json())
          .subscribe(
            data => {
                console.log("Done getting appconfig...")
                this._url = data.serviceBaseUrl;
                console.log("baseUrl: " + this._url);
            },
            error=>{
                console.log("Can't load '" + InstaService.APP_CONFIG + JSON.stringify(error));
            });
            */
  }
  login() {
    // login
    this.logonUser = this.userForm.value;
    console.log("Show userid................" + this.logonUser.userid);
    // save user
    NativeStorage.setItem(LoginPage.SS_USER_KEY, this.logonUser)
    .then(
      () => {
        console.log("User remembered");
      },
      error => {
        console.log("Error caching user: " + JSON.stringify(error));
      }
    );
    let loading = this.loadingCtrl.create({
      content: 'please wait'
    });
    loading.present();
    this.instaService.setServiceCredential(
          "https://devtest-istesb.bpglobal.com:25202/InstaCredit_External/proxy?wsdl",
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
