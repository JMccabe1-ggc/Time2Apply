import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import Jobcard from "../components/Jobcard";

type SavedJob = {
  id: string;
  job_id: string | null;
  title: string | null;
  company: string | null;
  location: string | null;
  pay_text: string | null;
  posted_date: string | null;
  apply_url: string | null;
  job_type: string | null;
  job_site: string | null;
  application_type: string | null;
  status: string | null;
  notes: string | null;
  created_at: string | null;
};

const SavedJobsTab = () => {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("saved_jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading saved jobs:", error.message);
    } else if (data) {
      setJobs(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleOpenJob = (url: string | null) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleUnsave = async (savedId: string) => {
    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("id", savedId);

    if (error) {
      console.error("Error unsaving job:", error.message);
      alert(error.message);
      return;
    }

    fetchSavedJobs();
  };

  const handleMarkApplied = async (savedId: string) => {
    const { error } = await supabase
      .from("saved_jobs")
      .update({ status: "applied" })
      .eq("id", savedId);

    if (error) {
      console.error("Error updating status:", error.message);
      alert(error.message);
      return;
    }

    fetchSavedJobs();
  };

  return (
    <>
      <h1>Saved Jobs</h1>

      {loading && <p>Loading saved jobs...</p>}

      {!loading && jobs.length === 0 && <p>No saved jobs yet.</p>}

    {jobs.map((job) => (
  <Jobcard
    key={job.id}
    id={0}
    jobTitle={job.title ?? "Untitled Job"}
    companyName={job.company ?? "Unknown Company"}
    location={job.location ?? "Unknown Location"}
    jobType={job.job_type ?? undefined}
    jobSite={job.job_site ?? "Unknown Site"}
    applicationTypes={job.application_type ?? "Unknown Apply Type"}
    payText={job.pay_text ?? "Pay not listed"}
    applied={job.status === "applied"}
    jobPostedDate={job.posted_date ?? ""}
    applyUrl={job.apply_url ?? undefined}
    onSelect={() => {}}
    onSave={() => handleUnsave(job.id)}
    isSaved={true}
  />
))}
    </>
  );
};

export default SavedJobsTab;