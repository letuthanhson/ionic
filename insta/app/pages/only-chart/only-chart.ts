import {Component, OnInit, AfterViewInit } from '@angular/core';
import {NavController, Platform, NavParams, ViewController, Page, App} from 'ionic-angular';
import {Http, Response} from '@angular/http';
import { ScreenOrientation } from 'ionic-native';

declare var $: any;

@Component({
  templateUrl: 'build/pages/only-chart/only-chart.html'
})
export class OnlyChartPage implements AfterViewInit {
  chartData: any;

  constructor(
      public platform: Platform,
      private navCtrl: NavController,
      private app:App,
      public params: NavParams,
      public viewCtrl: ViewController) {

      this.chartData = params.get('chartData');   
      //ScreenOrientation.lockOrientation('landscape');
      //ScreenOrientation.unlockOrientation(); 
  }

  ngAfterViewInit() {

    $('#the-chart').highcharts(this.chartData);
    

  }

  dismiss() {
    //ScreenOrientation.lockOrientation('portrait');
      //ScreenOrientation.unlockOrientation(); 
    this.navCtrl.pop().then();

    
    
  }
}