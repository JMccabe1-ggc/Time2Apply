import { useState } from "react";
import Header from "@/components/Header";
import "../components/ui/Applications.css";

type ApplicationStatus = "applied" | "interviewing" | "rejected" | "accepted" | "no-response";

type Application = {
    id: number;
    jobTitle: string;
    company: string;
    dateApplied: string;
    status: ApplicationStatus;
};

const Applications = () => {
    const [applications, setApplications] = useState<Application[]>([
        {
            id: 1,
            jobTitle: "Software Engineer",
            company: "Tech Company",
            dateApplied: "2024-06-15",
            status: "applied"
        },
        {
            id: 2,
            jobTitle: "Frontend Developer",
            company: "Google",
            dateApplied: "2024-06-10",
            status: "interviewing"
        },
        {
            id: 3,
            jobTitle: "Backend Developer",
            company: "Amazon",
            dateApplied: "2024-06-05",
            status: "rejected"
        },
        {
            id: 4,
            jobTitle: "UX Designer",
            company: "Apple",
            dateApplied: "2024-06-01",
            status: "no-response"
        },
        {
            id: 5,
            jobTitle: "Product Manager",
            company: "Microsoft",
            dateApplied: "2024-05-28",
            status: "applied"
        }
    ]);

    const handleStatusChange = (id: number, newStatus: ApplicationStatus) => {
        setApplications(applications.map(app => 
            app.id === id ? { ...app, status: newStatus } : app
        ));
    };

    const numOfJobsApplied = applications.length;
    const activeApplications = applications.filter(app => app.status === "interviewing").length;
    const rejectedApplications = applications.filter(app => app.status === "rejected").length;
    const noResponseApplications = applications.filter(app => app.status === "no-response").length;
    const numOfInterviews = applications.filter(app => app.status === "interviewing").length;
    const offersReceived = applications.filter(app => app.status === "accepted").length;
    const offersAccepted = applications.filter(app => app.status === "accepted").length;

    const formatRate = (value: number, total: number) => {
        if (total === 0) {
            return "0.0";
        }

        return ((value / total) * 100).toFixed(1);
    };

    return(
        <>
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
            
            <section className="applications-table-section">
                <div className="applications-table-header">
                    <h2>Recent Applications</h2>
                    <p>Track and manage your job applications</p>
                </div>
                <div className="applications-table-wrapper">
                    <table className="applications-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Date Applied</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app.id}>
                                    <td>{app.jobTitle}</td>
                                    <td>{app.company}</td>
                                    <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
                                    <td>
                                        <select 
                                            className="applications-status-select"
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="interviewing">Interviewing</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="no-response">No Response</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
                        
        </div>
        
        
        </>
    );
};

export default Applications;