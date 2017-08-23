import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RankedCounterparty } from '../models/ranked-counterparty';
import { CounterpartyFile } from '../models/counterparty-file';
//import { RANKED_COUNTERPARTIES } from './mock-ranked-counterparties';
import { File } from 'ionic-native';
import { SQLite } from 'ionic-native';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {CounterpartyEntity} from '../models/counterparty-entity'

@Injectable()
export class CounterpartyService {
    private db = new SQLite();
  //private storage: Storage = new Storage(SqlStorage);
  //getRankedCounterparties1() {
   // return Promise.resolve(RANKED_COUNTERPARTIES);
  //}
  constructor(private http: Http){}

  getRankedCounterparties(http: Http):any {
    return Promise.resolve(http.get('mock/rankedcps.json')
          .map(res => res.json())
          .subscribe(data => {
            return data;
          }));
  
  }
  /*
  findCounterparty(counterparty: RankedCounterparty, counterparties: any[]) {
    for (let i=0; i < counterparties.length; i++) {
      if (counterparties[i].id === counterparty.id) {
        return counterparties[i];
      }
    }
  }
  */
  /*
  getCounterparty1(counterparty: RankedCounterparty):any
  {
      return Promise.resolve(
        this.db.openDatabase({
          name: 'data.db',
          location: 'default'
        }).then(() => {
          this.db.executeSql("select cou from Counterparty where id = ?", [counterparty.id])
          .then(o => {
            console.log(counterparty.id, o);
            return JSON.parse(o);
          },
          (e) => {
              console.log("Unable to get counterparty", e);
          })
      },
      (e) => {
          console.log("Unable to open database", e);
      }));
  }
  getCounterparty2(counterparty: RankedCounterparty):any
  {
      return Promise.resolve(this.db.openDatabase({
          name: 'data.db',
          location: 'default'
        }).then(() => {
          this.db.executeSql("select counterparty from Counterparty where id = ?", [counterparty.id])
          .then(result => {
            if (result.rows.length > 0) {
              console.log(JSON.parse(result.rows.item(0).counterparty));
              return JSON.parse(result.rows.item(0).counterparty);
            }
            else
              return undefined;
          },
          (e) => {
              console.log("Unable to get counterparty", JSON.stringify(e));
          })
      },
      (e) => {
          console.log("Unable to open database", JSON.stringify(e));
      }));
  }
  */
  getCounterparty(counterpartyId: number): Observable<any>
  {
      return Observable.create(observer => {
        this.db.openDatabase({
          name: 'data.db',
          location: 'default'
        })
        .then(() => 
          this.db.executeSql("select counterparty from Counterparty where id = ?", [counterpartyId]))
        .then(result => {
          if (result.rows.length > 0) {
            console.log(JSON.parse(result.rows.item(0).counterparty));
            observer.next(JSON.parse(result.rows.item(0).counterparty));
          }
          else
            return observer.next(undefined);
        })
        .catch(e => {
          console.log("Error: ", JSON.stringify(e));
          observer.error(new Error("Error" + JSON.stringify(e)));
        })
      });

  }
  
  handleError(error: any): any {
    if (error instanceof Response) {
      return Observable.throw(error.json().error || 'Backend server error');
    }
    else {
      return Observable.throw(error || "Bankend serve error");
    }
  }
}
