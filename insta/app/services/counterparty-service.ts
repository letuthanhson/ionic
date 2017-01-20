import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { RankedCounterparty } from '../models/ranked-counterparty';
import { RANKED_COUNTERPARTIES } from './mock-ranked-counterparties';
import { File } from 'ionic-native';
import {SqlStorage, Storage} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CounterpartyEntity} from '../models/counterparty-entity'

@Injectable()
export class CounterpartyService {
  private storage: Storage = new Storage(SqlStorage);
  getRankedCounterparties1() {
    return Promise.resolve(RANKED_COUNTERPARTIES);
  }
  getRankedCounterparties(http: Http) {
    return Promise.resolve(http.get('mock/rankedcps.json')
          .map(res => res.json())
          .subscribe(data => {
            return data;
          }));
  
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
    return Promise.resolve(
      this.storage.query("select * from Counterparty where id = ?", [counterparty.id])
        .then(o=>{
          if (o.res.rows.length > 0) {
            return JSON.parse(o.res.rows.item(0).counterparty);
          }
          return null;
        })
        .catch(e=>{
          console.log("Error creating table: ", e);
        }));
    //return Promise.resolve(this.mockDs.getCounterparty(counterparty.id));

    //return Promise.resolve(this.getCounterparties().then(counterparties => {
    //  return this.findCounterparty(counterparty, counterparties);
    //}));
  }
  //return base64 string
  getCounterpartyPdf(counterparty: RankedCounterparty){
    console.log("File: ");
     
    console.log(cordova.file.applicationDirectory);
    console.log("ha");

    return File.readAsDataURL(cordova.file.applicationDirectory 
          + 'www/mock/sample.pdf');
    }
    getLimitAndExposure(http: Http, cpId: number){
      return Promise.resolve(http.get('mock/limit-exposure.json')
            .map(res => res.json())
            .subscribe(data => {
              return data;
            }));
  }
}