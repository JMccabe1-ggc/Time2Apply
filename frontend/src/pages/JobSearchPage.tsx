import { useEffect, useMemo, useState } from "react";
import { State, City, type ICity, type IState } from "country-state-city";
import Header from "../components/Header.tsx";
import Jobcard from "../components/Jobcard.tsx";
import { useJobs } from "../hooks/useJobs.ts";
import { useJobFilters } from "../hooks/useJobFilters.ts";
import "../components/ui/JobSearchPage.css";
import { Slider } from "../components/ui/slider.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import {
  Search,
  MapPin,
  Briefcase
} from "lucide-react";
import supabase from "@/lib/supabase";
import { JobDetailPanel } from "./JobDetailPanel.tsx";
import { Card } from "@/components/ui/card.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

const JobSearchPage = () => {
  const [salarySort, setSalarySort] = useState<"default" | "salary-desc" | "salary-asc">("default");
  const [postedDateSort, setPostedDateSort] = useState<"default" | "date-desc" | "date-asc">("default");
  const [matchScoreSort, setMatchScoreSort] = useState<"default" | "score-desc" | "score-asc">("default");
  const states: IState[] = State.getStatesOfCountry("US");

  const [selectedState, setSelectedState] = useState<string>("");
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);

    if (stateCode) {
      const stateCities: ICity[] = City.getCitiesOfState("US", stateCode);
      setCities(stateCities);
    } else {
      setCities([]);
      setSelectedCity("");
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
  };

  const {
    jobs,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    locationTerm,
    setLocationTerm,
  } = useJobs();

  const [searchInput, setSearchInput] = useState<string>(searchTerm);

  const handleLocationSearch = () => {
    setSearchTerm(searchInput);

    if (!selectedState) {
      setLocationTerm("");
      return;
    }

    const stateName = states.find((state) => state.isoCode === selectedState)?.name ?? "";
    const locationQuery = selectedCity ? `${selectedCity}, ${stateName}` : stateName;
    setLocationTerm(locationQuery);
  };

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
    hasPayListed,
    setHasPayListed,
    applyFilters,
  } = useJobFilters();

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const filteredJobs = applyFilters(jobs);

  const sortedJobs = useMemo(() => {
    const getAnnualSalary = (job: (typeof jobs)[number]): number | null => {
      if (!job.pay) return null;

      const multipliers: Record<string, number> = {
        hour: 2080,
        week: 52,
        month: 12,
        year: 1,
      };

      const multiplier = multipliers[job.pay.period] ?? null;
      if (multiplier == null) return null;

      return Math.max(job.pay.min, job.pay.max) * multiplier;
    };

    const getTimestamp = (job: (typeof jobs)[number]): number => {
      const parsed = Date.parse(job.datePosted);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const getMatchScore = (job: (typeof jobs)[number]): number => {
      const value = (job as { matchScore?: number; score?: number }).matchScore ?? (job as { score?: number }).score;
      return typeof value === "number" ? value : 0;
    };

    const sorted = [...filteredJobs];

    sorted.sort((a, b) => {
      if (salarySort !== "default") {
        const aSalary = getAnnualSalary(a) ?? Number.NEGATIVE_INFINITY;
        const bSalary = getAnnualSalary(b) ?? Number.NEGATIVE_INFINITY;
        if (aSalary !== bSalary) {
          return salarySort === "salary-desc" ? bSalary - aSalary : aSalary - bSalary;
        }
      }

      if (postedDateSort !== "default") {
        const aDate = getTimestamp(a);
        const bDate = getTimestamp(b);
        if (aDate !== bDate) {
          return postedDateSort === "date-desc" ? bDate - aDate : aDate - bDate;
        }
      }

      if (matchScoreSort !== "default") {
        const aScore = getMatchScore(a);
        const bScore = getMatchScore(b);
        if (aScore !== bScore) {
          return matchScoreSort === "score-desc" ? bScore - aScore : aScore - bScore;
        }
      }

      return 0;
    });

    return sorted;
  }, [filteredJobs, jobs, salarySort, postedDateSort, matchScoreSort]);

  const selectedJob = sortedJobs.find((j) => j.id === selectedJobId) ?? null;
  const fetchSavedJobs = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) return;


  const { data, error } = await supabase
    .from("saved_jobs")
    .select("job_id, status")
    .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching saved jobs:", error.message);
      return;
    }

  if (data) {
    setSavedJobIds(data.map((item) => String(item.job_id)));
    setAppliedJobIds(
      data
        .filter((item) => item.status === "applied")
        .map((item) => String(item.job_id)),
    );
  }
};
    useEffect(() => {
      const loadPageData = async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;

        if (!user) return;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("user_id, email, location")
          .eq("user_id", user.id)
          .maybeSingle();

        console.log("LOAD USER ID:", user.id);
        console.log("PROFILE DATA:", profileData);
        console.log("PROFILE ERROR:", profileError);

        if (profileError) {
          console.error("Error loading location:", profileError.message);
        } else if (profileData?.location) {
          setLocationTerm(profileData.location);
        }

        const { data, error } = await supabase
          .from("saved_jobs")
          .select("job_id, status")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching saved jobs:", error.message);
          return;
        }

        if (data) {
          setSavedJobIds(data.map((item) => String(item.job_id)));
          setAppliedJobIds(
            data
              .filter((item) => item.status === "applied")
              .map((item) => String(item.job_id)),
          );
        }
      };

      loadPageData();
    }, [setLocationTerm]);
