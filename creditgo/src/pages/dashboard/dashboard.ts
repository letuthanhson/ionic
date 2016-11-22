import { Component, ViewChild, OnInit, ElementRef, Directive } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { ChartModalPage } from '../chart-modal/chart-modal';
import { BubbleChartComponent } from '../../components/bubble-chart/bubble-chart';
import { HighchartsChartComponent } from '../../components/highcharts-chart/highcharts-chart';
import { InstaService } from '../../services/insta-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/forkJoin';

declare var $;
declare var Highcharts;

@Component({
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
    @ViewChild('chartRatingBandExposures') chartRatingBandExposures: BubbleChartComponent
    @ViewChild('chartHistoricalExposures') chartHistoricalExposures: HighchartsChartComponent
    @ViewChild('chartTeamExposures') chartTeamExposures: HighchartsChartComponent

    isDataLoaded: any = false;
    static RATING_BAND = 'Rating Band';
    static TEAM = 'Team';

    historialExposuresAndExpectedLosses: any[];
    ratingBandExposuresAndExpectedLosses: any[];
    teamExposuresAndExpectedLosses: any[];

    constructor(private platform: Platform,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private instaService: InstaService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController){
    
        platform.ready().then(() => {
             window.addEventListener("orientationchange", function(e) { 
                if (platform.isPortrait()) {
                    $('#chartExpandTeam').removeAttr("center"); $('#chartExpandTeam').attr("right",""); 
                }
                else{
                    $('#chartExpandTeam').removeAttr("right"); $('#chartExpandTeam').attr("center","");
                }
            }, false);
        });       
    }

    zoomInChartRatingBand(){
        let root:any = {};
                root.name = "Interactions";
                root.children = new Array(); 

        this.ratingBandExposuresAndExpectedLosses.map(o=>{
                    root.children.push({name: o.ratingBand,  value: o.exposure});
                });

        let modal = this.modalCtrl.create(ChartModalPage, { "bubbleRootData": root, "bubbleChartTitle": "Exposures By Rating Band" });
        modal.present();
    }
    zoomInChartTeam(){
        let chartData = this.chartDataExposuresAndExpectedLosses(DashboardPage.TEAM,
                            this.teamExposuresAndExpectedLosses);
        let modal = this.modalCtrl.create(ChartModalPage, { "chartData": chartData });
        modal.present();
    }
    zoomInChartHistorical(){
        let chartData = this.chartDataHistoricalExposuresAndExpectedLosses(this.historialExposuresAndExpectedLosses);
        let modal = this.modalCtrl.create(ChartModalPage, { "chartData": chartData });
        modal.present();
    }
    ngOnInit() {
        
        let loading = this.loadingCtrl.create({
                            content: 'please wait'
                        });
        loading.present();
        this.getAllDashboardData(()=>loading.dismissAll());
        //this.showHistoricalExposuresAndExpectedLosses();
        //this.showRatingBandExposuresAndExpectedLosses();
        //this.showTeamExposuresAndExpectedLosses();
    }
    // refresh hanlder
    refreshDashboard(refresher)
    {
        this.getAllDashboardData(()=>refresher.complete());
    }

    // get all dashboard data
    // call back for UI to release any object
    getAllDashboardData(callback:()=> any)
    {        
         Observable.forkJoin(
            this.instaService.getHistoricalExposuresAndExpectedLosses(),
            this.instaService.getExposuresAndLimitsGroupByRatingBand(),
            this.instaService.getExposuresAndLimitsGroupByTeam()
        )
        .subscribe(
            data => {
                this.historialExposuresAndExpectedLosses = data[0];
                this.ratingBandExposuresAndExpectedLosses = data[1];
                this.teamExposuresAndExpectedLosses = data[2];
               
                if(callback) callback();

                // loading rating band data
                let root:any = {};
                root.name = "Interactions";
                root.children = new Array(); 

                this.ratingBandExposuresAndExpectedLosses.map(o=>
                {
                    root.children.push({name: o.ratingBand,  value: o.exposure});
                })    
                this.chartRatingBandExposures.render(root);

                // loading historical data
                this.chartHistoricalExposures.render(this.chartDataHistoricalExposuresAndExpectedLosses(this.historialExposuresAndExpectedLosses));
               
                this.chartTeamExposures.render(this.chartDataExposuresAndExpectedLosses(DashboardPage.TEAM,
                        this.teamExposuresAndExpectedLosses));
                // set the flag to show hide dom        
                this.isDataLoaded = true;
            },
            error=>{
                if(callback) callback();
                let alert = this.alertCtrl.create({
                        title: 'Loading Error!',
                        subTitle: 'Failed to load dashboard data',
                        buttons: ['OK']
                        });
                alert.present();
            });
    }

    randomCssRgba () {
    let rgbaArray = [this.randomNumber(0, 255), this.randomNumber(0, 255), this.randomNumber(0, 255), this.randomNumber(50, 100) * 0.01];
        return 'rgba(' + rgbaArray.join(',') + ')';
    }
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }    

    chartDataExposuresAndExpectedLosses(category: string, exposuresAndLosses: any[]): any {
        let categories: string[] =[];

        if (category == DashboardPage.RATING_BAND) {
            categories = exposuresAndLosses.map(o =>  {
                return o.ratingBand;
            });
        }
        else if (category == DashboardPage.TEAM) {
            categories = exposuresAndLosses.map(o =>  {
                return o.teamName;
            });
        }
        else return {}; // no chart data

        let exposures: number[] = exposuresAndLosses.map(o =>  {
            return Math.round(o.exposure);
        });
        let expectedLosses: number[] = exposuresAndLosses.map(o =>  {
            return Math.round(o.expectedLoss);
        });
        return {
                chart: {
                    type: 'bar',
                    spacingBottom: 50, // to allow legend at bottom
                    spacingRight:50                   
                },
                title: {
                    text: 'Exposures & Expected Losses By ' + category
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: categories,
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'USD',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ''
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    color: '#FF6600',
                    name: 'Exposures',
                    data: exposures
                }, {
                    color: '#000000',
                    name: 'Expected Losses',
                    data: expectedLosses
                }]
            };
        }
        // gets historical chartdata for historical and expected losses
        chartDataHistoricalExposuresAndExpectedLosses(exposuresAndLosses: any[]): any {
            let exposurePoints: any[][] = exposuresAndLosses.map(o=> { 
                return [(new Date(o.exposureDate)).getTime(), o.exposure];
            });
            return { 
                chart:{
                     spacingRight:50   
                },              
                title: {
                    text: 'Historical Exposures'
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
                    color: '#FF6600', 
                    name: 'Exposures',
                    data: exposurePoints
                }]
            };

        }
}
