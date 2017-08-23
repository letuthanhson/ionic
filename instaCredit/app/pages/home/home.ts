import { Component, ViewChild, ElementRef } from '@angular/core';
import { AppChartJs} from '../app-chart-js/app-chart-js';
//import { AutoComplete } from 'primeng/primeng';
import {HTTP_PROVIDERS} from "@angular/http";

@Component({
  templateUrl: 'build/pages/home/home.html',
  //directives: [AutoComplete]
})

export class HomePage {
  @ViewChild('renderMe') private _render:AppChartJs;
  constructor() {

  }
  fruits: any[] = [
    {
      id: 1,
      name: "1 - Apple",
      searchText: "apple"
    },
    {
      id: 2,
      name: "2 - Orange",
      searchText: "orange"
    },
    {
      id: 3,
      name: "3 - Banana",
      searchText: "banana"
    }
  ];

    text: string;
    
    results: string[];
    
    search(event) {
        this.results = this.fruits;
    }
    
  render(){
    this._render.render();
    console.log('testing');
  }
  goTo(){
    console.log('aha');
  }
}
