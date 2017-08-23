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
import * as _ from 'lodash';  
declare var $: any;

@Component({
  templateUrl: 'counterparty-info.html',
  providers: [CounterpartyService]
})
export class CounterpartyInfoPage implements OnInit {
  @ViewChild('chartLimitsAndExposures') chartLimitsAndExposures: HighchartsChartComponent
  cpInfo: CounterpartyEntity;
  limitsAndExposures: any;
  forwardExposures: any;
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
    var cpId = this.cpInfo.id;

     Observable
     .forkJoin(
        this.instaService.getCounterpartyDetail(this.cpInfo.id),
        this.instaService.getCounterpartyCurrentLimitsAndExposures(this.cpInfo.name),
        this.instaService.getCounterpartyForwardLimitsAndExposures(this.cpInfo.id))
     .subscribe(
        data => {   

            this.cpInfo = data[0];
            this.limitsAndExposures.current = data[1];
            var currentDate = new Date();
            // filter on mocking data will be removed
            this.limitsAndExposures.forward = _.filter(data[2], function(item){
              return item.id === cpId;
            });           
         
            this.showLimitsAndExposures();
            refresher.complete();
      });
  }
 
   showLimitsAndExposures()
  {
    if (this.limitsAndExposures === undefined) return;

    let limitPoints: any[] = new Array<any>();
    let exposurePoints: any[] =new Array<any>();
    let exposureDate: any[] = new Array<any>();

    this.limitsAndExposures.current.map(o=> { 
        limitPoints.push(o.limit);
        //exposurePoints.push({y:o.currentExposure, segmentColor: '#FF6600'});
        exposurePoints.push(o.currentExposure);
        exposureDate.push(new Date(o.exposureDate).toLocaleDateString());     
    });
    
    // for mock
    if(this.limitsAndExposures.forward.length > 0){

      var currentDate = new Date();
      this.limitsAndExposures.forward[0].exposures.map(o=>{
        if(new Date(o.exposureDate) > currentDate){
          limitPoints.push(o.limit);
          exposureDate.push(new Date(o.exposureDate).toLocaleDateString()); 
          exposurePoints.push(o.exposure);
        }
      });

    }
    
    // only add zone/plot line when there is a forward exposure
    let zoneValue = this.limitsAndExposures.forward.length > 0 ? this.limitsAndExposures.current.length : 0;

    this.chartLimitsAndExposureData = this.getLimitsExposuresChartData(exposurePoints, limitPoints, exposureDate, zoneValue );
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
	getLimitsExposuresChartData(exposurePoints:any, limits:any, exposureDate:any, zoneValue: any): any {

    let options =
     {
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              renderTo: 'container',
          },
          title: {
              text: 'Exposures & Limits'
          },
         xAxis: {
          categories: exposureDate,          
          crosshair: true         
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
             // headerFormat: '<b>{series.name}</b><br>',
              //pointFormat: '{point.x:%e-%b-%y}: {point.y:,.0f}'
          },
          plotOptions: {
              spline: {
                  marker: {
                      enabled: true
                  }
              }, series:{
                turboThreshold:5000//set it to a larger threshold, it is by default to 1000
            }
          }
      };

      if(zoneValue > 0)
      {
        options.xAxis['plotLines'] =[{
            color: '#009900', // Color value
            dashStyle: 'solid', // Style of the plot line. Default to solid
            value: zoneValue+1, // Value of where the line will appear
            width: 2 ,
            label:{          
              text: 'Time series cut off', // Content of the label. 
              align: 'left', // Positioning of the label. 
            } 
        }]
        options['series'] = [{
              //step: true,
              color: '#006633',
              name: 'Limits',
              data: limits               
          }, 
          {
              //step: true,
              color: '#FF6600',
              type: 'area',
              name: 'Exposures',
              dashStyle:"dash",
              data: exposurePoints,
              zoneAxis: 'x',
              zones: [{
                value: zoneValue,
                  dashStyle:"Solid",         
              }]
          }];
      }
      else {
        options['series'] = [{
            //step: true,
            color: '#006633',
            name: 'Limits',
            data: limits               
        }, 
        {
            //step: true,
            color: '#FF6600',
            type: 'area',
            name: 'Exposures',
            dashStyle:"solid",
            data: exposurePoints
        }];
      }

      return options; 
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

   renderAllCharts()
  {
    this.chartLimitsAndExposures.render(this.chartLimitsAndExposureData);
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