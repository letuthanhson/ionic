import {Component, OnInit} from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import {AutoComplete} from 'primeng/primeng';
import { RankedCounterparty } from '../../models/ranked-counterparty';
import { CounterpartyService } from '../../services/counterparty-service';

@Component({
  templateUrl: 'build/pages/counterparty-info/counterparty-info.html',
  providers: [CounterpartyService]
})
export class CounterpartyInfoPage implements OnInit {
  cpInfo: any;

  constructor(private navCtrl: NavController,
              private counterpartyService: CounterpartyService, navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.cpInfo = navParams.get('counterpartyInfo');    
  }
  ngOnInit() {

  }
}
