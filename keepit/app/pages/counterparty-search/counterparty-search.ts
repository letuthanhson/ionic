import { Component } from '@angular/core';
import { NavController, Page, Alert } from 'ionic-angular';
import { AutoComplete} from 'primeng/primeng';
import { RankedCounterparty } from '../../models/ranked-counterparty';
import { CounterpartyService } from '../../services/counterparty-service';
import { CounterpartyInfoPage } from '../counterparty-info/counterparty-info';

@Component({
  templateUrl: 'build/pages/counterparty-search/counterparty-search.html',
  providers: [CounterpartyService]
})
export class CounterpartySearchPage {
  counterparty: RankedCounterparty;
  //counterparties: any[]; 
  filteredCounterparties: RankedCounterparty[];

  constructor(private navCtrl: NavController,
              private counterpartyService: CounterpartyService) {
  }
  searchCounterparties(event) {
        let query = event.target.value;      
        if (query)  
          this.counterpartyService.getRankedCounterparties().then(counterparties => {
            this.filteredCounterparties = this.filterCounterparties(query, counterparties);
        });
  }

  filterCounterparties(query, counterparties: RankedCounterparty[]):RankedCounterparty[] {
        
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : RankedCounterparty[] = [];
        for(let i = 0; i < counterparties.length; i++) {
            let counterparty = counterparties[i];
            if(counterparty.name.toLowerCase().indexOf(query.toLowerCase()) == 0) { 
                filtered.push(counterparty);
            }
        }
        return filtered;
  }  
  itemTapped(event, counterparty) {
    //get counterparty details
    this.counterpartyService.getCounterparty(counterparty).then(item=>{
      if (item == null) {
        let alert = Alert.create({
            title: 'New Friend!',
            subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
            buttons: ['Ok']
        });
        this.navCtrl.present(alert);
      }
      else
        this.navCtrl.push(CounterpartyInfoPage, { "counterpartyInfo": item });
    });
  }
}
