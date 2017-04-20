import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { InstaRequest } from '../models/insta-request';
import { LogonUser } from '../models/logon-user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeout';

@Injectable()
export class InstaService{

    _url: string;
    userid: string;
    password: string;
    static APP_CONFIG = 'appconfig/appconfig.json'
    static XML_ESCAPE_MAP = { '&': '&amp;',
                            '"': '&quot;',
                            "'": '&apos;',
                            '<': '&lt;',
                            '>': '&gt;'
                            };
    constructor(private http: Http){
        // get base url
        /*
        http.get(InstaService.APP_CONFIG)
          .map(res => res.json())
          .subscribe(
            data => {
                console.log("Done getting appconfig...");
                this._url = data.serviceBaseUrl;
                console.log("baseUrl: " + this._url);
            },
            error=>{
                console.log("Can't load '" + InstaService.APP_CONFIG + JSON.stringify(error));
            });
            */
    }
    getAppConfig(): Observable<any>{
        return this.http.get(InstaService.APP_CONFIG)
            .map(res => res.json())
            .catch(this.handleError);      
    }
    getRankedCounterpartiesByNameQuery(nameQuery: string): Observable<any> {
        let jsonReq = '{ "nameQuery":"' + nameQuery + '"}';
        console.log("Getting a ranked cp - userid:json " + this.userid + ":" + jsonReq);
        let req: InstaRequest = new InstaRequest('get/rankedcounterparty/query',
                                    this.userid,
                                    jsonReq);
        return this.getData(req);
    }
    getRankedCounterparties(): Observable<any> {
        console.log("Getting ranked cp - userid: " + this.userid);
        let req: InstaRequest = new InstaRequest('get/rankedcounterparty',
                                    this.userid,
                                    "{}");
        return this.getData(req);
    }
    getCounterpartyDetail(id: number): Observable<any> {

        let jsonReq = '{ "id":' + id + '}';
        console.log("Getting cp - id:userid:json " + id + ":" + this.userid + ":" + jsonReq);

        let req: InstaRequest = new InstaRequest('get/counterparty',
                                    this.userid,
                                    jsonReq);
        return this.getData(req);
    }
    //mock
    MOCK_getCounterpartyCurrentLimitsAndExposures(counterpartyName: string): Observable<any> {

        return this.http.get('mock/exposure.json')
            .map(res => res.json())
            .catch(this.handleError);
    }
    getCounterpartyCurrentLimitsAndExposures(counterpartyName: string): Observable<any> {

        let jsonReq = '{ "counterpartyName": "' + counterpartyName + '" }';
        console.log("Getting cp/currentexposure - name:userid:json " + counterpartyName + ":" + this.userid + ":" + jsonReq);

        let req: InstaRequest = new InstaRequest('get/counterparty/currentexposure',
                                    this.userid,
                                    jsonReq);
        return this.getData(req);
    }

    getCounterpartyForwardLimitsAndExposures(counterpartyId: number): Observable<any> {

        let jsonReq = '{ "id": "' + counterpartyId + '" }';

        let req: InstaRequest = new InstaRequest('get/counterparty/forwardexposure',
                                    this.userid,
                                    jsonReq);
        return this.getData(req).catch(err => {
            // at this moment swallow error from server and return empty array
            return Observable.of([]);
        });
    }
    
    // mock
    MOCK_getCounterpartyCaFiles(id: number): Observable<any> {
        return this.http.get('mock/cafiles.json')
            .map(res => res.json())
            .catch(this.handleError);
    }
    getCounterpartyCaFiles(id: number): Observable<any> {
        let jsonReq = '{ "id":' + id + '}';
        console.log("Getting cp ca folder - id:userid:json " + id + ":" + this.userid + ":" + jsonReq);

        let req: InstaRequest = new InstaRequest('get/counterparty/spfiles',
                                    this.userid,
                                    jsonReq);
        return this.getData(req); 
    }
    //mock method
    MOCK_getCounterpartyCaFileBase64(url: string): Observable<any>  {
        return this.http.get('mock/file64.json')
            .map(res => res.json())
            .catch(this.handleError);
    }
    getCounterpartyCaFileBase64(url: string): Observable<any>  {
        let jsonReq = '{ "fileUrl":"' + url + '"}';
        console.log("Getting a cafile - userid:json " + this.userid + ":" + jsonReq);

        let req: InstaRequest = new InstaRequest('get/fileasbase64',
                                    this.userid,
                                    jsonReq);
        return this.getData(req); 
    }

