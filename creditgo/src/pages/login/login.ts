import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NativeStorage, SecureStorage, TouchID } from 'ionic-native';
import {
    AlertController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    ViewController
} from 'ionic-angular';
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
  touchIdAvailable: boolean; 
  touchIdPwd:string= ""; 
  constructor(
          private platform: Platform,
          private nav: NavController,
          private viewCtrl: ViewController,
          private formBuilder: FormBuilder,
          private instaService: InstaService,
          private alertCtrl: AlertController,
          private loadingCtrl: LoadingController,
          private navParams: NavParams,
          private events: Events) {
    this.logonUser = this.navParams.get('logonUser');  
    this.baseServiceUrl = this.navParams.get('baseServiceUrl');  
    
    this.touchIdPwd = this.logonUser.password;

    this.userForm = this.formBuilder.group({
      "userid": [this.logonUser.userid, Validators.required],
      "password": [this.logonUser.password, Validators.required],
      "rememberMe": [this.logonUser.rememberMe]
    });

    this.platform.ready().then(() => {
          TouchID.isAvailable().then(
            res => 
            {
              this.touchIdAvailable = true;
              this.userForm.controls['password'].setValue("");              
              // show touch id when remember is set up and touchid available
              if(this.logonUser.rememberMe){
                this.startTouchID();
              }
            },
            err => this.touchIdAvailable = false
          );
    });    
  }

  startTouchID(){
    TouchID.verifyFingerprint('Login with Touch ID')
            .then(
              res =>  this.loginWithTouchID(),
              err => console.error('Error', err)
    );
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

  loginWithTouchID()
  {    
    this.userForm.value.password = this.touchIdPwd;
    this.login();
  }

  login() {
    // login
    this.logonUser = this.userForm.value;
    
    // remember me
    this.rememberMe(this.logonUser);
   
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
          this.events.publish('user:signedIn','login');
        },
        error => {
          loading.dismissAll();
          let alert = this.alertCtrl.create(
                      {
                        title: 'Login Error!',
                        subTitle: 'Login failed!',
                        buttons: ['OK']
                      });
          alert.present();
        });
        
  }
}
