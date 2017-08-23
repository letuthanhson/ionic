import { CR } from '@angular/compiler/src/i18n/serializers/xml_helper';
import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { RankedCounterparty } from '../../models/ranked-counterparty';
import { CounterpartyService } from '../../services/counterparty-service';
import { CounterpartyInfoPage } from '../counterparty-info/counterparty-info';
import { Http, Response } from '@angular/http';
import { InstaService } from '../../services/insta-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/empty';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/finally";
import 'rxjs';

@Component({
  templateUrl: 'counterparty-search.html',
  providers: [CounterpartyService]
})
export class CounterpartySearchPage {
  counterparty: RankedCounterparty;
  counterparties: RankedCounterparty[] = []; 
  filteredCounterparties: RankedCounterparty[];
  showingSection:boolean = false; 
  searchToken: string = "";
  searchControl = new FormControl();
  searching: boolean = false;
  prevSearchToken: string = "";
  //flag to detect orientation changed
  _isOrientationChanged = false;

  constructor(private navCtrl: NavController,
              private http: Http,
              private counterpartyService: CounterpartyService,
              private instaService: InstaService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastController: ToastController) {
  }

  ionViewDidLoad(){

    this.searchControl.valueChanges.debounceTime(500)
                              .distinctUntilChanged()
                              .switchMap(searchControl =>  
                              {                                                      
                                return this.instaService.getRankedCounterpartiesByNameQuery(this.searchToken.trim());                                                        
                              })
                              .subscribe(c=> 
                              {
                                this.counterparties = [];
                                this.counterparties = c;       

                                if(c.length > 0) {
                                  this.showingSection = true;
                                }
                                else{

                                   let toast = this.toastController
                                                   .create({
                                                      message: 'Search returns no counterparty',
                                                      duration: 2000,
                                                      position: 'middle'
                                                    });
                                    toast.present();
                                    this.showingSection = false;
                                }
                                
                                this.searching = false;

                              });  
  }

  ionViewDidEnter(){
   
    // add orientation change event handler
    window.addEventListener("orientationchange", ()=>this._isOrientationChanged = true, false); 

    if(this._isOrientationChanged) this.searchCounterparties(()=>this.searching=false);
    }

  ionViewDidLeave()
  {
    this._isOrientationChanged = false;
    window.removeEventListener("orientationchange", ()=> this.searchCounterparties(()=>this.searching=false), false); 
  }
  
  refreshSearch(refresher){

    this.clearSearchResult();
        
    if(!this.isSearchTokenValid()){

      refresher.complete();
      
      return;
    }
   
    this.searchCounterparties(()=> refresher.complete());
  }
  
  clearSearchResult(){
   // this.counterparties = null;
    this.showingSection = false;
  }

  isSearchTokenValid():boolean
  {
    return (this.searchToken !== undefined && this.searchToken.trim().length > 1)      
  }

  searchClick(event) {

    if(this.prevSearchToken == event.target.value || !this.isSearchTokenValid()) return;
    
    this.searching = true;
    this.showingSection = false;
    this.prevSearchToken = event.target.value;
  } 

  searchCounterparties(callback: ()=> any){

    this.searching = true;
    this.instaService.getRankedCounterpartiesByNameQuery(this.searchToken.trim())
      .subscribe(data => {

        this.counterparties = data;

        if(callback) callback();
        
        if (this.counterparties === undefined || data.length === 0) {

          this.showingSection = false;

          let toast = this.toastController.create({
              message: 'Search returns no counterparty',
              duration: 2000,
              position: 'middle'
            });

          toast.present();
        }
        else  this.showingSection = true;        
      },
      error => {

        if(callback) callback();
 
        let alert = this.alertCtrl.create({
                title: 'Loading Error!',
                subTitle: 'Failed to retrieve data',
                buttons: ['OK']
              });
          alert.present();
      }); ;    
  }

  itemTapped(event, counterparty) {
    //get counterparty details
    let loading = this.loadingCtrl.create({
      content: 'please wait'
    });
    loading.present();

    Observable.forkJoin(
      this.instaService.getCounterpartyDetail(counterparty.id),
      this.instaService.getCounterpartyCurrentLimitsAndExposures(counterparty.name),
      this.instaService.getCounterpartyForwardLimitsAndExposures(counterparty.id)
      )
    .subscribe(
        data => {
         
          loading.dismissAll();

          if (data[0] == undefined) {
            
            let toast = this.toastController.create({
              message: 'The selected counterparty info is not available',
              duration: 3000,
              position: 'middle'
            });

            toast.present();
          }
          else {   
            if(data[2] ==null){
              data[2] = new Array<any>();
            }         
            this.navCtrl.push(CounterpartyInfoPage, { "counterpartyInfo": data[0], "limitsAndExposures": data[1] , "forwardLimitsAndExposures": data[2]});
          }
      },
      error=>{
        loading.dismissAll();
        console.log(error);
        let alert = this.alertCtrl.create({
                title: 'Loading Error!',
                subTitle: 'Failed to retrieve data',
                buttons: ['OK']
              });
          alert.present();
      });  
  }  
}

