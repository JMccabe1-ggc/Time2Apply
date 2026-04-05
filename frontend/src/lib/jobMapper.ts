import type { Job, PayPeriod } from "../types/job.ts";

const normalizePayPeriod = (period: unknown): PayPeriod => {
    if (typeof period !== "string") {
        return "unknown";
    }

    const normalized = period.trim().toLowerCase();

    if (normalized === "hour" || normalized === "hourly") return "hour";
    if (normalized === "week" || normalized === "weekly") return "week";
    if (normalized === "month" || normalized === "monthly") return "month";
    if (normalized === "year" || normalized === "yearly" || normalized === "annual" || normalized === "annually") return "year";

    return "unknown";
};

export const mapApiResponseToJobs = (apiJobs: any[]): Job[] => {
    return apiJobs.map((job: any, index: number) => ({
        // Cached rows and fresh API payloads can place salary period in different fields.
        // Prefer explicit top-level values, then fall back to raw payload values.
        id: index,
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        jobType: job.job_type || "",
        // Backend returns publisher for source site; keep job_site as fallback.
        jobSite: job.publisher || "",
        applicationType: "External Apply",
        pay: job.salary_min != null && job.salary_max != null
            ? {
                min: Number(job.salary_min),
                max: Number(job.salary_max),
                currency: "USD",
                period: normalizePayPeriod(
                    job.salary_period
                    ?? job.job_salary_period
                    ?? job.raw_data?.job_salary_period
                    ?? job.raw_data?.raw_data?.job_salary_period
                )
            }
            : undefined,
        applied: false,
        datePosted: job.posted_date || "",
        applyUrl: job.apply_url || "",
        description: job.description || "",
        publisher: job.publisher || "Unknown Publisher"
    }));
};