import {Component} from '@angular/core';
//import {DatePipe} from "@angular/common";
//import {HTTP_PROVIDERS, Http} from "@angular/http";
//import {DataTableDirectives} from 'angular2-datatable/datatable';

@Component({
    selector: 'table-test',
    //templateUrl: 'table-exp-el-by-rating.html',
    template: '<div>waiting</div>',
    //providers: [HTTP_PROVIDERS],
    //directives: [DataTableDirectives],
    //pipes: [DatePipe]
})
export class TableExpElByRating {

    private data;

    constructor(){}
    /*test(private http:Http) {
            console.log('i am here');
       http.get("data.json")
            .subscribe((data)=> {
                setTimeout(()=> {
                    this.data = data.json();
                }, 1000);
            });
            console.log('i am here');
            console.log(this.data);
    }
*/
    private sortByWordLength = (a:any) => {
        return a.name.length;
    }
    
    public removeItem(item: any) {
      //this.data = _.filter(this.data, (elem)=>elem!=item);
      //console.log("Remove: ", item.email);
    }

}