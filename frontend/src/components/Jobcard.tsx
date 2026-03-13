import "./ui/Jobcard.css";

type JobcardProps = {
    id: number;
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
      payText?: string;
    applied: boolean;
    jobPostedDate: string;
    description?: string;
    applyUrl?: string;
    onSelect?: (id: number) => void;
     onSave: () => void;
  isSaved: boolean;
};

const Jobcard = ({
    id,
    jobTitle,
    companyName,
    location,
    jobType,
    jobSite,
    applicationTypes,
    pay,
    payText,
    applied,
    jobPostedDate,
    applyUrl,
    onSelect,
     onSave,
     isSaved,
}: JobcardProps) => {
    const formattedPay = payText
        ? payText
        : pay
            ? `${pay.currency} ${pay.min.toLocaleString()} - ${pay.max.toLocaleString()}`
            : "Pay not listed";
    const formattedDate = jobPostedDate
        ? new Date(jobPostedDate).toLocaleDateString()
        : "Date unknown";

    const goToPosting = () => {
        if (applyUrl) {
            window.open(applyUrl, "_blank");
        }
    };

    return (
        <div className="jobcard" onClick={() => onSelect?.(id)}>
            <div className="jobcard-header">
                <div>
                    <h3 className="jobcard-title">{jobTitle}</h3>
                    <p className="jobcard-company">{companyName}</p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        goToPosting();
                    }}
                    className={`jobcard-chip ${applied ? "jobcard-chip--applied" : "jobcard-chip--open"}`}
                >
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
                <button className="jobcard-action" type="button" onClick={(e) => { e.stopPropagation(); onSelect?.(id); }}>
                    View role
                </button>
              <button className="jobcard-action jobcard-action--ghost" type="button" onClick={onSave}>
                {isSaved ? "Unsave" : "Save"}
              </button>
            </div>
        </div>
    );
};

export default Jobcard;