    //mock method
    MOCK_getExposuresAndLimitsGroupByRatingBand(): Observable<any>  {
        return this.http.get('mock/exp_and_el_by_ratingband.json')
            .map(res => res.json())
            .catch(this.handleError);
    }
    getExposuresAndLimitsGroupByRatingBand(): Observable<any>  {
    
        console.log("Getting rating band exposures: " + this.userid);
        let req: InstaRequest = new InstaRequest('get/currentRatingBandExposureAndExpectedLoss',
                                    this.userid,
                                    "{}");
        return this.getData(req);
    }
    //mock method
    MOCK_getExposuresAndLimitsGroupByTeam(): Observable<any>  {
        return this.http.get('mock/exp_and_el_by_team.json')
            .map(res => res.json())
            .catch(this.handleError);
    }
    getExposuresAndLimitsGroupByTeam(): Observable<any>  {

        console.log("Getting team exposures - userid: " + this.userid);
        let req: InstaRequest = new InstaRequest('get/currentTeamExposureAndExpectedLoss',
                                    this.userid,
                                    "{}");
        return this.getData(req);
    }
    getHistoricalExposuresAndExpectedLosses(): Observable<any>  {

        console.log("Getting team exposures - userid: " + this.userid);
        let req: InstaRequest = new InstaRequest('get/historicExposureGroupByDate',
                                    this.userid,
                                    "{}");
        return this.getData(req);
    }
    getTopCounterpartyExposures(): Observable<any>  {

        console.log("Getting team exposures - userid: " + this.userid);
        let req: InstaRequest = new InstaRequest('get/topCounterpartyExposureAndExpectedLoss',
                                    this.userid,
                                    "{}");
        return this.getData(req);
    }
    // set user credential for url
    setServiceCredential(url: string, userid: string, password: string): void {
        this._url = url;
        this.userid = userid;
        this.password = password;
        console.log("Credential: " + this._url + ":" + this.userid);
    }
    // authenticate a user.  This has been call from 
    authenticate() {
        let jsonReq = '{}';
       
        let req: InstaRequest = new InstaRequest('get/logon',
                                    this.userid,
                                    jsonReq);
        return this.getData(req);
        /*

        console.log("authenticate()... user" + this.userid);
        let soapRequest = '';
        let headers = this.createHeaders();
      
        return this.http.post(this._url, soapRequest, {
            headers: headers
        }).map((resp)=> {
            // store for next time use
            console.log("Logging in succesfully...")
            return resp;
        })
        .catch(this.handleError);
        */
    }
    private static encodeXml(value: string) {
        return value.replace(/([\&"'<>])/g, function(str, item) {
            return InstaService.XML_ESCAPE_MAP[item];
        });
    };
    private createSoapRequest(request: InstaRequest): string{
        return    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:onec="http://onecreditportal.am.ist.bp.com">
                        <soapenv:Header/>
                        <soapenv:Body>
                            <onec:InstaCreditRequest>
                                <onec:request>
                                    <onec:Route>${request.route}</onec:Route>
                                    <onec:UserId>${request.userId}</onec:UserId>
                                    <onec:JsonRequest>${InstaService.encodeXml(request.jsonRequest)}</onec:JsonRequest>
                                </onec:request>
                            </onec:InstaCreditRequest>
                        </soapenv:Body>
                        </soapenv:Envelope>`;
    }

    private createHeaders(): Headers{

        let headers = new Headers();
        // passing your password
        headers.append('Content-Type', 'application/soap+xml; charset=UTF-8');
        headers.append('Authorization', 'Basic '+ btoa(this.userid + ':' + this.password));

        return headers;
    }

    private getData(instaRequest: InstaRequest): Observable<any>
    { 
        console.log("getData()... user" + this.userid);
        let soapRequest = this.createSoapRequest(instaRequest);
      
        let headers = this.createHeaders();
      
        console.log("url: " + this._url);
        return this.http.post(this._url, soapRequest, {
                headers: headers
            })
            .map((resp:Response)=> {
                console.log("getData(): map.....: " + instaRequest.route + "...");
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(resp.text(), "text/xml");
                let jsonString = xmlDoc.getElementsByTagName("JsonResponse")[0].childNodes[0].nodeValue;
                
                return JSON.parse(jsonString);
        })
        .catch(this.handleError);
    }
    private handleError(error: any): any{
        if(error instanceof Response){
            console.log("Ws Error: " + JSON.stringify(error));
            return Observable.throw(error.json().error || 'Backend server error');
        }
        else{
            console.log("Ws Error: (non-respose)" + JSON.stringify(error));
            return Observable.throw("Ws Error: (non-respose)" + JSON.stringify(error) || 'Backend server error');
        }
    }
}
 