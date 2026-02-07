import { useState } from "react";
import Header from "./Header";
import "./Applications.css";

const Applications = () => {

    const [numOfJobsApplied, setNumOfJobsApplied] = useState(5);
    const [activeApplications, setActiveApplications] = useState(0);
    const [rejectedApplications, setRejectedApplications] = useState(1);
    const [noResponseApplications, setNoResponseApplications] = useState(4);
    const [numOfInterviews, setNumOfInterviews] = useState(0);
    const [offersReceived, setOffersReceived] = useState(0);
    const [offersAccepted, setOffersAccepted] = useState(0);

    const formatRate = (value: number, total: number) => {
        if (total === 0) {
            return "0.0";
        }

        return ((value / total) * 100).toFixed(1);
    };

    return(
        <div className="applications-page">
            <Header />
            <div className="applications-content">
                <section className="applications-summary">
                    <div className="applications-title">
                        <h1>Applications overview</h1>
                        <p>Track activity, responses, and outcomes at a glance.</p>
                    </div>
                    <div className="applications-grid">
                        <div className="applications-card applications-card--primary">
                            <h2>Jobs applied</h2>
                            <span>{numOfJobsApplied}</span>
                        </div>
                        <div className="applications-card">
                            <h2>Active</h2>
                            <span>{activeApplications}</span>
                        </div>
                        <div className="applications-card">
                            <h2>Rejected</h2>
                            <span>{rejectedApplications}</span>
                        </div>
                        <div className="applications-card">
                            <h2>No response</h2>
                            <span>{noResponseApplications}</span>
                        </div>
 
                        <div className="applications-card">
                            <h2>Interviews</h2>
                            <span>{numOfInterviews}</span>
                        </div>
                        <div className="applications-card">
                            <h2>Offers received</h2>
                            <span>{offersReceived}</span>
                        </div>
                        <div className="applications-card">
                            <h2>Offers accepted</h2>
                            <span>{offersAccepted}</span>
                        </div>

                    </div>
                </section>
                <section className="applications-rates">
                    <div className="applications-rate">
                        <h3>Interview rate</h3>
                        <span>{formatRate(numOfInterviews, numOfJobsApplied)}%</span>
                    </div>
                    <div className="applications-rate">
                        <h3>Offer rate</h3>
                        <span>{formatRate(offersReceived, numOfJobsApplied)}%</span>
                    </div>
                    <div className="applications-rate">
                        <h3>Ghost rate</h3>
                        <span>{formatRate(noResponseApplications, numOfJobsApplied)}%</span>
                    </div>
                    <div className="applications-rate">
                        <h3>Reject rate</h3>
                        <span>{formatRate(rejectedApplications, numOfJobsApplied)}%</span>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Applications;