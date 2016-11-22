import { Component, ViewChild, OnInit } from '@angular/core';
import { App, NavController, AlertController, ToastController, PopoverController, LoadingController, ViewController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { CounterpartyService } from '../../services/counterparty-service';
import { InAppBrowser, ScreenOrientation } from 'ionic-native';
import {Http, Response} from '@angular/http';
//for mocked data
import { InstaService } from '../../services/insta-service';
import { RankedCounterparty } from '../../models/ranked-counterparty';
import { CounterpartyCaPage } from '../counterparty-ca/counterparty-ca';
import { ChartModalPage } from '../chart-modal/chart-modal';
//import { DashboardPage } from '../dashboard/dashboard';
//import { ChartModalPage } from '../chart-modal/chart-modal';
//import { OnlyChartPage } from '../only-chart/only-chart';
import { CounterpartyEntity } from '../../models/counterparty-entity';
import { CpLimitAndExposure, Limit, Exposure } from '../../models/cp-limits-and-exposures';
import { HighchartsChartComponent } from '../../components/highcharts-chart/highcharts-chart';
import { Observable } from 'rxjs/Observable';

declare var $: any;

@Component({
  templateUrl: 'counterparty-info.html',
  providers: [CounterpartyService]
})
export class CounterpartyInfoPage implements OnInit {
    @ViewChild('chartLimitsAndExposures') chartLimitsAndExposures: HighchartsChartComponent

  cpInfo: CounterpartyEntity;
  limitsAndExposures: any;

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
    this.limitsAndExposures = navParams.get('limitsAndExposures');
    console.log(this.cpInfo);
    console.log(this.limitsAndExposures);   
  }
  ngOnInit() {
    this.showLimitsAndExposures();
  }

  // refresh handler
  refreshCounterpartyInfo(refresher)
  {
     Observable
     .forkJoin(
        this.instaService.getCounterpartyDetail(this.cpInfo.id),
        this.instaService.getCounterpartyCurrentLimitsAndExposures(this.cpInfo.name))
     .subscribe(
        data => {           
            this.cpInfo = data[0];
            this.limitsAndExposures = data[1];
            this.showLimitsAndExposures();
            refresher.complete();
      });
  }
 
  showLimitsAndExposures()
  {
    if (this.limitsAndExposures === undefined) return;

    let limitPoints: any[][] = this.limitsAndExposures.map(o=> { 
        return [(new Date(o.exposureDate)).getTime(), o.limit];
    });
    let exposurePoints: any[][] = this.limitsAndExposures.map(o=> { 
        return [(new Date(o.exposureDate)).getTime(), o.currentExposure];
    });

    this.chartLimitsAndExposureData = this.getLimitsExposuresChartData(limitPoints, exposurePoints);
    this.chartLimitsAndExposures.render(this.chartLimitsAndExposureData);
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
                            message: 'Credit Review documents are not available for the counterparty',
                            duration: 3000,
                            position: 'middle'
                          });
            toast.present();
          }
          else {
            //this.showCaActionSheet();  //For this version there is only Action Items.  Let's go directly
            //open the list of documents for the cp
            this.navCtrl.push(CounterpartyCaPage,
                { "counterpartyName": this.cpInfo.name, "documents": this.caFileList });
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

    return {
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false
          },
          title: {
              text: 'Exposures & Limits'
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
                  text: 'USD'
              },
              min: 0
          },
          credits: {
             enabled: false
          },
          tooltip: {
              headerFormat: '<b>{series.name}</b><br>',
              pointFormat: '{point.x:%e-%b-%y}: {point.y:,.0f}'
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
              color: '#006633',
              name: 'Limits',
              data: limits
          }, {
              //step: true,
              color: '#FF6600', 
              name: 'Exposures',
              data: exposures
          }]
      };

  }
  //open Chart in full screen
  zoomInChartLimitsAndExposures() {

    // Get the same chart data on this page and set title
/*
    let chartData = this.chartLimitsAndExposureData;
    chartData.title = { text: this.cpInfo.name };
    chartData.subtitle = { text: 'Limits & Exposures'};

    this.app.getRootNav().push(OnlyChartPage, { "chartData": chartData });

    */
    let chartData = this.chartLimitsAndExposureData;
    //let modal = this.modalCtrl.create(ChartModalPage, { "chartData": chartData, "title": this.cpInfo.name, "subtitle": "Limits  & Exposures" });
    //modal.onDidDismiss(()=>{});
    this.navCtrl.push(ChartModalPage, { "chartData": chartData, "title": this.cpInfo.name, "subtitle": "Limits  & Exposures" });
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