useEffect(() => {
  if (loading) return;

  if (filteredJobs.length === 0) {
    setSelectedJobId(null);
    return;
  }

  const selectedStillExists = filteredJobs.some((job) => job.id === selectedJobId);

  if (selectedJobId === null || !selectedStillExists) {
    setSelectedJobId(filteredJobs[0].id);
  }

  fetchSavedJobs();
}, [loading, filteredJobs, selectedJobId]);

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
    setAppliedJobIds((prev) => prev.filter((id) => id !== jobId));
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
  publisher:job.publisher,
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

const handleMarkApplied = async (job: any, nextApplied: boolean) => {
  const jobId = String(job.applyUrl);

  setAppliedJobIds((prev) => 
    nextApplied 
      ? prev.includes(jobId) 
      ? prev 
      : [...prev, jobId] 
      : prev.filter((id) => id !== jobId));

  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;

  if (!user) {
    return;
  }

    if (!savedJobIds.includes(jobId)) {
    const formattedPay = job.pay
      ? `${job.pay.currency} ${job.pay.min.toLocaleString()} - ${job.pay.max.toLocaleString()}`
      : "Pay not listed";

    const { error: insertError } = await supabase.from("saved_jobs").insert({
      user_id: user.id,
      job_id: jobId,
      title: job.title,
      company: job.company,
      publisher: job.publisher,
      location: job.location,
      pay_text: formattedPay,
      posted_date: job.datePosted,
      apply_url: job.applyUrl,
      job_type: job.jobType,
      job_site: job.jobSite,
      application_type: job.applicationType,
      status: nextApplied ? "applied" : "saved",
    });

    if (insertError) {
      console.error("Insert error:", insertError.message);
      alert(insertError.message);
      return;
    }

    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev : [...prev, jobId]
    );
    return;
  }

    const { error } = await supabase
      .from("saved_jobs")
      .update({ status: nextApplied ? "applied" : "saved"})
      .eq("user_id", user.id)
      .eq("job_id", jobId);

    if (error) {
      console.error("Update error:", error.message);
      alert(error.message);
      return;
    }
};

  return (
    <div className="user-page">
      <Header />
      <div className="user-layout">
        <Card className="user-aside">
          <div className="sidenav">
            <div className="filters-header">
              <div>
                <h2>Filters</h2>
              </div>
            </div>
            <ScrollArea className="filters-scroll">
            <Accordion
              type="multiple"
              defaultValue={[
                "search",
                "salary",
                "jobType",
                "jobSite",
                "applicationType",
              ]}
            >
              <AccordionItem value="search">
                <AccordionTrigger>Search</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <label
                      htmlFor="search"
                      className="text-xs text-muted-foreground"
                    >
                      Job Title or Keywords
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="search"
                        placeholder="e.g. Software Engineer"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="searchbox pl-9 h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="location"
                      className="text-xs text-muted-foreground"
                    >
                      Location
                    </label>
                    <div className="location-filter">
                      <div className="location-filter__state-wrap">
                        <MapPin className="location-filter__icon h-4 w-4" />
                        <select
                        name="state"
                        id="state"
                        value={selectedState}
                        onChange={handleStateChange}
                        className="location-filter__select location-filter__select--state"
                        >
                          <option value="">Select a state</option>
                          {states.map((state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                        <select
                          name="city"
                          id="city"
                          value={selectedCity}
                          onChange={handleCityChange}
                          className="location-filter__select"
                          disabled={!selectedState}
                        >
                          <option value="">{selectedState ? "Select a city" : "Select a state first"}</option>
                          {cities.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      <button
                        type="button"
                        className="location-filter__search-btn"
                        onClick={handleLocationSearch}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="salary">
                <AccordionTrigger>Salary Range</AccordionTrigger>
                <AccordionContent>
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
                  <label htmlFor="salaryRange">Salary: {`$${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}`}</label>
                  <label htmlFor="salary2Hourly">Hourly: {`$${(minSalary / 2080).toFixed(2)}`}-${(maxSalary / 2080).toFixed(2)}</label>
                  <label htmlFor="listedPayOnly">
                    <input
                      type="checkbox"
                      id="listedPayOnly"
                      checked={hasPayListed}
                      onChange={(e) => setHasPayListed(e.target.checked)}
                    />
                    Show jobs with listed pay only
                  </label>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="jobType">
                <AccordionTrigger>Job Type</AccordionTrigger>
                <AccordionContent>
                  <input
                    type="checkbox"
                    name="fullTime"
                    id="fullTime"
                    checked={jobType.fullTime}
                    onChange={(e) =>
                      setJobType({ ...jobType, fullTime: e.target.checked })
                    }
                  />
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
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="jobSite">
                <AccordionTrigger>Job Site</AccordionTrigger>
                <AccordionContent>
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
                    name="zipRecruiter"
                    id="zipRecruiter"
                    checked={jobSite.zipRecruiter}
                    onChange={(e) =>
                      setJobSite({ ...jobSite, zipRecruiter: e.target.checked })
                    }
                  />
                  ZipRecruiter
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
                  <input
                    type="checkbox"
                    name="other"
                    id="other"
                    checked={jobSite.other}
                    onChange={(e) =>
                      setJobSite({ ...jobSite, other: e.target.checked })
                    }
                  />
                  Other
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="applicationType">
                <AccordionTrigger>Application Type</AccordionTrigger>
                <AccordionContent>
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
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sortBy">
                <AccordionTrigger>Sort By</AccordionTrigger>
                <AccordionContent>
                  <div className="sort-controls">
                    

                    <div className="sort-row">
                      <label htmlFor="salaryDropdown" className="sort-row__label">Salary</label>
                      <select
                        id="salaryDropdown"
                        name="salarySort"
                        className="sort-row__select"
                        value={salarySort}
                        onChange={(e) => setSalarySort(e.target.value as "default" | "salary-desc" | "salary-asc")}
                      >
                        <option value="default">Default</option>
                        <option value="salary-desc">Highest to Lowest</option>
                        <option value="salary-asc">Lowest to Highest</option>
                      </select>
                    </div>

                    <div className="sort-row">
                      <label htmlFor="postedDateDropdown" className="sort-row__label">Posted Date</label>
                      <select
                        id="postedDateDropdown"
                        name="postedDateSort"
                        className="sort-row__select"
                        value={postedDateSort}
                        onChange={(e) => setPostedDateSort(e.target.value as "default" | "date-desc" | "date-asc")}
                      >
                        <option value="default">Default</option>
                        <option value="date-desc">Newest to Oldest</option>
                        <option value="date-asc">Oldest to Newest</option>
                      </select>
                    </div>

                    <div className="sort-row">
                      <label htmlFor="matchScoreDropdown" className="sort-row__label">Match Score</label>
                      <select
                        id="matchScoreDropdown"
                        name="matchScoreSort"
                        className="sort-row__select"
                        value={matchScoreSort}
                        onChange={(e) => setMatchScoreSort(e.target.value as "default" | "score-desc" | "score-asc")}
                      >
                        <option value="default">Default</option>
                        <option value="score-desc">Highest to Lowest</option>
                        <option value="score-asc">Lowest to Highest</option>
                      </select>
                    </div>
                  </div>

                </AccordionContent>
                </AccordionItem>
            </Accordion>
            </ScrollArea>
          </div>
        </Card>

        <main className="user-main">
          {error && <p className="error-message">Error: {error}</p>}
          <div className="return-count flex items-center justify-start gap-1">
            <Briefcase className="h-4 w-4 mr-1 shrink-0" />
            <span className="leading-none">{filteredJobs.length}</span> <span className="leading-none">jobs found</span>
          </div>
          {loading && <p>Loading jobs...</p>}
          {!loading && filteredJobs.length === 0}
          {sortedJobs.map((job) => (
            <Jobcard
              key={job.id}
              id={job.id}
              jobTitle={job.title}
              companyName={job.company}
              publisher={job.publisher}
              location={job.location}
              jobType={job.jobType}
              jobSite={job.jobSite}
              applicationTypes={job.applicationType}
              pay={job.pay}
              applied={appliedJobIds.includes(String(job.applyUrl))}
              jobPostedDate={job.datePosted}
              description={job.description}
              applyUrl={job.applyUrl}
              onSelect={(id) => setSelectedJobId(id)}
              onSave={() => handleSaveJob(job)}
              isSaved={savedJobIds.includes(String(job.applyUrl))}
            />
          ))}
        </main>

        <div className="user-details">
          <JobDetailPanel
            job={selectedJob}
            onClose={() => setSelectedJobId(null)}
            onSave={(id) => {
              const current = sortedJobs.find((j) => j.id === id);
              if (current) handleSaveJob(current);
            }}
            saved={
              selectedJob
                ? savedJobIds.includes(String(selectedJob.applyUrl))
                : false
            }
            applied = {
              selectedJob 
                ? appliedJobIds.includes(String(selectedJob.applyUrl)) 
                : false
            }
            onAppliedChange={(nextApplied) => {
              if(selectedJob) {
                handleMarkApplied(selectedJob, nextApplied);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
