export type PayPeriod = "hour" | "week" | "month" | "year" | "unknown";

export interface Pay {
    min: number;
    max: number;
    currency: string;
    period: PayPeriod;
}

export interface MatchData {
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
}

export type GhostRiskLevel = "low" | "moderate" | "high" | "very_high";

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
    match?: MatchData;
    ghostRiskScore?: number;
    ghostRiskLevel?: GhostRiskLevel;
    ghostFlags?: string[];
}

export interface SearchParams {
    title: string;
    location: string;
}