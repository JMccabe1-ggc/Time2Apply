import { useState } from "react";
import type { Job } from "../types/job.ts";

const toAnnualPayRange = (pay: Job["pay"]): { min: number; max: number } | null => {
    if (!pay) return null;

    let multiplier: number | null = null;

    if (pay.period === "hour") multiplier = 2080;
    if (pay.period === "week") multiplier = 52;
    if (pay.period === "month") multiplier = 12;
    if (pay.period === "year") multiplier = 1;

    if (multiplier == null) return null;

    const annualMin = pay.min * multiplier;
    const annualMax = pay.max * multiplier;

    return {
        min: Math.min(annualMin, annualMax),
        max: Math.max(annualMin, annualMax),
    };
};

export const useJobFilters = () => {
    const [hasPayListed, setHasPayListed] = useState(false);

    const [jobType, setJobType] = useState({
        fullTime: true,
        partTime: true,
        contract: true,
        internship: true,
    });

    const [jobSite, setJobSite] = useState({
        linkedIn: true,
        indeed: true,
        handshake: true,
        monster: true,
        zipRecruiter: true,
        other: true,
    });

    const [applicationType, setApplicationType] = useState({
        easyApply: true,
        externalApply: true,
        questionnaire: true,
    });

    const [minSalary, setMinSalary] = useState(0);
    const [maxSalary, setMaxSalary] = useState(200000);
    const [filterTerm, setFilterTerm] = useState("");
    const [filterLocation, setFilterLocation] = useState("");

    const applyFilters = (jobs: Job[]): Job[] => {
        const term = filterTerm.toLowerCase();
        const locationTermLower = filterLocation.toLowerCase();

        return jobs.filter((job) => {
            if (job.jobType === "Full-time" && !jobType.fullTime) return false;
            if (job.jobType === "Part-time" && !jobType.partTime) return false;
            if (job.jobType === "Contractor" && !jobType.contract) return false;
            if (job.jobType === "Internship" && !jobType.internship) return false;

            const normalizedJobSite = job.jobSite?.toLowerCase();
            const knownSites = ["linkedin", "indeed", "handshake", "monster", "ziprecruiter"];
            const isOther = !knownSites.includes(normalizedJobSite);
            if (normalizedJobSite === "linkedin" && !jobSite.linkedIn) return false;
            if (normalizedJobSite === "indeed" && !jobSite.indeed) return false;
            if (normalizedJobSite === "handshake" && !jobSite.handshake) return false;
            if (normalizedJobSite === "monster" && !jobSite.monster) return false;
            if (normalizedJobSite === "ziprecruiter" && !jobSite.zipRecruiter) return false;
            if (isOther && !jobSite.other) return false;

            if (job.applicationType === "Easy Apply" && !applicationType.easyApply) return false;
            if (job.applicationType === "External Apply" && !applicationType.externalApply) return false;
            if (job.applicationType === "Questionnaire" && !applicationType.questionnaire) return false;

            const annualPay = toAnnualPayRange(job.pay);
            if (annualPay && (annualPay.max < minSalary || annualPay.min > maxSalary)) return false;

            if (hasPayListed && job.pay == null) return false;

            if (term) {
                const titleMatch = job.title?.toLowerCase().includes(term);
                const companyMatch = job.company?.toLowerCase().includes(term);
                const locationMatch = job.location?.toLowerCase().includes(term);
                const jobTypeMatch = job.jobType?.toLowerCase().includes(term);
                const jobSiteMatch = job.jobSite?.toLowerCase().includes(term);
                const applicationTypeMatch = job.applicationType?.toLowerCase().includes(term);
                if (!titleMatch && !companyMatch && !locationMatch && !jobTypeMatch && !jobSiteMatch && !applicationTypeMatch) {
                    return false;
                }
            }

            if (locationTermLower) {
                if (!job.location?.toLowerCase().includes(locationTermLower)) return false;
            }

            return true;
        });
    };

    return {
        jobType,
        setJobType,
        jobSite,
        setJobSite,
        applicationType,
        setApplicationType,
        minSalary,
        setMinSalary,
        maxSalary,
        setMaxSalary,
        hasPayListed,
        setHasPayListed,
        filterTerm,
        setFilterTerm,
        filterLocation,
        setFilterLocation,
        applyFilters,
    };
};