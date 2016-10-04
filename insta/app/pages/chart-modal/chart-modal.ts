import {Component, OnInit} from '@angular/core';
import {NavController, Platform, NavParams, ViewController, Page} from 'ionic-angular';
import {Http, Response} from '@angular/http';
import { ScreenOrientation } from 'ionic-native';

declare var $: any;

@Component({
  templateUrl: 'build/pages/chart-modal/chart-modal.html'
})
export class ChartModalPage implements OnInit {
  chartData: any;

  constructor(
      public platform: Platform,
      public params: NavParams,
      public viewCtrl: ViewController) {

      this.chartData = params.get('chartData');   
  }

  ngOnInit() {
    
    $('#the-chart').highcharts(this.chartData);
  }

  dismiss() {
    

    this.viewCtrl.dismiss();
    
    //this.viewCtrl.dismiss();

    
  }
}