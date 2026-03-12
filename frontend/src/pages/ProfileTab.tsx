import { useState, type ChangeEvent, type FormEvent } from "react";
import "../components/ui/ProfileTab.css";

type ProfileFormState = {
    location: string;
    role: string;
    bio: string;
    goals: string;
    linkedIn: string;
};

const ProfileTab = () => {
    const fakeUserData = {
        firstName: "John",
        lastName: "Doe",
        email: "a@a.com",
    };

    const [formState, setFormState] = useState<ProfileFormState>({
        location: "Austin, TX",
        role: "Software Engineer",
        bio: "I am a full-stack developer focused on clean architecture, measurable outcomes, and reliable delivery.",
        goals: "Move into a senior role and contribute to a product team with strong engineering standards.",
        linkedIn: "https://www.linkedin.com/in/johndoe",
    });
    const [selectedFileName, setSelectedFileName] = useState("No image selected");
    const [savedMessage, setSavedMessage] = useState("");

    const fullName = `${fakeUserData.firstName} ${fakeUserData.lastName}`;
    const initials = `${fakeUserData.firstName[0]}${fakeUserData.lastName[0]}`;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormState((previousState) => ({
            ...previousState,
            [name]: value,
        }));
        setSavedMessage("");
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fileName = event.target.files?.[0]?.name;
        setSelectedFileName(fileName ?? "No image selected");
        setSavedMessage("");
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSavedMessage("Profile updates saved.");
    };

    return (
        <section className="profile-tab" aria-labelledby="profile-tab-title">
            <div className="profile-tab__header">
                <div className="profile-tab__avatar" aria-hidden="true">
                    {initials}
                </div>
                <div>
                    <h2 id="profile-tab-title" className="profile-tab__title">
                        {fullName}
                    </h2>
                    <p className="profile-tab__subtitle">Keep your details up to date for better job matches.</p>
                    <p className="profile-tab__email">{fakeUserData.email}</p>
                </div>
            </div>

            <form className="profile-tab__form" onSubmit={handleSubmit}>
                <div className="profile-tab__grid">
                    <label className="profile-tab__field" htmlFor="location">
                        <span>Location</span>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formState.location}
                            onChange={handleInputChange}
                            placeholder="City, State"
                        />
                    </label>

                    <label className="profile-tab__field" htmlFor="role">
                        <span>Current Role</span>
                        <input
                            id="role"
                            name="role"
                            type="text"
                            value={formState.role}
                            onChange={handleInputChange}
                            placeholder="Job title"
                        />
                    </label>
                </div>

                <label className="profile-tab__field" htmlFor="bio">
                    <span>Professional Summary</span>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formState.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Add a concise summary of your experience"
                    />
                </label>

                <label className="profile-tab__field" htmlFor="goals">
                    <span>Career Goals</span>
                    <textarea
                        id="goals"
                        name="goals"
                        value={formState.goals}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Describe your short and long-term goals"
                    />
                </label>

                <label className="profile-tab__field" htmlFor="linkedIn">
                    <span>LinkedIn Profile</span>
                    <input
                        id="linkedIn"
                        name="linkedIn"
                        type="url"
                        value={formState.linkedIn}
                        onChange={handleInputChange}
                        placeholder="https://www.linkedin.com/in/username"
                    />
                </label>

                <label className="profile-tab__field" htmlFor="linkedIn">
                    <span>LinkedIn Profile</span>
                    <input
                        id="linkedIn"
                        name="linkedIn"
                        type="url"
                        value={formState.linkedIn}
                        onChange={handleInputChange}
                        placeholder="https://www.linkedin.com/in/username"
                    />
                </label>

                <label className="profile-tab__field profile-tab__field--file" htmlFor="profilePicture">
                    <span>Profile Picture</span>
                    <input
                        id="profilePicture"
                        name="profilePicture"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileChange}
                    />
                    <small>{selectedFileName}</small>
                </label>

                <div className="profile-tab__actions">
                    <button type="submit" className="profile-tab__button profile-tab__button--primary">
                        Save Profile
                    </button>
                    <button
                        type="button"
                        className="profile-tab__button profile-tab__button--secondary"
                        onClick={() => {
                            setSavedMessage("");
                            setSelectedFileName("No image selected");
                        }}
                    >
                        Cancel
                    </button>
                </div>

                {savedMessage ? <p className="profile-tab__status">{savedMessage}</p> : null}
            </form>
        </section>
    );
};

export default ProfileTab;