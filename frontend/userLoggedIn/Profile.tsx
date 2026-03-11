import Header from "./Header";
import CreatableSelect from "react-select/creatable";
import { useState } from "react";
import type { MultiValue } from "react-select";
import "./Profile.css";
import ProfileTab from "./tabs/ProfileTab";
import PreferenceTab from "./tabs/PreferenceTab";
import AccountTab from "./tabs/AccountTab";
import SavedJobsTab from "./tabs/SavedJobs";
import TabHolder from "./TabHolder";

const Profile = () => {
        
    return (
        <>
        <div>
            <Header />
            <TabHolder />
        </div>
        </>
    );
};

export default Profile;