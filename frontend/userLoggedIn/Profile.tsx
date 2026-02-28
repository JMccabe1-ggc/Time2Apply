import Header from "./Header";
import CreatableSelect from "react-select/creatable";
import { useState } from "react";
import type { MultiValue } from "react-select";
import "./Profile.css";

type PreferenceOption = {
    label: string;
    value: string;
};

const Profile = () => {
    const [jobTitles, setJobTitles] = useState<PreferenceOption[]>([]);
    const [jobLocationsCity, setJobLocationsCity] = useState<PreferenceOption[]>([]);
    const [jobLocationsState, setJobLocationsState] = useState<PreferenceOption[]>([]);
    const [jobSkills, setJobSkills] = useState<PreferenceOption[]>([]);

    type Option = { label: string; value: string };
    const jobTitleOptions: Option[] = [
  { label: "Frontend Developer", value: "frontend-developer" },
  { label: "Backend Developer", value: "backend-developer" },
  { label: "Full Stack Developer", value: "full-stack-developer" },
  { label: "Software Engineer", value: "software-engineer" },
  { label: "Data Analyst", value: "data-analyst" },
  { label: "DevOps Engineer", value: "devops-engineer" },
];

    const handleJobTitleChange = (newValue: MultiValue<PreferenceOption>) => {
        setJobTitles([...newValue]);
    };

    const handleJobLocationCityChange = (newValue: MultiValue<PreferenceOption>) => {
        setJobLocationsCity([...newValue]);
    };

    const handleJobLocationStateChange = (newValue: MultiValue<PreferenceOption>) => {
        setJobLocationsState([...newValue]);
    };

    const handleJobSkillsChange = (newValue: MultiValue<PreferenceOption>) => {
        setJobSkills([...newValue]);
    };

    const totalPreferences =
        jobTitles.length + jobLocationsCity.length + jobLocationsState.length + jobSkills.length;

    return (
        <div className="profile-page">
            <Header />
            <main className="profile-main">
                <section className="profile-card">
                    <div className="profile-header">
                        <h1 className="profile-title">Profile Preferences</h1>
                        <p className="profile-subtitle">
                            Add target roles so job recommendations and filters can match your search goals.
                        </p>
                    </div>

                    <div className="profile-fields">
                        <div className="profile-field">
                            <label className="profile-label">Preferred Job Titles</label>
                            <CreatableSelect<PreferenceOption, true>
                                options={jobTitleOptions}
                                isMulti
                                placeholder="Type and press enter (e.g. Frontend Developer)"
                                value={jobTitles}
                                onChange={handleJobTitleChange}
                                className="profile-select"
                                classNamePrefix="profile-select"
                                noOptionsMessage={() => "Create a new title"}
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">Preferred Cities</label>
                            <CreatableSelect<PreferenceOption, true>
                                isMulti
                                placeholder="Type and press enter (e.g. Seattle)"
                                value={jobLocationsCity}
                                onChange={handleJobLocationCityChange}
                                className="profile-select"
                                classNamePrefix="profile-select"
                                noOptionsMessage={() => "Create a new city"}
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">Preferred States</label>
                            <CreatableSelect<PreferenceOption, true>
                                isMulti
                                placeholder="Type and press enter (e.g. Washington)"
                                value={jobLocationsState}
                                onChange={handleJobLocationStateChange}
                                className="profile-select"
                                classNamePrefix="profile-select"
                                noOptionsMessage={() => "Create a new state"}
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">Skills</label>
                            <CreatableSelect<PreferenceOption, true>
                                isMulti
                                placeholder="Type and press enter (e.g. React, SQL, TypeScript)"
                                value={jobSkills}
                                onChange={handleJobSkillsChange}
                                className="profile-select"
                                classNamePrefix="profile-select"
                                noOptionsMessage={() => "Create a new skill"}
                            />
                        </div>
                    </div>

                    <div className="profile-note">
                        {totalPreferences === 0
                            ? "No preferences set yet."
                            : `${totalPreferences} preference${totalPreferences === 1 ? "" : "s"} saved in this session.`}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Profile;