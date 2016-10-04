import { Component } from '@angular/core';
import { NavController, Page, AlertController, ToastController } from 'ionic-angular';
import { RankedCounterparty } from '../../models/ranked-counterparty';
import { CounterpartyService } from '../../services/counterparty-service';
import { CounterpartyInfoPage } from '../counterparty-info/counterparty-info';
import {Http, Response} from '@angular/http';

@Component({
  templateUrl: 'build/pages/counterparty-search/counterparty-search.html',
  providers: [CounterpartyService]
})
export class CounterpartySearchPage {
  counterparty: RankedCounterparty;
  counterparties: RankedCounterparty[]; 
  filteredCounterparties: RankedCounterparty[];

  constructor(private navCtrl: NavController,
              private http: Http,
              private counterpartyService: CounterpartyService,
              private alertController: AlertController,
              private toastController: ToastController) {

    //get mocked ranked data
    this.http.get('mock/rankedcps.json')
      .map(res => res.json())
      .subscribe(data => {
        this.counterparties = data;
      },
      error=>{
        console.log(error);
      });
  }
  ngOnInit() {

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
    this.counterpartyService.getCounterparty(counterparty).then(item=>{

      if (item == null) {
        let toast = this.toastController.create({
          message: 'The selected counterparty info is not available',
          duration: 3000,
          position: 'middle'
        });
        toast.present();
      }
      else
        this.navCtrl.push(CounterpartyInfoPage, { "counterpartyInfo": item });
    });
  }
}
