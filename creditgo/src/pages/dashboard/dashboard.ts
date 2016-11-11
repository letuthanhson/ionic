import { Component, ViewChild, OnInit, ElementRef, Directive } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { ChartModalPage } from '../chart-modal/chart-modal';
import { BubbleChartComponent } from '../../components/bubble-chart/bubble-chart';
import { InstaService } from '../../services/insta-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

declare var $;
declare var Highcharts;

@Component({
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
    @ViewChild('chartRatingBandExposures') chartRatingBandExposures: BubbleChartComponent

    static RATING_BAND = 'Rating Band';
    static TEAM = 'Team';

    historialExposuresAndExpectedLosses: any[];
    ratingBandExposuresAndExpectedLosses: any[];
    teamExposuresAndExpectedLosses: any[];

    constructor(private navCtrl: NavController,
              private modalCtrl: ModalController,
              private instaService: InstaService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController){}

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
        this.showHistoricalExposuresAndExpectedLosses();
        this.showRatingBandExposuresAndExpectedLosses();
        this.showTeamExposuresAndExpectedLosses();
    }

    randomCssRgba () {
    let rgbaArray = [this.randomNumber(0, 255), this.randomNumber(0, 255), this.randomNumber(0, 255), this.randomNumber(50, 100) * 0.01];
        return 'rgba(' + rgbaArray.join(',') + ')';
    }
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }    
    // Show Exposure by Rating Band as bubble chart
    showRatingBandExposuresAndExpectedLosses(){
        console.log("Getting rating band exposures/losses...");
        
        let loading = this.loadingCtrl.create({
                            content: 'please wait'
                        });
        loading.present();
        this.instaService.getExposuresAndLimitsGroupByRatingBand()
        .subscribe(
            data => {
                this.ratingBandExposuresAndExpectedLosses = data;
                loading.dismissAll();

                let root:any = {};
                root.name = "Interactions";
                root.children = new Array(); 

                data.map(o=>
                {
                    root.children.push({name: o.ratingBand,  value: o.exposure});
                })    

                this.chartRatingBandExposures.render(root);

            },
            error=>{
                loading.dismissAll();
                console.log(error);
                let alert = this.alertCtrl.create({
                        title: 'Loading Error!',
                        subTitle: 'Failed to load rating band exposure/expected loss data',
                        buttons: ['OK']
                        });
                alert.present();
            });
    }
    SAVED_showRatingBandExposuresAndExpectedLosses(){
        console.log("Getting rating band exposures/losses...");
        
        let loading = this.loadingCtrl.create({
        content: 'please wait'
        });
        loading.present();
        this.instaService.getExposuresAndLimitsGroupByRatingBand()
        .subscribe(
            data => {
                this.ratingBandExposuresAndExpectedLosses = data;
                loading.dismissAll();
                $('#chart-ratingband-exposures').highcharts(
                    this.chartDataExposuresAndExpectedLosses(DashboardPage.RATING_BAND,
                        this.ratingBandExposuresAndExpectedLosses));
            },
            error=>{
            loading.dismissAll();
                console.log(error);
                let alert = this.alertCtrl.create({
                        title: 'Loading Error!',
                        subTitle: 'Failed to load rating band exposure/expected loss data',
                        buttons: ['OK']
                        });
                alert.present();
            });
    }
    showTeamExposuresAndExpectedLosses(){
        console.log("Getting team exposures/losses...");
        
        let loading = this.loadingCtrl.create({
        content: 'please wait'
        });
        loading.present();
        this.instaService.getExposuresAndLimitsGroupByTeam()
        .subscribe(
            data => {
                this.teamExposuresAndExpectedLosses = data;
                loading.dismissAll();
                $('#chart-team-exposures').highcharts(
                    this.chartDataExposuresAndExpectedLosses(DashboardPage.TEAM,
                        this.teamExposuresAndExpectedLosses));
            },
            error=>{
                loading.dismissAll();
                console.log(error);
                let alert = this.alertCtrl.create({
                        title: 'Loading Error!',
                        subTitle: 'Failed to load team exposure/expected loss data',
                        buttons: ['OK']
                        });
                alert.present();
            });
    }
    showHistoricalExposuresAndExpectedLosses(){
        console.log("Getting historical exposures/losses...");
        
        let loading = this.loadingCtrl.create({
        content: 'please wait'
        });
        loading.present();
        this.instaService.getHistoricalExposuresAndExpectedLosses()
        .subscribe(
            data => {
                this.historialExposuresAndExpectedLosses = data;
                loading.dismissAll();
                $('#chart-historical-exposures').highcharts(
                    this.chartDataHistoricalExposuresAndExpectedLosses(this.historialExposuresAndExpectedLosses));
            },
            error=>{
                loading.dismissAll();
                console.log(error);
                let alert = this.alertCtrl.create({
                        title: 'Loading Error!',
                        subTitle: 'Failed to load team exposure/expected loss data',
                        buttons: ['OK']
                        });
                alert.present();
            });
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
                    spacingBottom: 50 // to allow legend at bottom
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
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'bottom',
                    //x: -40,
                    y: 40,
                    floating: true,
                    //borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF')
                    //shadow: true
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
                title: {
                    text: 'Historical Exposures & Expected Losses'
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
