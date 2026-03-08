import Header from "./Header";
import CreatableSelect from "react-select/creatable";
import { useState } from "react";
import type { MultiValue } from "react-select";
import "./Profile.css";
import ProfileTab from "./tabs/ProfileTab";
import PreferenceTab from "./tabs/PreferenceTab";
import AccountTab from "./tabs/AccountTab";
import SavedJobsTab from "./tabs/SavedJobs";

type tabName = "profile" | "preferences" | "account";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("profile");
    
    const tabStyle = (tabName: tabName) => ({
    padding: "10px 16px",
    border: "none",
    borderBottom: activeTab === tabName ? "3px solid blue" : "3px solid transparent",
    background: "none",
    cursor: "pointer",
    fontWeight: activeTab === tabName ? "bold" : "normal",
  });

    return (
        <>
        <div>
            <Header />
            <div>
                <button onClick={() => setActiveTab("profile")}>Profile</button>
                <button onClick={() => setActiveTab("preferences")}>Preferences</button>
                <button onClick={() => setActiveTab("account")}>Account</button>
                <button onClick={() => setActiveTab("saved")}>Saved Jobs</button>
            </div>

            <div>
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "preferences" && <PreferenceTab />}
                {activeTab === "account" && <AccountTab />}
                {activeTab === "saved" && <SavedJobsTab />}
            </div>
        </div>
        </>
    );
};

export default Profile;