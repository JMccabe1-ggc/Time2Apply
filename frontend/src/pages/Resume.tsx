import { useState, useEffect } from "react";
import Header from "@/components/Header";
import "../components/ui/Resume.css";


const API_BASE_URL = "http://127.0.0.1:8000";

const Resume = () => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        education: "",
        experience: "",
        skills: "",
        licenses: "",
        references: "",
    });

    useEffect(() => {
    const loadSkills = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/resume/active/skills`);
            const result = await response.json();

            console.log("loaded skills:", result);

            if (!response.ok) {
                throw new Error(result.detail || "Failed to load skills");
            }

            setFormData((prev) => ({
                ...prev,
                skills: Array.isArray(result.skills)
                    ? result.skills.join(", ")
                    : "",
            }));
        } catch (error) {
            console.error("Error loading skills:", error);
        }
    };

    loadSkills();
}, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleParseResume = async () => {
        if (!resumeFile) {
            alert("Please upload a resume first.");
            return;
        }

        const data = new FormData();
        data.append("file", resumeFile);

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/resume/upload`, {
                method: "POST",
                body: data,
            });

            const result = await response.json();
            console.log("resume upload result:", result);
            console.log("skills_extracted:", result.skills_extracted);
            console.log("is array?", Array.isArray(result.skills_extracted));

            if (!response.ok) {
                throw new Error(result.detail || "Failed to parse resume");
            }
                setFormData((prev) => ({
                    ...prev,
                    skills: Array.isArray(result.skills_extracted)
                        ? result.skills_extracted.join(", ")
                        : typeof result.skills_extracted === "string"
                        ? result.skills_extracted
                        : "",
                    }));
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Could not parse resume.");
        } finally {
            setLoading(false);
        }
    };

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
                            onChange={handleFileChange}
                        />
                    </div>
                    <button
                        className="resume-button"
                        type="button"
                        onClick={handleParseResume}
                        disabled={loading}
                    >
                        {loading ? "Parsing..." : "Parse resume"}
                    </button>
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
                            <textarea id="skills"
                             name="skills" rows={3} 
                             placeholder="AWS Certified Solutions Architect"
                                value={formData.skills}
                                onChange={handleChange}>
                             </textarea>
                        </div>
                        <div className="resume-field resume-field--full">
                            <label htmlFor="licenses">Licenses / Certification</label>
                            <textarea id="licenses" name="licenses" rows={3} placeholder="AWS Certified Solutions Architect"
                                value={formData.licenses}
                                onChange={handleChange}>
                            </textarea>
                        </div>
                        <div className="resume-field resume-field--full">
                            <label htmlFor="references">References</label>
                            <textarea id="references" name="references" rows={3} placeholder="Name, relationship, contact"
                                value={formData.references}
                                onChange={handleChange}>
                            </textarea>
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