import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform, NavParams, ViewController } from 'ionic-angular';
import { ScreenOrientation } from 'ionic-native';
import { BubbleChartComponent } from '../../components/bubble-chart/bubble-chart';

declare var $: any;

@Component({
  templateUrl: 'chart-modal.html'
})
export class ChartModalPage {
  @ViewChild('bubbleChart') bubbleChart: BubbleChartComponent

  highChartsData: any;
  bubbleRootData: any;
  bubbleChartTitle: string;

  constructor(
      public platform: Platform,
      public params: NavParams,
      public navCtrl: NavController) {

      // bubble chart
      if (params.get('bubbleRootData') != undefined)
        this.bubbleRootData = params.get('bubbleRootData');       
      if (params.get('bubbleChartTitle') != undefined)
        this.bubbleChartTitle = params.get('bubbleChartTitle');

      // highcharts
      if (params.get('chartData') != undefined)
        this.highChartsData = params.get('chartData');   
      if (params.get('title') != undefined)
        this.highChartsData.title = { text: params.get('title') };
      if (params.get('subtitle') != undefined)
        this.highChartsData.subtitle = { text: params.get('subtitle') };
  }
  ionViewDidLoad() {
    ScreenOrientation.lockOrientation('landscape');
  
  }
  ionViewWillUnload() {
     // remove zoom type on unload 
    this.highChartsData.chart.zoomType = '' ;
    ScreenOrientation.unlockOrientation();
  }
  ionViewDidEnter() {

    if (this.highChartsData != undefined){
      // add zoom type on max
      this.highChartsData.chart.zoomType = 'xy' ;   
      $('#the-chart').css("height",document.documentElement.clientHeight);
      $('#the-chart').highcharts(this.highChartsData);
    }
    
    if (this.bubbleRootData != undefined)
      this.bubbleChart.render(this.bubbleRootData);
    
  }
  dismiss() {
    this.navCtrl.pop();
  }
}