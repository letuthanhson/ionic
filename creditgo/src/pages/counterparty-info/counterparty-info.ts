import { Component, OnInit } from '@angular/core';
import { App, NavController, AlertController, ToastController, PopoverController, LoadingController, ViewController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { CounterpartyService } from '../../services/counterparty-service';
import { InAppBrowser, ScreenOrientation } from 'ionic-native';
import {Http, Response} from '@angular/http';
//for mocked data
import { InstaService } from '../../services/insta-service';
import { RankedCounterparty } from '../../models/ranked-counterparty';
import { CounterpartyCaPage } from '../counterparty-ca/counterparty-ca';
//import { DashboardPage } from '../dashboard/dashboard';
//import { ChartModalPage } from '../chart-modal/chart-modal';
//import { OnlyChartPage } from '../only-chart/only-chart';
import { CounterpartyEntity } from '../../models/counterparty-entity';
import { CpLimitAndExposure, Limit, Exposure } from '../../models/cp-limits-and-exposures';

//import * as moment from 'moment';

declare var $: any;

@Component({
  templateUrl: 'counterparty-info.html',
  providers: [CounterpartyService]
})
export class CounterpartyInfoPage implements OnInit {
  cpInfo: CounterpartyEntity;
  caFileList: any[];

  chartLimitsAndExposureData: any;

  constructor(private navCtrl: NavController,
              private app: App,
              private instaService: InstaService,
              private popoverCtrl: PopoverController,
              private actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController,
              private counterpartyService: CounterpartyService,
               private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastController: ToastController,
              navParams: NavParams) {

    // If we navigated to this page, we will have an item available as a nav param
    this.cpInfo = navParams.get('counterpartyInfo');   
    this.cpInfo.appraisalCompletionDate = 
          (new Date(this.cpInfo.appraisalCompletionDate));
  }
  ngOnInit() {
    this.showCurrentLimitsAndExposures()
  }
  showCurrentLimitsAndExposures()
  {
    console.log("Getting exposures/limits...");
    
    let loading = this.loadingCtrl.create({
      content: 'please wait'
    });
    loading.present();
    this.instaService.getCounterpartyCurrentLimitsAndExposures(this.cpInfo.name)
      .subscribe(
        data => {
          loading.dismissAll();
          console.log(JSON.stringify(data));
          /* Data sample
          [{
          "exposureDate": "2013-06-20T00:00:00",
          "ultimateParentCPTY": "AEGEAN_GROUP_PE", //obsolete
          "currentExposure": 437896.0,
          "limit": 10000000.0
          }]

          export interface CpLimitAndExposure{
            exposureDate: Date;
            limit: number;
            currentExposure: number;
          }
          */
          // let limitAndExposureList: CpLimitAndExposure[] = data;
          console.log("Start limits and exposures...")
          let limitPoints: any[][] = data.map(o=> { 
              return [(new Date(o.exposureDate)).getTime(), o.limit];
          });
          let exposurePoints: any[][] = data.map(o=> { 
              return [(new Date(o.exposureDate)).getTime(), o.currentExposure];
          });

          this.chartLimitsAndExposureData = this.getLimitsExposuresChartData(limitPoints, exposurePoints);
          this.chartLimitsAndExposures();

        },
        error=>{
          loading.dismissAll();
          console.log(error);
          let alert = this.alertCtrl.create({
                  title: 'Loading Error!',
                  subTitle: 'Failed to load exposure/limit data',
                  buttons: ['OK']
                });
          alert.present();
        });
  }
  showCaFiles()
  {
    console.log("Getting CA files...");
    this.caFileList = undefined;
    let loading = this.loadingCtrl.create({
      content: 'please wait'
    });
    loading.present();
    this.instaService.getCounterpartyCaFiles(this.cpInfo.id)
      .subscribe(
        data => {
          loading.dismissAll();
          this.caFileList = data;
          if (this.caFileList === undefined || this.caFileList.length === 0) {
            let toast = this.toastController.create({
                            message: 'Credit Review document is not available for the counterparty',
                            duration: 3000,
                            position: 'middle'
                          });
            toast.present();
          }
          else {
            this.showCaActionSheet();
          }
      },
      error=>{
        loading.dismissAll();
        console.log(error);
        let alert = this.alertCtrl.create({
                title: 'Loading Error!',
                subTitle: 'Failed to load data',
                buttons: ['OK']
              });
        alert.present();
      });
  }
  showCaActionSheet() {
    if (this.caFileList === undefined && this.caFileList.length == 0)
      return;

    let actionSheet = this.actionSheetCtrl.create({
      title: this.cpInfo.name,
      buttons: [{
        text: 'Credit Reviews',
        handler: ()=>{
          let navTransition = actionSheet.dismiss();

          navTransition.then(()=>{
            //open the list of documents for the cp
            this.navCtrl.push(CounterpartyCaPage,
                { "counterpartyName": this.cpInfo.name, "documents": this.caFileList });
          });

          return false;
        }
      },{
        text: 'Cancel',
        role: 'cancel',
        handler: ()=>{
          ;
        }
      }]
    })

    actionSheet.present();
  }
	getLimitsExposuresChartData(limits: any[][], exposures: any[][]): any {
    console.log("Limits: "+JSON.stringify(limits));
    console.log("Exposures: "+JSON.stringify(exposures));

    return {
          title: {
              text: ''
          },
          subtitle: {
              text: ''
          },
          xAxis: {
              type: 'datetime',
              dateTimeLabelFormats: {
                day: '%e %b <br/> %Y',
                month: '%e %b <br/> %Y',
                year: '%e %b <br/> %Y'
              },
              title: {
                  text: 'Date'
              }
          },
          yAxis: {
              title: {
                  text: 'Millions (USD)'
              },
              min: 0
          },
          tooltip: {
              headerFormat: '<b>{series.name}</b><br>',
              pointFormat: '{point.x:%e-%b-%y}: {point.y:.2f} m'
          },

          plotOptions: {
              spline: {
                  marker: {
                      enabled: true
                  }
              }
          },

          series: [{
              //step: true,
              name: 'Limits',
              data: limits
          }, {
              //step: true,
              name: 'Exposures',
              data: exposures
          }]
      };

  }
  chartLimitsAndExposures() {
    $('#chart-limit-exposure').highcharts(this.chartLimitsAndExposureData);
  }
  //open Chart in full screen
  expandChartModalLimitsAndExposures() {

    // Get the same chart data on this page and set title

    /*
    let chartData = this.chartLimitsAndExposureData;
    chartData.title = { text: this.cpInfo.name };
    chartData.subtitle = { text: 'Limits & Exposures'};

    this.app.getRootNav().push(OnlyChartPage, { "chartData": chartData });

    */
    //let modal = this.modalCtrl.create(ChartModalPage, { "chartData": chartData });
    //modal.onDidDismiss(()=>{
    //});

    //modal.present();
    
  }
}

@Component({
  template: `
    <ion-list>
      <ion-list-header>InstaCredit</ion-list-header>
      <button ion-item (click)="openCaDocuments()">Credit Reviews</button>
      <button ion-item (click)="openAlerts()">Credit Alerts</button>
    </ion-list>
  `
})
class PopoverMenu {
  counterpartyName: string;
  documents: any[];

  constructor(private viewCtrl: ViewController, private navCtrl: NavController, navParams: NavParams) {
      this.counterpartyName = navParams.get('counterpartyName');   
      this.documents = navParams.get('documents');
  }
  openCaDocuments() {

    this.navCtrl.push(CounterpartyCaPage,
         { "counterpartyName": this.counterpartyName, "documents": this.documents }).then(()=>{
      this.viewCtrl.dismiss();});
  }
  openAlerts() {
/*
    this.navCtrl.push(DashboardPage).then(()=>{
      this.viewCtrl.dismiss();});
      */
  }

}