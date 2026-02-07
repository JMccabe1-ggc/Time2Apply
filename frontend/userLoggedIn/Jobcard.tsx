
import "./Jobcard.css";

type JobcardProps = {
    jobTitle: string;
    companyName: string;
    location: string;
};

const Jobcard = ({ jobTitle, companyName, location }: JobcardProps) => {
    return(
        <div className="jobcard">
            <div className="jobcard-header">
                <div>
                    <h3 className="jobcard-title">{jobTitle}</h3>
                    <p className="jobcard-company">{companyName}</p>
                </div>
                <span className="jobcard-chip">Open</span>
            </div>
            <div className="jobcard-footer">
                <span className="jobcard-location">{location}</span>
                <button className="jobcard-action" type="button">View role</button>
            </div>
        </div>
    );
};

export default Jobcard;