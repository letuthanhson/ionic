import { Injectable } from '@angular/core';

import { RankedCounterparty } from '../models/ranked-counterparty';
import { RANKED_COUNTERPARTIES } from './mock-ranked-counterparties';
import { COUNTERPARTIES } from './mock-counterparties';
import {File} from 'ionic-native';

@Injectable()
export class CounterpartyService {
  getRankedCounterparties() {
    return Promise.resolve(RANKED_COUNTERPARTIES);
  }
  getCounterparties() {
    return Promise.resolve(COUNTERPARTIES);
  }
  findCounterparty(counterparty: RankedCounterparty, counterparties: any[]) {
    for (let i=0; i < counterparties.length; i++) {
      if (counterparties[i].id === counterparty.id) {
        return counterparties[i];
      }
    }
  }
  getCounterparty(counterparty: RankedCounterparty):any
  {

    return Promise.resolve(this.getCounterparties().then(counterparties => {
      return this.findCounterparty(counterparty, counterparties);
    }));
  }
  //return base64 string
  getCounterpartyPdf(counterparty: RankedCounterparty){
    console.log("File: ");
    return File.readAsDataURL('mock/sample.pdf').catch(e=>{
      console.log("...");
      console.log(e.name);
      console.log(e.message);
      console.log(e.stack);
            console.log(".......");
    });
  }
}