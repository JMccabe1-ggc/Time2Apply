import { useEffect, useState } from "react";
import Header from "./Header";
import Jobcard from "./Jobcard";
import jobData from "./jobtest.json";
import "./User.css";
const User = () => {

    const [minSalary, setMinSalary] = useState(20000);
    const [maxSalary, setMaxSalary] = useState(200000);
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
        questionaire: true,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [locationTerm, setLocationTerm] = useState("");
    const term= searchTerm.toLowerCase();
    const locationTermLower = locationTerm.toLowerCase();
    const [pendingApplyJobId, setPendingApplyJobId] = useState<string | null>(null);
    const [showApplyPrompt, setShowApplyPrompt] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const selectedJob = jobData.find((j) => j.id === selectedJobId) ?? null;



    //WILL NEED FOR FAST API CALLS TO REDUCE SPAM CALLS
   // useEffect(() => {
    //const delay = setTimeout(() => {
        // run search / API call
    //}, 400);
    //return () => clearTimeout(delay);
//}, [searchTerm]);


    const filteredJobs = jobData.filter((job) => {
        if (job.jobType==="Full-time" && !jobType.fullTime) {
            return false;
        }
        if (job.jobType==="Part-time" && !jobType.partTime) {
            return false;
        }
        if (job.jobType==="Contract" && !jobType.contract) {
            return false;
        }
        if (job.jobType==="Internship" && !jobType.internship) {
            return false;
        }
        if (job.jobSite==="LinkedIn" && !jobSite.linkedIn) {
            return false;
        }
        if (job.jobSite==="Indeed" && !jobSite.indeed) {
            return false;
        }
        if (job.jobSite==="Handshake" && !jobSite.handshake) {
            return false;
        }
        if (job.jobSite==="Monster" && !jobSite.monster) {
            return false;
        }
        if (job.applicationType==="Easy Apply" && !applicationType.easyApply) {
            return false;
        }
        if (job.applicationType==="External Apply" && !applicationType.externalApply) {
            return false;
        }
        if (job.applicationType==="Questionnaire" && !applicationType.questionaire) {
            return false;
        }
        if (job.pay && (job.pay.max < minSalary || job.pay.min > maxSalary)) {
            return false;
        }
        if (term) {
            const titleMatch = job.title?.toLowerCase().includes(term);
            const companyMatch = job.company?.toLowerCase().includes(term);
            const locationMatch = job.location?.toLowerCase().includes(term.toLowerCase());
            const jobTypeMatch = job.jobType?.toLowerCase().includes(term);
            const jobSiteMatch = job.jobSite?.toLowerCase().includes(term);
            const applicationTypeMatch = job.applicationType?.toLowerCase().includes(term);
            if (!titleMatch && !companyMatch && !locationMatch && !jobTypeMatch && !jobSiteMatch && !applicationTypeMatch) {
                return false;
            }
        }
        if (locationTermLower) {
            const locationMatch = job.location?.toLowerCase().includes(locationTermLower);
            if (!locationMatch) {
                return false;
            }
        }
        return true;
    });


    return(


        <div className="user-page">
            <Header />
            <div className="user-layout">
                <aside className="user-aside">
                    <div>
                        <h2>Filters</h2>
                        <h4>Search</h4>
                        <label htmlFor="search">Job Title, Company, Keywords</label>
                        <input type="text" name="search" id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <label htmlFor="location">Location</label>
                        <input type="text" name="location" id="location" value={locationTerm} onChange={(e) => setLocationTerm(e.target.value)} />
                        <hr />
                        <label htmlFor="">Job Type</label>
                        
                        <input type="checkbox" name="fullTime" id="fullTime" checked={jobType.fullTime} onChange={(e)=>setJobType({...jobType,fullTime:e.target.checked})} />Full Time
                        <br />
                        <input type="checkbox" name="partTime" id="partTime" checked={jobType.partTime} onChange={(e)=>setJobType({...jobType,partTime:e.target.checked})} />Part Time
                        <br />
                        <input type="checkbox" name="contract" id="contract" checked={jobType.contract} onChange={(e)=>setJobType({...jobType,contract:e.target.checked})} />Contract
                        <br />
                        <input type="checkbox" name="internship" id="internship" checked={jobType.internship} onChange={(e)=>setJobType({...jobType,internship:e.target.checked})} />Internship
                        <br />
                        <hr />

                        <label htmlFor="">Job Site</label>

                        <input type="checkbox" name="linkedIn" id="linkedIn" checked={jobSite.linkedIn} onChange={(e)=>setJobSite({...jobSite,linkedIn:e.target.checked})} />LinkedIn
                        <br />
                        <input type="checkbox" name="indeed" id="indeed" checked={jobSite.indeed} onChange={(e)=>setJobSite({...jobSite,indeed:e.target.checked})} />Indeed
                        <br />
                        <input type="checkbox" name="handshake" id="handshake" checked={jobSite.handshake} onChange={(e)=>setJobSite({...jobSite,handshake:e.target.checked})} />Handshake 
                        <br />
                        <input type="checkbox" name="monster" id="monster" checked={jobSite.monster} onChange={(e)=>setJobSite({...jobSite,monster:e.target.checked})} />Monster 
                        <br /><hr />

                        <label htmlFor="">Application Type</label>
                        
                        <input type="checkbox" name="easyApply" id="easyApply" checked={applicationType.easyApply} onChange={(e)=>setApplicationType({...applicationType,easyApply:e.target.checked})} />Easy Apply
                        <br />
                        <input type="checkbox" name="externalApply" id="externalApply" checked={applicationType.externalApply} onChange={(e)=>setApplicationType({...applicationType,externalApply:e.target.checked})} />External Apply
                        <br />
                        <input type="checkbox" name="questionaire" id="questionaire" checked={applicationType.questionaire} onChange={(e)=>setApplicationType({...applicationType,questionaire:e.target.checked})} />Questionaire 
                        <br />
                        <hr />
                        <label htmlFor="">Salary Range</label>


<div>
    {/* Min Slider */}
    <input
        type="range"
        min={0}
        max={200000}
        step={1000}
        value={minSalary}
        onChange={(e) =>
            setMinSalary(Math.min(Number(e.target.value), maxSalary - 1000))
        }
    />

    {/* Max Slider */}
    <input
        type="range"
        min={0}
        max={200000}
        step={1000}
        value={maxSalary}
        onChange={(e) =>
            setMaxSalary(Math.max(Number(e.target.value), minSalary + 1000))
        }
    />
</div>

<label htmlFor="salaryRange">{`${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()}`}</label>

                    </div>
                </aside>



                <main className="user-main">
                    <h2>Results</h2>
                    {filteredJobs.map((job) => (
                        <Jobcard
                            key={job.id}
                            jobTitle={job.title}
                            companyName={job.company}
                            location={job.location}
                            jobType={job.jobType}
                            jobSite={job.jobSite}
                            applicationTypes={job.applicationType}
                            pay={job.pay}
                            applied={job.applied}
                            jobPostedDate={job.datePosted}
                            
                        />
                    ))}
                </main>
            </div>
        </div>
    );
};

export default User;