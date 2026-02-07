
import "./Jobcard.css";
const dummyLink="https://jmccabe1.domains.ggc.edu/";
const goToPosting = () => {
    window.open("https://jmccabe1.domains.ggc.edu/", "_blank");
};

type JobcardProps = {
    jobTitle: string;
    companyName: string;
    location: string;
    jobType?: string;
    jobSite: string;
    applicationTypes: string;
    pay?: {
        min: number;
        max: number;
        currency: string;
    };
    applied: boolean;
    jobPostedDate: string;
};

const Jobcard = ({
    jobTitle,
    companyName,
    location,
    jobType,
    jobSite,
    applicationTypes,
    pay,
    applied,
    jobPostedDate,
}: JobcardProps) => {
    const formattedPay = pay
        ? `${pay.currency} ${pay.min.toLocaleString()} - ${pay.max.toLocaleString()}`
        : "Pay not listed";
    const formattedDate = jobPostedDate
        ? new Date(jobPostedDate).toLocaleDateString()
        : "Date unknown";

    return(
        <div className="jobcard">
            <div className="jobcard-header">
                <div>
                    <h3 className="jobcard-title">{jobTitle}</h3>
                    <p className="jobcard-company">{companyName}</p>
                </div>
                <button onClick={goToPosting} className={`jobcard-chip ${applied ? "jobcard-chip--applied" : "jobcard-chip--open"}`}>
                    {applied ? "Applied" : "Open"}
                </button>
            </div>
            <div className="jobcard-badges">
                {jobType && <span className="jobcard-badge">{jobType}</span>}
                <span className="jobcard-badge jobcard-badge--muted">{jobSite}</span>
                <span className="jobcard-badge jobcard-badge--muted">{applicationTypes}</span>
            </div>
            <div className="jobcard-meta">
                <span className="jobcard-location">{location}</span>
                <span className="jobcard-pay">{formattedPay}</span>
                <span className="jobcard-date">Posted {formattedDate}</span>
            </div>
            <div className="jobcard-footer">
                <button className="jobcard-action" type="button">View role</button>
                <button className="jobcard-action jobcard-action--ghost" type="button">Save</button>
            </div>
        </div>
    );
};

export default Jobcard;