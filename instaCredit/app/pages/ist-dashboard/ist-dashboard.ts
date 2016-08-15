import { Component, ViewChild, OnInit } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AppChartJs} from '../../components/app-chart-js/app-chart-js';

//import {DataTable} from 'primeng/primeng';
//import {Column} from 'primeng/primeng';

/*2
  Generated class for the IstDashboardPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var Chart;

@Component({
  templateUrl: 'build/pages/ist-dashboard/ist-dashboard.html',
  directives: [AppChartJs]
})
export class IstDashboardPage implements OnInit {
    @ViewChild('historicalExpChart') private historicalExpChart:AppChartJs;
    @ViewChild('historicalElChart') private historicalElChart:AppChartJs;     
  selectedItem: any;
  ratingBandList: any[];


  constructor(private navCtrl: NavController, navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.ratingBandList = this.ratingBandData();
  }
  ngOnInit() {
    this.chartByRatingBandData(false);
    this.chartByRatingBandData(true);    
  }
  chartByRatingBandData(isExpectedLoss: boolean){
    //let ratingBandData = this.ratingBandData();
    
    //dates on x-axis
    let xLabels = this.ratingBandList.map((dataItem)=>{ return dataItem.date });

    //stack based on rating band[]
    let ratingBands = this.ratingBands();

    let datasets: any[] = [];

    for (var i in ratingBands) {
        let data: any = new Object();
        data.label = ratingBands[i];
        data.backgroundColor = this.randomCssRgba();
        data.data = this.ratingBandList.map((dataItem) => { 
            for (var item of dataItem.ratingBands) {
              if (item.ratingBand === ratingBands[i]) {
                 if (isExpectedLoss)
                    return item.expectedLoss / 1000000;
                 else
                    return item.exposure / 1000000;
              }
            }
            return 0;
        });

      datasets.push(data);
    }
    let chartData = {
                labels : xLabels,
                datasets : datasets
        };
    if (isExpectedLoss)    
        this.historicalElChart.render({
                type: 'bar',
                data: chartData,
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            stacked: true
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    }
                }
            });     
    else
        this.historicalExpChart.render({
                type: 'bar',
                data: chartData,
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            stacked: true
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    }
                }
            });               
  }
  randomCssRgba () {
    let rgbaArray = [this.randomNumber(0, 255), this.randomNumber(0, 255), this.randomNumber(0, 255), this.randomNumber(50, 100) * 0.01];
    return 'rgba(' + rgbaArray.join(',') + ')';
  }
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }    
  ratingBands(){
    return this.ratingBandData()[0].ratingBands.map((ratingBand)=>{ return ratingBand.ratingBand });
  }
  ratingBandData() {
        return  [
                {
                    "date":"06/30/2014",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 2240007082.69,
                        "expectedLoss": 92967.24
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 2084976844.78,
                        "expectedLoss": 804866.89
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 6008393900.06,
                        "expectedLoss": 4485705.55
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1708151059.66,
                        "expectedLoss": 3671666.62
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 2098103082.94,
                        "expectedLoss": 10166847.74
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 100145258.39,
                        "expectedLoss": 1511191.95
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 90137946.34,
                        "expectedLoss": 1216862.28
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 32472638.71,
                        "expectedLoss": 974179.16
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 209596744.29,
                        "expectedLoss": 1068943.4
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 44696.91,
                        "expectedLoss": 26818.15
                    }
                    ]
                },
                {
                    "date":"07/31/2014",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 2381822597.82,
                        "expectedLoss": 105475.56
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1717822100.11,
                        "expectedLoss": 694475.78
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 5978399191.32,
                        "expectedLoss": 4465749
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1769656829.75,
                        "expectedLoss": 3862084.99
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1760770350.34,
                        "expectedLoss": 8805345.55
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 63470915.61,
                        "expectedLoss": 957776.12
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 99688881.17,
                        "expectedLoss": 1345799.9
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 11216753.53,
                        "expectedLoss": 336502.61
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 211107597.32,
                        "expectedLoss": 1076648.75
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 64833.24,
                        "expectedLoss": 38899.95
                    }
                    ]
                },
                {
                    "date":"08/29/2014",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1928581021.44,
                        "expectedLoss": 82362.23
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1592116460.54,
                        "expectedLoss": 596841.67
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 5008749164.11,
                        "expectedLoss": 3697120.75
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 2077826482.04,
                        "expectedLoss": 4444915.8
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1813662320.17,
                        "expectedLoss": 9054505.23
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 48524227.91,
                        "expectedLoss": 732230.6
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 114533167.42,
                        "expectedLoss": 1546197.76
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 7467371.15,
                        "expectedLoss": 224021.13
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 160903915.8,
                        "expectedLoss": 820609.97
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 1069845.77,
                        "expectedLoss": 641907.46
                    }
                    ]
                },
                {
                    "date":"09/30/2014",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1870668415.55,
                        "expectedLoss": 77042.27
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1560707952.98,
                        "expectedLoss": 633772.42
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 4753367797.73,
                        "expectedLoss": 3510453.49
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1371312728.48,
                        "expectedLoss": 2946452.82
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 2193324119.31,
                        "expectedLoss": 10869668.84
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 72996847.85,
                        "expectedLoss": 1101522.43
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 86764800.44,
                        "expectedLoss": 1171324.81
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 8936441.85,
                        "expectedLoss": 268093.26
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 186036188.05,
                        "expectedLoss": 948784.56
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 1068719.43,
                        "expectedLoss": 641231.66
                    }
                    ]
                },
                {
                    "date":"10/31/2014",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 2078621613.59,
                        "expectedLoss": 591426.09
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 2338500647.79,
                        "expectedLoss": 1232639.86
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 5686253703.81,
                        "expectedLoss": 4124645.43
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1577126436.39,
                        "expectedLoss": 2175227.88
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1931540740.7,
                        "expectedLoss": 4879193.91
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 324206709.49,
                        "expectedLoss": 2487097.07
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 80207541.3,
                        "expectedLoss": 1082801.81
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 41540550.41,
                        "expectedLoss": 1246216.51
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 242260867.09,
                        "expectedLoss": 494212.17
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 329590.53,
                        "expectedLoss": 197754.32
                    }
                    ]
                },
                {
                    "date":"11/30/2014",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1661206714.33,
                        "expectedLoss": 653491.45
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 2160040738.96,
                        "expectedLoss": 1619149.1
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 5108535213.43,
                        "expectedLoss": 5150931.77
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1994431402.53,
                        "expectedLoss": 3868630.72
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1994282149.66,
                        "expectedLoss": 7028024.05
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 320786362.13,
                        "expectedLoss": 5697165.79
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 100864485.95,
                        "expectedLoss": 1361670.56
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 33649896.74,
                        "expectedLoss": 1009496.9
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 233876651.61,
                        "expectedLoss": 673564.76
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 8177693.33,
                        "expectedLoss": 4906616
                    }
                    ]
                },
                {
                    "date":"12/31/2014",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1395330607.75,
                        "expectedLoss": 595056.12
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1709736996.4,
                        "expectedLoss": 1263683.69
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 4245371365.44,
                        "expectedLoss": 4303143.74
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1773061508.22,
                        "expectedLoss": 3468845.16
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1951267764.61,
                        "expectedLoss": 6578804.38
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 241889874.4,
                        "expectedLoss": 4295964.17
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 101670036.45,
                        "expectedLoss": 1372545.49
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 47087283.81,
                        "expectedLoss": 1412618.51
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 340026539.22,
                        "expectedLoss": 979276.43
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 8907020.86,
                        "expectedLoss": 5344212.51
                    }
                    ]
                },
                {
                    "date":"01/30/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1490772359.99,
                        "expectedLoss": 645505.46
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1701704569.64,
                        "expectedLoss": 1263231.5
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 4137032790.54,
                        "expectedLoss": 4162619.62
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1869391276.52,
                        "expectedLoss": 3628505.26
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1936572006.87,
                        "expectedLoss": 6763723.4
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 282484669.59,
                        "expectedLoss": 9116100.03
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 170227068.27,
                        "expectedLoss": 2613331.39
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 24293469.15,
                        "expectedLoss": 280397.51
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 337891398.87,
                        "expectedLoss": 973127.23
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 17335679.41,
                        "expectedLoss": 107303.65
                    }
                    ]
                },
                {
                    "date":"02/27/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1365761481.04,
                        "expectedLoss": 600889.84
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1936376062.48,
                        "expectedLoss": 1372846.67
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 3801401293.55,
                        "expectedLoss": 3842226.94
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 2165433868.13,
                        "expectedLoss": 4141051.18
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1747725822.33,
                        "expectedLoss": 6182830.53
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 252406270.18,
                        "expectedLoss": 1663960.42
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 165142854.16,
                        "expectedLoss": 2544694.5
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 98465747.91,
                        "expectedLoss": 2557482.82
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 342248762.93,
                        "expectedLoss": 985676.44
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 17273714.08,
                        "expectedLoss": 70124.45
                    }
                    ]
                },
                {
                    "date":"03/31/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1455506228.48,
                        "expectedLoss": 717582.92
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1476389761.7,
                        "expectedLoss": 1302493.88
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 3264260728.11,
                        "expectedLoss": 3864222.86
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1977775058.44,
                        "expectedLoss": 4522160.58
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1624014304.86,
                        "expectedLoss": 8748681.12
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 283246852.32,
                        "expectedLoss": 2469470.5
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 100688544.25,
                        "expectedLoss": 1968539.86
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 65757737.68,
                        "expectedLoss": 1665211.6
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 566477502.79,
                        "expectedLoss": 2668109.04
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 17264927.82,
                        "expectedLoss": 64852.69
                    }
                    ]
                },
                {
                    "date":"04/30/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1743864209.56,
                        "expectedLoss": 885430.79
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1727333011.28,
                        "expectedLoss": 1548753.5
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 4275145875.11,
                        "expectedLoss": 5134588.66
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1617694947.99,
                        "expectedLoss": 3701185.07
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1436742444.9,
                        "expectedLoss": 7608672.75
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 328748612.29,
                        "expectedLoss": 8994572.81
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 82463934.28,
                        "expectedLoss": 1679315.3
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 25511212.62,
                        "expectedLoss": 445820.67
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 523486600.99,
                        "expectedLoss": 2465621.89
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 17244218.98,
                        "expectedLoss": 52427.39
                    }
                    ]
                },
                {
                    "date":"05/29/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1881938854.15,
                        "expectedLoss": 972476.91
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1602132470.54,
                        "expectedLoss": 1416595.72
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 3474419804.74,
                        "expectedLoss": 4171351.5
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1869832643.27,
                        "expectedLoss": 4194507.62
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1448370182.76,
                        "expectedLoss": 7742036.84
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 377714429.95,
                        "expectedLoss": 4342762.56
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 115313409.31,
                        "expectedLoss": 2200636.47
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 50378297.37,
                        "expectedLoss": 1511348.92
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 486447257.14,
                        "expectedLoss": 2291166.58
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 17242714.5,
                        "expectedLoss": 51524.7
                    }
                    ]
                },
                {
                    "date":"06/30/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1312054812.86,
                        "expectedLoss": 695803.03
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1359705189.4,
                        "expectedLoss": 1286431.23
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 2665088423.07,
                        "expectedLoss": 3190989.85
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1613477704.55,
                        "expectedLoss": 3320115.94
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1297177031.05,
                        "expectedLoss": 6394224.29
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 379851656.73,
                        "expectedLoss": 2630543.07
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 117296601.97,
                        "expectedLoss": 1328639.79
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 21102167.31,
                        "expectedLoss": 633065.02
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 440655687.84,
                        "expectedLoss": 2234124.34
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 17230388.51,
                        "expectedLoss": 44129.11
                    }
                    ]
                },
                {
                    "date":"07/31/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1101662004.43,
                        "expectedLoss": 564049.99
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1679124551.82,
                        "expectedLoss": 1548163.14
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 3538114176.5,
                        "expectedLoss": 4233639.73
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1852635517.98,
                        "expectedLoss": 3729530.18
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1490398150.98,
                        "expectedLoss": 7909749.32
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 363552113.9,
                        "expectedLoss": 2341063.19
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 124064287.84,
                        "expectedLoss": 810715
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 34926786.76,
                        "expectedLoss": 647442.84
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 461587362.07,
                        "expectedLoss": 2340247.93
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 17740908.59,
                        "expectedLoss": 350441.16
                    }
                    ]
                },
                {
                    "date":"08/31/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1318315807.32,
                        "expectedLoss": 746531.12
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1570090608.82,
                        "expectedLoss": 1478778.23
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 3124143555.3,
                        "expectedLoss": 3735504.06
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1596537797.63,
                        "expectedLoss": 3229390.43
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1373386902.38,
                        "expectedLoss": 7207785.03
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 344481922.18,
                        "expectedLoss": 2002376.58
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 133234640.2,
                        "expectedLoss": 974999.22
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 39677800.23,
                        "expectedLoss": 1044834.01
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 457313970.93,
                        "expectedLoss": 2318581.83
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 17209273.65,
                        "expectedLoss": 31460.19
                    }
                    ]
                },
                {
                    "date":"09/30/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 820943869.53,
                        "expectedLoss": 404725.26
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1262004199.57,
                        "expectedLoss": 1197761.11
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 2693335415.63,
                        "expectedLoss": 3343934.84
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1658303391.56,
                        "expectedLoss": 3832959.06
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1304374692.7,
                        "expectedLoss": 7883182.41
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 353290918.82,
                        "expectedLoss": 2742290.41
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 134235013.06,
                        "expectedLoss": 1233060.13
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 12178675.59,
                        "expectedLoss": 329920.32
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 499756223.48,
                        "expectedLoss": 2803632.41
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 17214007.77,
                        "expectedLoss": 34300.66
                    }
                    ]
                },
                {
                    "date":"10/30/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1391214538.47,
                        "expectedLoss": 696624.68
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1835389185.5,
                        "expectedLoss": 1718073.47
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 3246959475.58,
                        "expectedLoss": 4100323.48
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1672914435.08,
                        "expectedLoss": 3785467.49
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1193703626.18,
                        "expectedLoss": 6879861.81
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 197672331.06,
                        "expectedLoss": 3645966.39
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 69780968.29,
                        "expectedLoss": 1168311.15
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 4414247.23,
                        "expectedLoss": 119581.96
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 568982730.86,
                        "expectedLoss": 3191993.12
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 221294361.2,
                        "expectedLoss": 5077423.32
                    }
                    ]
                },
                {
                    "date":"11/30/2015",
                    "ratingBands": [

                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1248140380.57,
                        "expectedLoss": 619766.95
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1483245938.23,
                        "expectedLoss": 1443388.81
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 3030731753.3,
                        "expectedLoss": 3834915.99
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 2001734565.67,
                        "expectedLoss": 4587110.82
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1168542669.2,
                        "expectedLoss": 6735146.76
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 234664490.13,
                        "expectedLoss": 4480509.54
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 55840864.13,
                        "expectedLoss": 1003460.33
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 11183781.68,
                        "expectedLoss": 194293.2
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 603233647.05,
                        "expectedLoss": 3384140.76
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 224889428.75,
                        "expectedLoss": 7234463.85
                    }
                    ]
                },
                {
                    "date":"12/31/2015",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 941364479.7,
                        "expectedLoss": 478999.02
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1390682922.92,
                        "expectedLoss": 1581512.98
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 2651724993.82,
                        "expectedLoss": 3920708.73
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1833941694.9,
                        "expectedLoss": 5042093.91
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1106668406.2,
                        "expectedLoss": 6902778.65
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 180159889.81,
                        "expectedLoss": 3780382.66
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 46568708.09,
                        "expectedLoss": 836839.68
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 5953236.85,
                        "expectedLoss": 59857.94
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 586803882.21,
                        "expectedLoss": 3415198.59
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 247987370.95,
                        "expectedLoss": 3701561.37
                    }
                    ]
                },
                {
                    "date":"01/29/2016",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1139534922.31,
                        "expectedLoss": 608835.74
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1215044784.64,
                        "expectedLoss": 1419379.26
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 2750138826.7,
                        "expectedLoss": 4095868.39
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1838425820.45,
                        "expectedLoss": 5196146.93
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1216427105.3,
                        "expectedLoss": 7389746.24
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 175679554.33,
                        "expectedLoss": 3912336.84
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 51501657.9,
                        "expectedLoss": 925484.43
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 5707811.71,
                        "expectedLoss": 55805.32
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 610385868.34,
                        "expectedLoss": 3552445.75
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 272667680.45,
                        "expectedLoss": 13622204.07
                    }
                    ]
                },
                {
                    "date":"02/29/2016",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1441378712.68,
                        "expectedLoss": 778689.86
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1580146916.18,
                        "expectedLoss": 1783132.11
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 2779129105.48,
                        "expectedLoss": 4123777.72
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1954529407.13,
                        "expectedLoss": 5389602.67
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1276152975.55,
                        "expectedLoss": 7836490.59
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 227550494.25,
                        "expectedLoss": 5207502.37
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 59850483.88,
                        "expectedLoss": 1032542
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 5262127.26,
                        "expectedLoss": 73418.24
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 646693903.91,
                        "expectedLoss": 3763758.52
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 273808672.46,
                        "expectedLoss": 14306799.27
                    }
                    ]
                },
                {
                "date":"03/31/2016",
                "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 810547916.86,
                        "expectedLoss": 423035.51
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1251778791.16,
                        "expectedLoss": 1424239.09
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 2498201385.9,
                        "expectedLoss": 3779393.98
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1572591837.38,
                        "expectedLoss": 4445954.78
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 1046952947.96,
                        "expectedLoss": 6816551.11
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 223190341.28,
                        "expectedLoss": 5060197.88
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 37948256.63,
                        "expectedLoss": 681772.88
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 5817708,
                        "expectedLoss": 67663.87
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 556601554.48,
                        "expectedLoss": 3239421.05
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 275430970.19,
                        "expectedLoss": 5859544.32
                    }
                    ]
                },
                {
                    "date":"04/29/2016",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1207527346.66,
                        "expectedLoss": 684866.08
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1181271970.48,
                        "expectedLoss": 1271833.21
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 3395534093.2,
                        "expectedLoss": 5327040.33
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1728562750.48,
                        "expectedLoss": 4877191.98
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 969092486.19,
                        "expectedLoss": 5958266.89
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 248239593.12,
                        "expectedLoss": 5400521.96
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 45947334.7,
                        "expectedLoss": 825673.6
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 10671850.16,
                        "expectedLoss": 289521.02
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 476410650.98,
                        "expectedLoss": 2772709.99
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 289237709.37,
                        "expectedLoss": 14143588.42
                    }
                    ]
                },
                {
                    "date":"05/31/2016",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 1388113326.87,
                        "expectedLoss": 790936.96
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 1161203497.12,
                        "expectedLoss": 1237743.43
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 3133146797.69,
                        "expectedLoss": 4876899.51
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1677737945.48,
                        "expectedLoss": 4589505.72
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 904741046.31,
                        "expectedLoss": 5554306.7
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 298462313.69,
                        "expectedLoss": 6509450.47
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 93601094.67,
                        "expectedLoss": 1678866.92
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 13399106.53,
                        "expectedLoss": 367056.24
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 469741849.52,
                        "expectedLoss": 2733897.56
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 286705900.88,
                        "expectedLoss": 12624503.33
                    }
                    ]
                },
                {
                    "date":"06/30/2016",
                    "ratingBands": [
                    {
                        "ratingBand": "AAA to AA-",
                        "exposure": 624671252.13,
                        "expectedLoss": 472529.71
                    },
                    {
                        "ratingBand": "A+ to A-",
                        "exposure": 980227289.05,
                        "expectedLoss": 1471942.31
                    },
                    {
                        "ratingBand": "BBB+ to BBB-",
                        "exposure": 2205609581.27,
                        "expectedLoss": 4631354.94
                    },
                    {
                        "ratingBand": "BB+ to BB-",
                        "exposure": 1309063601.76,
                        "expectedLoss": 4916198.32
                    },
                    {
                        "ratingBand": "B+ to B-",
                        "exposure": 960780087.2,
                        "expectedLoss": 7668764.64
                    },
                    {
                        "ratingBand": "CCC+ and Below",
                        "exposure": 274531881.17,
                        "expectedLoss": 6812963
                    },
                    {
                        "ratingBand": "Not Rated",
                        "exposure": 58345969.27,
                        "expectedLoss": 1261177.57
                    },
                    {
                        "ratingBand": "No Limit",
                        "exposure": 6736234.07,
                        "expectedLoss": 190695.26
                    },
                    {
                        "ratingBand": "Pooled",
                        "exposure": 460590028.36,
                        "expectedLoss": 3523513.72
                    },
                    {
                        "ratingBand": "Defaulted",
                        "exposure": 274252269.73,
                        "expectedLoss": 13615543.64
                    }
                    ]
                }
            ];
    }   
}
