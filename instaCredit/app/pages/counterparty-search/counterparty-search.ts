import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/counterparty-search.html',
})
export class CounterpartySearch implements OnInit {  
  selectedItem: any;


  constructor(private navCtrl: NavController, navParams: NavParams) {

  }
  ngOnInit() {

  }
}