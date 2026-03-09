import type { Job } from "../types/job.ts";

export const mapApiResponseToJobs = (apiJobs: any[]): Job[] => {
    return apiJobs.map((job: any, index: number) => ({
        id: index,
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        jobType: job.job_type || "",
        jobSite: "JSearch",
        applicationType: "External Apply",
        pay: job.salary_min && job.salary_max
            ? { min: job.salary_min, max: job.salary_max, currency: "USD" }
            : undefined,
        applied: false,
        datePosted: job.posted_date || "",
        applyUrl: job.apply_url || "",
        description: job.description || "",
    }));
};