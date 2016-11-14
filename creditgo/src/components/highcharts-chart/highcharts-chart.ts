import { Component, ViewChild, ElementRef } from '@angular/core';

declare var $: any;

@Component({
  selector: 'highcharts-chart',
  template:
    `<div class="highcharts-container" style="width: 100%;">
        <div #theChart style="width: 100%;"></div>
    </div>
    `
})
export class HighchartsChartComponent
{
    @ViewChild('theChart') theChart: ElementRef
    constructor(){
    }
    // draw a bubble chart
    render(chartData: any) {    
      $(this.theChart.nativeElement).highcharts(chartData);
    }

    createGuid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();  
    }
    s4() {  
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);  
    }
} 
