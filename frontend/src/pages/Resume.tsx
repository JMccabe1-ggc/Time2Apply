import Header from "@/components/Header";
import "../components/ui/Resume.css";

const Resume = () => {

    

    return(
        <div className="resume-page">
            <Header />
            <main className="resume-content">
                <section className="resume-hero">
                    <h1>Upload your resume</h1>
                    <p>Parse your resume into structured fields you can review and edit before saving.</p>
                </section>

                <section className="resume-card">
                    <div className="resume-upload">
                        <label htmlFor="resumeFile">Resume file</label>
                        <input
                            id="resumeFile"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        />
                    </div>
                    <button className="resume-button" type="button">Parse resume</button>
                </section>

                <section className="resume-card">
                    <div className="resume-section-header">
                        <h2>Parsed details</h2>
                        <p>Review the extracted data and make edits if needed.</p>
                    </div>

                    <div className="resume-grid">
                        <div className="resume-field">
                            <label htmlFor="name">Name</label>
                            <input id="name" name="name" type="text" placeholder="Alex Johnson" />
                        </div>
                        <div className="resume-field">
                            <label htmlFor="phone">Phone Number</label>
                            <input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" />
                        </div>
                        <div className="resume-field">
                            <label htmlFor="email">Email</label>
                            <input id="email" name="email" type="email" placeholder="alex@email.com" />
                        </div>
                        <div className="resume-field resume-field--full">
                            <label htmlFor="education">Education</label>
                            <textarea id="education" name="education" rows={4} placeholder="University, degree, dates"></textarea>
                        </div>
                        <div className="resume-field resume-field--full">
                            <label htmlFor="experience">Experience</label>
                            <textarea id="experience" name="experience" rows={5} placeholder="Role, company, achievements"></textarea>
                        </div>
                        <div className="resume-field resume-field--full">
                            <label htmlFor="skills">Skills</label>
                            <textarea id="skills" name="skills" rows={3} placeholder="Skills, tools, certifications"></textarea>
                        </div>
                        <div className="resume-field resume-field--full">
                            <label htmlFor="licenses">Licenses / Certification</label>
                            <textarea id="licenses" name="licenses" rows={3} placeholder="AWS Certified Solutions Architect"></textarea>
                        </div>
                        <div className="resume-field resume-field--full">
                            <label htmlFor="references">References</label>
                            <textarea id="references" name="references" rows={3} placeholder="Name, relationship, contact"></textarea>
                        </div>
                    </div>

                    <div className="resume-actions">
                        <button className="resume-button" type="button">Save details</button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Resume;