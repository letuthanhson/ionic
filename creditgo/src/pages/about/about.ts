import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AppVersion } from 'ionic-native';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  
  notMsg: string;
  version: string = "1.0.0";
  build: string = "1";

  constructor(private platform: Platform,
              private navCtrl: NavController,
              private http: Http) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      AppVersion.getVersionNumber()
        .then(o => {
          this.version = o;
          console.log(this.version);
        });
      AppVersion.getVersionCode()
        .then(o => {
          this.build = o;
          console.log(this.build);
        });
    });


/*
    this.db.openDatabase({
      name: 'data.db',
      location: 'default'
    }).then(() => {
        this.db.executeSql("create table if not exists Counterparty (id integer primary key, counterparty text)", {})
        .then(o => {
          this.notMsg = "Table created";
        },
          (e) => {
            this.notMsg = "Failed to create table";
            console.log("Unable creating table", e);
        })
    },
    (e) => {
        this.notMsg = "Failed to open table";
        console.log("Unable to open database", e);
    });
*/
  }
  showHelp(){}
  /*
  mockCounterpartyData() {
    this.http.get('mock/counterparties.json')
            .map(res => res.json())
            .subscribe(data => {
              
              for (let i=0; i < data.length; i++) {
                console.log("data", data[i].name);

                this.db.executeSql("insert into Counterparty (id, counterparty) select ?, ? where not exists (select 1 from Counterparty where id = ?)", [data[i].id, JSON.stringify(data[i]), data[i].id])
                
                .then(s=>{
                    this.notMsg = "Succeeded inserting " + data[i].name;
                  }
                  , e => {
                    this.notMsg = "Failed to insert " + data[i].name;
                    console.log("Error inserting data: " + JSON.stringify(e.err));
                  });
              }
              
            
      }); 
  }
  mockRankedCounterpartyData(){
    this.http.get('mock/counterparties.json')
            .map(res => res.json())
            .subscribe(data => {
              
              for (let i=0; i < data.length; i++) {
                console.log("data", data[i].id);
                this.db.executeSql("insert into Counterparty (id, counterparty) values (?, ?)", [data[i].id, JSON.stringify(data[i])])
                  .then(s=>{
                    this.notMsg = "Succeeded inserting " + data[i].name;
                  }
                  , e => {
                    this.notMsg = "Failed to insert " + data[i].name;
                    console.log("Error inserting data: " + JSON.stringify(e.err));
                  });
              }
      });
  }
  deleteMockCounterparty()
  {
    this.db.executeSql("delete from Counterparty",{})
      .then(s=>{
        this.notMsg = "Succeeded deleting data";
      }
      , e => {
        this.notMsg = "Failed to delete ";
        console.log("Error deleting data: " + JSON.stringify(e.err));
      });

  }
  getMockCounterparty()
  {
    
    this.storage.query("select * from Counterparty where id = ?", [3430])
        .then(o=>{
          for(let i=0; i<o.res.rows.length; i++){
            console.log("Retrieve: ", o.res.rows.item(i).counterparty);
          }
        })
      .catch(e=>{
        console.log("Error select cp: ", e);
      });
      
  }
  getMockCounterpartyCount()
  {
    this.storage.query("select count(1) from Counterparty")
        .then(o=>{
          for(let i=0; i<o.res.rows.length; i++){
            console.log("Total Cps: ", o.res.rows.item(i));
          }
        })
      .catch(e=>{
        console.log("Error select count: ", e);
      });
      
  }
  */
}
