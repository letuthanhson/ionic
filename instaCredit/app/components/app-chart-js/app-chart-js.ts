import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var Chart: any;

@Component({
  selector: 'app-chart-js',
  template: '<div><canvas #theChart></canvas></div><div #theLegend></div>'
})
export class AppChartJs {
  @ViewChild('theChart') private _canvas:ElementRef;
  @ViewChild('theLegend') private _legend:ElementRef;
  constructor() {}

  render(chartData: any){

    //see chartData: http://www.chartjs.org/docs/#chart-configuration-chart-data

    let ctx: CanvasRenderingContext2D = this._canvas.nativeElement.getContext("2d");
    let c = new Chart(ctx, chartData);
    //this._legend.nativeElement.innerHTML = c.generateLegend();
  }
}

