import { Injectable } from '@angular/core';

import { RANKED_COUNTERPARTIES } from './mock-ranked-counterparties';

@Injectable()
export class CounterpartyService {
  getHeroes() {
    return RANKED_COUNTERPARTIES;
  }
}