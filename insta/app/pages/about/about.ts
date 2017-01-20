import {Component} from '@angular/core';
import {NavController, SqlStorage, Storage} from 'ionic-angular';
import {Http, Response} from '@angular/http';

@Component({
  templateUrl: 'build/pages/about/about.html'
})
export class AboutPage {
  private storage: Storage;

  constructor(private navCtrl: NavController,
              private http: Http) {
    this.storage = new Storage(SqlStorage);
    this.storage.query("create table if not exists Counterparty (id integer primary key, counterparty text)")
      .then(o=>{})
      .catch(e=>{
        console.log("Error creating table: ", e);
      });
  }
  mockCounterpartyData(){
    this.http.get('mock/counterparties.json')
            .map(res => res.json())
            .subscribe(data => {
              
              for (let i=0; i < data.length; i++) {
                console.log("data", data[i].name);
          
                this.storage.query("insert into Counterparty (id, counterparty) select ?, ? where not exists (select 1 from Counterparty where id = ?)", [data[i].id, JSON.stringify(data[i]), data[i].id])
                  .then(s=>{})
                  .catch(e=>{
                    console.log("Error inserting data: ", data[i].name);
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
          
                this.storage.query("insert into Counterparty (id, counterparty) values (?, ?)", [data[i].id, JSON.stringify(data[i])])
                  .then(s=>{})
                  .catch(e=>{
                    console.log("Error inserting data: ", e);
                  });
              }
      });
  }
  deleteMockCounterparty()
  {
    this.storage.query("delete from Counterparty")
        .then(o=>{
          console.log("delete counterparties successfully");
        })
      .catch(e=>{
        console.log("Error deleting cp: ", e);
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
}
