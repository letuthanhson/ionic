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
  }
  ionViewWillUnload() {
     // remove zoom type on unload 
    this.highChartsData.chart.zoomType = '' ;
    //ScreenOrientation.unlockOrientation();
  }
  ionViewDidEnter() {

    //ScreenOrientation.lockOrientation('landscape');
    if (this.highChartsData != undefined){
      // add zoom type on max
      this.highChartsData.chart.zoomType = 'xy' ;  

      $('#the-chart').highcharts(this.highChartsData); 
      //if(window.orientation === 90|| window.orientation === -90)
      $('#the-chart').highcharts().setSize(null,window.innerHeight-60,false);
      
      //console.log("height:" + window.innerHeight+ "width: "+window.innerWidth);

       
      //$('#the-chart').css("height", window.innerHeight > window.innerWidth? window.innerWidth-40: window.innerHeight-40);
      //$('#the-chart').css("width",window.innerHeight < window.innerWidth? window.innerWidth: window.innerHeight);      
    }

    if (this.bubbleRootData != undefined)
      this.bubbleChart.render(this.bubbleRootData); 

    // add orientation change event handler
    window.addEventListener("orientationchange", this.orientationChange, false);    
  }

  orientationChange = (event: any): void => {
    $('#the-chart').highcharts().setSize(null,window.innerHeight-60,false);
  }

  ionViewDidLeave()
  {
    // right now just call render chart blindly
    // will look into detect when orientation changed
    var prevPage = this.navCtrl.getPrevious().instance;
    if(prevPage.renderAllCharts !== undefined)    prevPage.renderAllCharts();

     // add orientation change event handler
    window.removeEventListener("orientationchange", this.orientationChange, false);    
  }

  dismiss() {
    this.navCtrl.pop();
  }
}