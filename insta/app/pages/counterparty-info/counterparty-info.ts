import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ViewController, NavParams } from 'ionic-angular';
import { AutoComplete } from 'primeng/primeng';
import { CounterpartyService } from '../../services/counterparty-service';

//for mocked data
import { RankedCounterparty } from '../../models/ranked-counterparty';


@Component({
  templateUrl: 'build/pages/counterparty-info/counterparty-info.html',
  providers: [CounterpartyService]
})
export class CounterpartyInfoPage implements OnInit {
  cpInfo: any;

  constructor(private navCtrl: NavController,
              private popoverCtrl: PopoverController,
              private counterpartyService: CounterpartyService,
              navParams: NavParams) {

    // If we navigated to this page, we will have an item available as a nav param
    this.cpInfo = navParams.get('counterpartyInfo');    
  }
  ngOnInit() {

  }
  test(){
    console.log("test.here");
    this.counterpartyService.getCounterpartyPdf(null).then(base64String=>{
      console.log(base64String);
    });
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverMenu);
    popover.present({
      ev: myEvent
    });
  }  
}

@Component({
  template: `
    <ion-list>
      <ion-list-header>Ionic</ion-list-header>
      <button ion-item (click)="close()">Learn Ionic</button>
      <button ion-item (click)="close()">Documentation</button>
      <button ion-item (click)="close()">Showcase</button>
      <button ion-item (click)="close()">GitHub Repo</button>
    </ion-list>
  `
})
class PopoverMenu {
  constructor(private viewCtrl: ViewController) {}

  close() {
    this.viewCtrl.dismiss();
  }
}