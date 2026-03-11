import { useState } from "react";
import ProfileTab from "./tabs/ProfileTab";
import PreferenceTab from "./tabs/PreferenceTab";
import AccountTab from "./tabs/AccountTab";
import SavedJobsTab from "./tabs/SavedJobs";
import "./TabHolder.css";

type TabName = "profile" | "preferences" | "account" | "saved";

const tabs: Array<{ id: TabName; label: string; description: string }> = [
    {
        id: "profile",
        label: "Profile",
        description: "Personal details and career summary",
    },
    {
        id: "preferences",
        label: "Preferences",
        description: "Search targets and matching criteria",
    },
    {
        id: "account",
        label: "Account",
        description: "Security, password, and access settings",
    },
    {
        id: "saved",
        label: "Saved Jobs",
        description: "Bookmarks and tracked opportunities",
    },
];

const TabHolder = () => {
    const [activeTab, setActiveTab] = useState<TabName>("profile");

    return (
        <section className="tab-holder" aria-label="Profile dashboard tabs">
            <div className="tab-holder__frame">
                <header className="tab-holder__hero">
                    <div>
                        <p className="tab-holder__eyebrow">Workspace</p>
                        <h1 className="tab-holder__title">Manage your profile</h1>
                        <p className="tab-holder__subtitle">
                            Keep your information, preferences, and account details organized in one place.
                        </p>
                    </div>
                </header>

                <nav className="tab-holder__nav" aria-label="Profile sections">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                className={`tab-holder__tab ${isActive ? "tab-holder__tab--active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                                aria-pressed={isActive}
                            >
                                <span className="tab-holder__tab-label">{tab.label}</span>
                                <span className="tab-holder__tab-description">{tab.description}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="tab-holder__panel">
                    {activeTab === "profile" && <ProfileTab />}
                    {activeTab === "preferences" && <PreferenceTab />}
                    {activeTab === "account" && <AccountTab />}
                    {activeTab === "saved" && <SavedJobsTab />}
                </div>
            </div>
        </section>
    );
};

export default TabHolder;