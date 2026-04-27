import { useEffect, useRef, useState } from "react";
import type { Job } from "../types/job.ts";
import { mapApiResponseToJobs } from "../lib/jobMapper.ts";
import supabase from "@/lib/supabase.ts";

const API_BASE_URL = "http://127.0.0.1:8000";
const DEBOUNCE_MS = 500;

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Please sign in first.");
  }

  return { Authorization: `Bearer ${token}` };
}

export const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [locationTerm, setLocationTerm] = useState("");
    const [preferredTitle, setPreferredTitle] = useState("");
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchJobs = async (title: string, location: string) => {
        const safeTitle = title.trim() || preferredTitle || "jobs";
        const safeLocation = location.trim();

        if (!safeLocation) {
            setJobs([]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const authHeaders = await getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/jobs/search`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                ...authHeaders },
                body: JSON.stringify({
                    title: safeTitle,
                    location: safeLocation,
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Failed to fetch jobs (${response.status}): ${errText}`);
            }

            const data = await response.json();
            setJobs(mapApiResponseToJobs(data.jobs));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setError(`Error fetching jobs: ${message}`);
            console.error("Error fetching jobs:", err);
        } finally {
            setLoading(false);
        }
    };
useEffect(() => {
  const loadPreferredTitle = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("preferences")
      .select("job_titles")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading preferred title:", error.message);
      return;
    }

    if (data?.job_titles?.length) {
      setPreferredTitle(data.job_titles[0]);
    }
  };

  loadPreferredTitle();
}, []);
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