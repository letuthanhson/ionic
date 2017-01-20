import { Injectable } from '@angular/core';

import { RANKED_COUNTERPARTIES } from './mock-ranked-counterparties';
import { COUNTERPARTIES } from './mock-counterparties';
import { RankedCounterparty } from '../models/ranked-counterparty';

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
  getCounterparty(counterparty: RankedCounterparty)
  {

    return Promise.resolve(this.getCounterparties().then(counterparties => {
      return this.findCounterparty(counterparty, counterparties);
    }));
  }
}