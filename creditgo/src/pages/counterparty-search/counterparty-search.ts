import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { RankedCounterparty } from '../../models/ranked-counterparty';
import { CounterpartyService } from '../../services/counterparty-service';
import { CounterpartyInfoPage } from '../counterparty-info/counterparty-info';
import { Http, Response } from '@angular/http';
import { InstaService } from '../../services/insta-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Component({
  templateUrl: 'counterparty-search.html',
  providers: [CounterpartyService]
})
export class CounterpartySearchPage {
  counterparty: RankedCounterparty;
  counterparties: RankedCounterparty[]; 
  filteredCounterparties: RankedCounterparty[];

  constructor(private navCtrl: NavController,
              private http: Http,
              private counterpartyService: CounterpartyService,
              private instaService: InstaService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastController: ToastController) {
  }
  ngOnInit() {
    console.log("Searching ranked cps...");
    let loading = this.loadingCtrl.create({
      content: 'please wait'
    });
    loading.present();
    this.instaService.getRankedCounterparties()
      .subscribe(data => {
        this.counterparties = data;
        loading.dismissAll();
      },
      error=>{
        loading.dismissAll();
        console.log(error);
        let alert = this.alertCtrl.create({
                title: 'Loading Error!',
                subTitle: 'Failed to retrieve data',
                buttons: ['OK']
              });
          alert.present();
      });
      /*mock

          this.http.get('mock/rankedcps.json')
      .map(res => res.json())
      .subscribe(data => {
        this.counterparties = data;
      },
      error=>{
        console.log(error);
      });
      */
  }

  searchCounterparties(event) {
    let query = event.target.value;      

    this.filteredCounterparties = this.filterCounterparties(query, this.counterparties);
          //this.counterpartyService.getRankedCounterparties().then(counterparties => {
           // this.filteredCounterparties = this.filterCounterparties(query, counterparties);
          //});

  }

  filterCounterparties(query, counterparties: RankedCounterparty[]):RankedCounterparty[] {
        
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : RankedCounterparty[] = [];
        if (query) {
          for(let i = 0; i < counterparties.length; i++) {
              let counterparty = counterparties[i];
              if(counterparty.name.toLowerCase().indexOf(query.toLowerCase()) == 0) { 
                  filtered.push(counterparty);
              }
          }
        }
        return filtered;
  }  
  itemTapped(event, counterparty) {
    //get counterparty details
    let loading = this.loadingCtrl.create({
      content: 'please wait'
    });
    loading.present();
    this.instaService.getCounterpartyDetail(counterparty.id)
    .subscribe(
      item=>{
        loading.dismissAll();
        if (item == undefined) {
          let toast = this.toastController.create({
            message: 'The selected counterparty info is not available',
            duration: 3000,
            position: 'middle'
          });
          toast.present();
        }
        else {
          this.navCtrl.push(CounterpartyInfoPage, { "counterpartyInfo": item });
        }
      },
      error=>{
        loading.dismissAll();
        console.log(error);
        let alert = this.alertCtrl.create({
                title: 'Loading Error!',
                subTitle: 'Failed to retrieve data',
                buttons: ['OK']
              });
          alert.present();
      });
    /*
    let cp = this.getMockedCp();
    this.navCtrl.push(CounterpartyInfoPage, { "counterpartyInfo": cp });
    */
  }
  getMockedCp():any{
    let a =   {
    "id": 1458,
    "name": "MARUBENI_GROUP",
    "parentName": null,
    "jurisdiction": null,
    "isOnAlert": false,
    "alertNotes": null,
    "industryClass": "Commercial",
    "appraisalCompletionDate": "2015-04-15T00:00:00",
    "nextAppraisalDueDate": "2016-04-30T00:00:00",
    "gcrAnalyst": "Beers,Joshua",
    "strategicCreditAnalyst": "Lo,Lily",
    "countryOfRisk": "Japan",
    "rbuOwner": "SINGAPORE",
    "fiscalYearEndDate": null,
    "isMonitored": true,
    "isWatched": false,
    "watchComments": null,
    "canProvideCollateral": false,
    "requiresBankLoi": true,
    "permitsEpfTrades": false,
    "bpRating": "BBB",
    "bpConfidenceLevel": "Average",
    "portfolioTag": null,
    "bpOutlook": "Stable",
    "riskLevel": "ALTERNATE CASE",
    "sppRating": null,
    "moodyRating": null,
    "fitchRating": null,
    "issuerSppRating": null,
    "issuerMoodyRating": null,
    "isuerFitchRating": null,
    "sppOutlook": null,
    "moodyOutlook": null,
    "fitchOutlook": null,
    "bpRatingInferred": "Actual",
    "industryInferred": "Actual",
    "inferredBpRatingCeId": 1458,
    "inferredIndustryCeId": 1458,
    "isPfeCounterparty": false,
    "creditLimit_0_6M": 0.0,
    "creditLimit_7_12M": 0.0,
    "creditLimit_13_24M": 0.0,
    "creditLimit_25M_Plus": 0.0,
    "creditLimitCurrency": null,
    "pfeComments": null
  };
  return a;
  }
}

