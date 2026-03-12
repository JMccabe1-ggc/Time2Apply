import Header from "@/components/Header";
import CreatableSelect from "react-select/creatable";
import { useState } from "react";
import type { MultiValue } from "react-select";
import "../components/ui/Profile.css";
import ProfileTab from "./ProfileTab";
import PreferenceTab from "./PreferenceTab";
import AccountTab from "./AccountTab";
import SavedJobsTab from "./SavedJobs";
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