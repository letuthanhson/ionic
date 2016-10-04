export interface Limit {
    start: Date;
    limit: number;
}

export interface Exposure {
    start: Date;
    exposure: number;
}

export interface CpLimitsAndExposures {
    id: number;
    limits: Limit[];
    exposures: Exposure[];
}
