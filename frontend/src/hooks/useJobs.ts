import { useEffect, useRef, useState } from "react";
import type { Job } from "../types/job.ts";
import { mapApiResponseToJobs } from "../lib/jobMapper.ts";

const API_BASE_URL = "http://127.0.0.1:8000";
const DEBOUNCE_MS = 500;

export const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [locationTerm, setLocationTerm] = useState("");
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchJobs = async (title: string, location: string) => {
        if (!title.trim() || !location.trim()) {
            setJobs([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    location: location.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch jobs: ${response.status}`);
            }

            const data = await response.json();
            setJobs(mapApiResponseToJobs(data.jobs));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setError(message);
            console.error("Error fetching jobs:", err);
        } finally {
            setLoading(false);
        }
    };

        // Auto-fetch when searchTerm or locationTerm changes
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            fetchJobs(searchTerm, locationTerm);
        }, DEBOUNCE_MS);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchTerm, locationTerm]);

    return {
        jobs,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        locationTerm,
        setLocationTerm,
        fetchJobs,
    };
};