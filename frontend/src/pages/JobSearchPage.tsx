import {useEffect, useState } from "react";
import Header from "../components/Header.tsx";
import Jobcard from "../components/Jobcard.tsx";
import { useJobs } from "../hooks/useJobs.ts";
import { useJobFilters } from "../hooks/useJobFilters.ts";
import "../components/ui/JobSearchPage.css";
import { Slider } from "../components/ui/slider.tsx";
import supabase from "@/lib/supabase";

const JobSearchPage = () => {
  const {
    jobs,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    locationTerm,
    setLocationTerm,
    fetchJobs,
  } = useJobs();

  const {
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
    applyFilters,
  } = useJobFilters();

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]); 
  const filteredJobs = applyFilters(jobs);
const fetchSavedJobs = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;

  if (!user) return;

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching saved jobs:", error.message);
    return;
  }

  if (data) {
    setSavedJobIds(data.map((item) => String(item.job_id)));
  }
};
useEffect(() => {
  fetchSavedJobs();
}, []);

const handleSaveJob = async (job: any) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;
  console.log("REAL JOB:", job);

  if (!user) {
    alert("Please log in first");
    return;
  }

const jobId = String(job.applyUrl);
const alreadySaved = savedJobIds.includes(jobId);

  if (alreadySaved) {
    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", user.id)
      .eq("job_id", jobId);

    if (error) {
      console.error("Delete error:", error.message);
      alert(error.message);
      return;
    }

    setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
    return;
  }
const formattedPay = job.pay
  ? `${job.pay.currency} ${job.pay.min.toLocaleString()} - ${job.pay.max.toLocaleString()}`
  : "Pay not listed";
const { error } = await supabase.from("saved_jobs").insert({
  user_id: user.id,
  job_id: jobId,
  title: job.title,
  company: job.company,
  location: job.location,
  pay_text: formattedPay,
  posted_date: job.datePosted,
  apply_url: job.applyUrl,
  job_type: job.jobType,
  job_site: job.jobSite,
  application_type: job.applicationType,
  status: "saved",
});

  if (error) {
    console.error("Insert error:", error.message);
    alert(error.message);
    return;
  }

  setSavedJobIds((prev) => [...prev, jobId]);
};
  return (
    <div className="user-page">
      <Header />
      <div className="user-layout">
        <aside className="user-aside">
          <div>
            <h2>Filters</h2>
            <h4>Search</h4>
            <label htmlFor="search">Job Title, Company, Keywords</label>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="e.g. Software Engineer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
            <br />
            <label htmlFor="">Job Type</label>
            <input
              type="checkbox"
              name="fullTime"
              id="fullTime"
              checked={jobType.fullTime}
              onChange={(e) =>
                setJobType({ ...jobType, fullTime: e.target.checked })
              }
            />{" "}
            Full Time
            <br />
            <input
              type="checkbox"
              name="partTime"
              id="partTime"
              checked={jobType.partTime}
              onChange={(e) =>
                setJobType({ ...jobType, partTime: e.target.checked })
              }
            />
            Part Time
            <br />
            <input
              type="checkbox"
              name="contract"
              id="contract"
              checked={jobType.contract}
              onChange={(e) =>
                setJobType({ ...jobType, contract: e.target.checked })
              }
            />
            Contract
            <br />
            <input
              type="checkbox"
              name="internship"
              id="internship"
              checked={jobType.internship}
              onChange={(e) =>
                setJobType({ ...jobType, internship: e.target.checked })
              }
            />
            Internship
            <br />
            <hr />
            <label htmlFor="">Job Site</label>
            <input
              type="checkbox"
              name="linkedIn"
              id="linkedIn"
              checked={jobSite.linkedIn}
              onChange={(e) =>
                setJobSite({ ...jobSite, linkedIn: e.target.checked })
              }
            />
            LinkedIn
            <br />
            <input
              type="checkbox"
              name="indeed"
              id="indeed"
              checked={jobSite.indeed}
              onChange={(e) =>
                setJobSite({ ...jobSite, indeed: e.target.checked })
              }
            />
            Indeed
            <br />
            <input
              type="checkbox"
              name="handshake"
              id="handshake"
              checked={jobSite.handshake}
              onChange={(e) =>
                setJobSite({ ...jobSite, handshake: e.target.checked })
              }
            />
            Handshake
            <br />
            <input
              type="checkbox"
              name="monster"
              id="monster"
              checked={jobSite.monster}
              onChange={(e) =>
                setJobSite({ ...jobSite, monster: e.target.checked })
              }
            />
            Monster
            <br />
            <hr />
            <label htmlFor="">Application Type</label>
            <input
              type="checkbox"
              name="easyApply"
              id="easyApply"
              checked={applicationType.easyApply}
              onChange={(e) =>
                setApplicationType({
                  ...applicationType,
                  easyApply: e.target.checked,
                })
              }
            />
            Easy Apply
            <br />
            <input
              type="checkbox"
              name="externalApply"
              id="externalApply"
              checked={applicationType.externalApply}
              onChange={(e) =>
                setApplicationType({
                  ...applicationType,
                  externalApply: e.target.checked,
                })
              }
            />
            External Apply
            <br />
            <input
              type="checkbox"
              name="questionaire"
              id="questionaire"
              checked={applicationType.questionnaire}
              onChange={(e) =>
                setApplicationType({
                  ...applicationType,
                  questionnaire: e.target.checked,
                })
              }
            />
            Questionnaire
            <br />
            <hr />
            <label htmlFor="">Salary Range</label>
            <div>

              {/* Salary Range */}
              <Slider
                defaultValue={[minSalary, maxSalary]}
                min={0}
                max={200000}
                step={1000}
                value={[minSalary, maxSalary]}
                onValueChange={(values: number[]) => {
                    setMinSalary(values[0]);
                    setMaxSalary(values[1]);
                }}
              />
              {/* Min Slider */}
              {/* <input
                type="range"
                min={0}
                max={200000}
                step={1000}
                value={minSalary}
                onChange={(e) =>
                  setMinSalary(
                    Math.min(Number(e.target.value), maxSalary - 1000),
                  )
                }
              /> */}

              {/* Max Slider */}
              {/* <input
                type="range"
                min={0}
                max={200000}
                step={1000}
                value={maxSalary}
                onChange={(e) =>
                  setMaxSalary(
                    Math.max(Number(e.target.value), minSalary + 1000),
                  )
                }
              /> */}
            </div>
            <label htmlFor="salaryRange">{`$${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}`}</label>
          </div>
        </aside>

        {error && <p className="error-message">Error: {error}</p>}

        <main className="user-main">
          <h2>Results</h2>
          {loading && <p>Loading jobs...</p>}
          {!loading && filteredJobs.length === 0 && <p>No jobs found.</p>}
          {filteredJobs.map((job) => (
            <Jobcard
              key={job.id}
              id={job.id}
              jobTitle={job.title}
              companyName={job.company}
              location={job.location}
              jobType={job.jobType}
              jobSite={job.jobSite}
              applicationTypes={job.applicationType}
              pay={job.pay}
              applied={job.applied}
              jobPostedDate={job.datePosted}
              description={job.description}
              applyUrl={job.applyUrl}
              onSelect={(id) => setSelectedJobId(id)}
              onSave={() => handleSaveJob(job)}
              isSaved={savedJobIds.includes(String(job.applyUrl))}
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default JobSearchPage;
