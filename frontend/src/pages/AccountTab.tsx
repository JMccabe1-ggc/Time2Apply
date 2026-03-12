import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../components/ui/AccountTab.css";

const AccountTab = () => {
    const navigate = useNavigate();
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    const fakeUserData = {
        firstName: "John",
        lastName: "Doe",
        email: "a@a.com",
        role: "Job Seeker",
        lastLogin: "Today at 9:14 AM",
    };

    const fullName = `${fakeUserData.firstName} ${fakeUserData.lastName}`;
    const initials = `${fakeUserData.firstName[0]}${fakeUserData.lastName[0]}`;

    const handleToggleMfa = () => {
        const nextValue = !mfaEnabled;
        setMfaEnabled(nextValue);
        setStatusMessage(`Multi-factor authentication ${nextValue ? "enabled" : "disabled"}.`);
    };

    const handleToggleNotifications = () => {
        const nextValue = !notificationsEnabled;
        setNotificationsEnabled(nextValue);
        setStatusMessage(`Security notifications ${nextValue ? "enabled" : "disabled"}.`);
    };

    const handleSignOutEverywhere = () => {
        setStatusMessage("Signed out from all other devices.");
    };

    return (
        <section className="account-tab" aria-labelledby="account-tab-title">
            <header className="account-tab__header">
                <div className="account-tab__avatar" aria-hidden="true">
                    {initials}
                </div>
                <div>
                    <h2 id="account-tab-title" className="account-tab__title">
                        Account Settings
                    </h2>
                    <p className="account-tab__subtitle">Manage your sign-in security and account access.</p>
                    <p className="account-tab__identity">{fullName} · {fakeUserData.role}</p>
                    <p className="account-tab__email">{fakeUserData.email}</p>
                </div>
            </header>

            <div className="account-tab__content">
                <section className="account-tab__card" aria-labelledby="security-heading">
                    <h3 id="security-heading" className="account-tab__card-title">Security</h3>
                    <p className="account-tab__card-text">Protect your account with stronger authentication and password hygiene.</p>
                    <div className="account-tab__actions-row">
                        <button
                            type="button"
                            className="account-tab__button account-tab__button--primary"
                            onClick={() => navigate("/newpassword")}
                        >
                            Change Password
                        </button>
                        <button
                            type="button"
                            className="account-tab__button account-tab__button--secondary"
                            onClick={handleToggleMfa}
                        >
                            {mfaEnabled ? "Disable" : "Enable"} Multi-Factor Authentication
                        </button>
                    </div>
                    <p className={`account-tab__pill ${mfaEnabled ? "account-tab__pill--enabled" : "account-tab__pill--disabled"}`}>
                        MFA is currently {mfaEnabled ? "enabled" : "disabled"}
                    </p>
                </section>

                <section className="account-tab__card" aria-labelledby="sessions-heading">
                    <h3 id="sessions-heading" className="account-tab__card-title">Sessions and Alerts</h3>
                    <p className="account-tab__card-text">Control active sessions and receive notifications for sensitive activity.</p>
                    <p className="account-tab__meta">Last account access: {fakeUserData.lastLogin}</p>
                    <div className="account-tab__actions-row">
                        <button
                            type="button"
                            className="account-tab__button account-tab__button--secondary"
                            onClick={handleToggleNotifications}
                        >
                            Turn {notificationsEnabled ? "Off" : "On"} Security Notifications
                        </button>
                        <button
                            type="button"
                            className="account-tab__button account-tab__button--danger"
                            onClick={handleSignOutEverywhere}
                        >
                            Sign Out Everywhere
                        </button>
                    </div>
                    <p className={`account-tab__pill ${notificationsEnabled ? "account-tab__pill--enabled" : "account-tab__pill--disabled"}`}>
                        Security notifications are {notificationsEnabled ? "on" : "off"}
                    </p>
                </section>
            </div>

            {statusMessage ? <p className="account-tab__status">{statusMessage}</p> : null}
        </section>
    );
};

export default AccountTab;