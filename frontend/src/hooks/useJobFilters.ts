import { useState } from "react";
import type { Job } from "../types/job.ts";

export const useJobFilters = () => {
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
            if (job.jobType === "Contract" && !jobType.contract) return false;
            if (job.jobType === "Internship" && !jobType.internship) return false;

            if (job.jobSite === "LinkedIn" && !jobSite.linkedIn) return false;
            if (job.jobSite === "Indeed" && !jobSite.indeed) return false;
            if (job.jobSite === "Handshake" && !jobSite.handshake) return false;
            if (job.jobSite === "Monster" && !jobSite.monster) return false;

            if (job.applicationType === "Easy Apply" && !applicationType.easyApply) return false;
            if (job.applicationType === "External Apply" && !applicationType.externalApply) return false;
            if (job.applicationType === "Questionnaire" && !applicationType.questionnaire) return false;

            if (job.pay && (job.pay.max < minSalary || job.pay.min > maxSalary)) return false;

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
        filterTerm,
        setFilterTerm,
        filterLocation,
        setFilterLocation,
        applyFilters,
    };
};