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
import { CpLimitsAndExposures, Limit, Exposure } from '../../models/cp-limits-and-exposures';
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
  }
  ngOnInit() {
/*
      this.http.get('mock/limit-exposure.json')
            .map(res => res.json())
            .subscribe(data => {

              let cpLimitsAndExposures: any = data;

              let limitPoints: any[][] = cpLimitsAndExposures.limits.map(o=> { 
                  return [(new Date(o.start)).getTime(), o.limit];
              });
              let exposurePoints: any[][] = cpLimitsAndExposures.exposures.map(o=> { 
                  return [(new Date(o.start)).getTime(), o.exposure];
              });

              //extend limits to match end of exposures
              if (exposurePoints.length > 0 && limitPoints.length > 0)
                limitPoints.push([(new Date(exposurePoints[exposurePoints.length-1][0])).getTime(), limitPoints[limitPoints.length-1][1]]);

              this.chartLimitsAndExposureData = this.getLimitsExposureChartData(limitPoints, exposurePoints);
              this.chartLimitsAndExposures();

            });
            */
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
          if (this.caFileList === undefined && this.caFileList.length === 0) {
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

          //mock data
          //let documents = [{"docName": "appraisal_sample1.docx", "docUrl": "www/mock/appraisal_sample1.docx"},
          //                {"docName": "appraisal_sample2.pdf", "docUrl": "www/mock/appraisal_sample2.pdf"},
          //                {"docName": "appraisal_sample3.xlsx", "docUrl": "www/mock/appraisal_sample3.xlsx"}];

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
	getLimitsExposureChartData(limits: any[][], exposures: any[][]):any {
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
              step: true,
              name: 'Limits',
              data: limits
          }, {
              step: true,
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