export type PayPeriod = "hour" | "week" | "month" | "year" | "unknown";

export interface Pay {
    min: number;
    max: number;
    currency: string;
    period: PayPeriod;
}

export interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
    jobSite: string;
    applicationType: string;
    pay?: Pay;
    applied: boolean;
    datePosted: string;
    applyUrl: string;
    description: string;
    publisher: string;
}

export interface SearchParams {
    title: string;
    location: string;
}