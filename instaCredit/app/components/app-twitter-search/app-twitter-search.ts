import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var Bloodhound: any;

@Component({
  selector: 'app-twitter-search',
  template: '<div #theSearch><input class="typeahead" type="text" placeholder="States of USA"></div>'
})
export class AppTwitterSearch implements OnInit {
  @ViewChild('theSearch') private theSearch:ElementRef;

  constructor() {}
  ngOnInit() {
    let states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
      'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
      'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minneseota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
      'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
      'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    // constructs the suggestion engine
    let engine = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      // `states` is an array of state names defined in "The Basics"
      local: states
    });
    
    this.theSearch.nativeElement.querySelector('.typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'states',
      source: states
    });
    
  }
}