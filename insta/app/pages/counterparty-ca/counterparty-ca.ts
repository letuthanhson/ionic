import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ViewController, NavParams } from 'ionic-angular';
import { CounterpartyService } from '../../services/counterparty-service';
import { InAppBrowser } from 'ionic-native';
import {Http, Response} from '@angular/http';

@Component({
  templateUrl: 'build/pages/counterparty-ca/counterparty-ca.html',
  providers: [CounterpartyService]
})
export class CounterpartyCaPage implements OnInit {
  counterpartyName: string;
  documents: any[];

  constructor(private navCtrl: NavController,
              private http: Http,
              private counterpartyService: CounterpartyService,
              navParams: NavParams) {



    // If we navigated to this page, we will have an item available as a nav param
    this.counterpartyName = navParams.get('counterpartyName');  
    this.documents = navParams.get('documents'); 
    //console.log(this.counterpartyName);
    //console.log(this.documents);

  }
  ngOnInit() {

  }
  openDoc(item: any){
    open(cordova.file.applicationDirectory + item.docUrl, '_blank', 'location=no,enableViewPortScale=yes');
  }
}