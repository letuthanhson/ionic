import { Component, OnInit } from '@angular/core';
import { NavController, Platform, NavParams, ViewController } from 'ionic-angular';
import { ScreenOrientation } from 'ionic-native';

declare var $: any;

@Component({
  templateUrl: 'chart-modal.html'
})
export class ChartModalPage implements OnInit {
  chartData: any;

  constructor(
      public platform: Platform,
      public params: NavParams,
      public viewCtrl: ViewController) {

      this.chartData = params.get('chartData');   
      this.chartData.title = { text: params.get('title') };
      this.chartData.subtitle = { text: params.get('subtitle') };
  }
  ionViewDidLoad() {
    ScreenOrientation.lockOrientation('landscape');
  
  }
  ionViewWillUnload() {
    ScreenOrientation.unlockOrientation();
  }
  ngOnInit() {
    
    $('#the-chart').highcharts(this.chartData);
    
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}