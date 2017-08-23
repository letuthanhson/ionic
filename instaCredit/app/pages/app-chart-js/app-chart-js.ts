import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var Chart: any;

@Component({
  selector: 'app-chart-js',
  template: '<div style="width:100%;height:100%"><canvas #stackedBar></canvas></div>'
})
export class AppChartJs {
  @ViewChild('stackedBar') private _canvas:ElementRef;
  constructor() {}
  render(){
      console.log('i am here 2');

    let ctx: CanvasRenderingContext2D = this._canvas.nativeElement.getContext("2d");
    console.log(ctx);
    let c = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['yolo', 'dolo', 'solo'],
        datasets: [{
          data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
      }
    });
    console.log(c);
    

  }
}