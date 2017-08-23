export interface Limit {
    start: Date;
    limit: number;
}

export interface Exposure {
    start: Date;
    exposure: number;
}
/*
export class CpLimitsAndExposures {
    id: number;
    limits: number[]= new Array();
    exposures: any[]= new Array();
    exposureDates: any[]= new Array();
}
*/
export interface CpLimitAndExposure{
    exposureDate: Date;
    limit: number;
    currentExposure: number;
}
