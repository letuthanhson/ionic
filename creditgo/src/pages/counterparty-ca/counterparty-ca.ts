import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, LoadingController, ViewController, AlertController, ToastController, NavParams } from 'ionic-angular';
import { InstaService } from '../../services/insta-service';
import { InAppBrowser, File } from 'ionic-native';

declare var cordova: any;
declare var DocumentHandler: any;

@Component({
  templateUrl: 'counterparty-ca.html'
})
export class CounterpartyCaPage implements OnInit {
  counterpartyName: string;
  documents: any[];

  constructor(private navCtrl: NavController,
              private instaService: InstaService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastController: ToastController,
              navParams: NavParams) {

    // If we navigated to this page, we will have an item available as a nav param
    this.counterpartyName = navParams.get('counterpartyName');  
    this.documents = navParams.get('documents'); 
    //console.log(this.counterpartyName);
    //console.log(this.documents);

  }
  ngOnInit() {
      
  }
  openDoc(item: any){
    let loading = this.loadingCtrl.create({
      content: 'please wait'
    });
    loading.present();
    this.instaService.getCounterpartyCaFileBase64(item.url)
      .subscribe(
        data => {
          loading.dismissAll();

          if (data === undefined && data.fileasbase64 == undefined) {
            let toast = this.toastController.create({
                            message: 'Unable to get file content',
                            duration: 3000,
                            position: 'middle'
                          });
            toast.present();
          }
          else {
             
             this.openDocument(item.name, data.mimeType, data.fileAsBase64);
             //open(cordova.file.applicationDirectory + item.url, '_blank', 'location=no,enableViewPortScale=yes');
          }
      },
      error=>{
        loading.dismissAll();
        console.log(error);
        let alert = this.alertCtrl.create({
                title: 'Loading Error!',
                subTitle: 'Failed to load the document',
                buttons: ['OK']
              });
        alert.present();
      });
   
  }
  openDocument(fileName: string, contentType: string, contentAsBase63: string) {
    console.log("open file......");
    DocumentHandler.saveAndPreviewBase64File(
        function (success) {},
        function (error) {
          if (error == 53) {
            let alert = this.alertCtrl.create({
                title: 'File Openning Error!',
                subTitle: 'No application handles this file type',
                buttons: ['OK']
              });
            alert.present();
          }
          else {
            let alert = this.alertController.create({
                    title: 'File Openning Error!',
                    subTitle: 'Unable to open file: ' + JSON.stringify(error),
                    buttons: ['OK']
                  });
            alert.present();
          }
        }, 
        contentAsBase63,
        contentType, // 'application/pdf', 
        cordova.file.dataDirectory, 
        fileName
    );
  }
}