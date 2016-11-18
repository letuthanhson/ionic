export class InstaRequest{
    source: string;
    route: string;
    userId:string;
    jsonRequest: string;

    constructor(route: string, userId: string, jsonRequest: string){
        this.source = "InstaCredit";
        this.route = route;
        this.userId = userId;
        this.jsonRequest = jsonRequest;
    }
}