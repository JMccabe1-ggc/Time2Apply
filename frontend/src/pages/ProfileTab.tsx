import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import supabase from "@/lib/supabase";
import "../components/ui/ProfileTab.css";

type ProfileFormState = {
  fullName: string;
  location: string;
  role: string;
  bio: string;
  goals: string;
  linkedIn: string;
  github?: string;
};

const ProfileTab = () => {
  const [formState, setFormState] = useState<ProfileFormState>({
    fullName: "",
    location: "",
    role: "",
    bio: "",
    goals: "",
    linkedIn: "",
  });
  const [selectedFileName, setSelectedFileName] = useState("No image selected");
  const [savedMessage, setSavedMessage] = useState("");
  const [, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    initials: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const authFullName =
        user.user_metadata?.full_name ||
        `${user.user_metadata?.first_name ?? ""} ${user.user_metadata?.last_name ?? ""}`.trim() ||
        "User";
      const displayName = formState.fullName || userInfo.fullName || "User";

      const initials = displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part[0])
        .join("")
        .toUpperCase();

      setUserInfo({
        fullName: authFullName,
        email: user.email ?? "",
        initials: initials || "U",
      });

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setFormState({
          fullName: data.full_name ?? "",
          location: data.location ?? "",
          role: data.current_title ?? "",
          bio: data.bio ?? "",
          goals: data.career_goals ?? "",
          linkedIn: data.linkedin ?? "",
        });
          if (data.profile_picture) {
        setProfilePictureUrl(data.profile_picture);
        }

        if (data.full_name) {
          const dbInitials = data.full_name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) => part[0])
            .join("")
            .toUpperCase();

          setUserInfo({
            fullName: data.full_name,
            email: data.email ?? user.email ?? "",
            initials: dbInitials || initials || "U",
          });
        }
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((previousState) => ({
      ...previousState,
      [name]: value,
    }));
    setSavedMessage("");
  };

 const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setSelectedFileName(file?.name ?? "No image selected");
    setSavedMessage("");
};

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedMessage("");
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      setSavedMessage("You must be logged in.");
      setLoading(false);
      return;
    }
    let uploadedProfilePictureUrl = profilePictureUrl;

    if (selectedFile) {
    const filePath = `${user.id}/${Date.now()}-${selectedFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, selectedFile, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      setSavedMessage(`Error: ${uploadError.message}`);
      setLoading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(filePath);

    uploadedProfilePictureUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      full_name: formState.fullName,
      current_title: formState.role,
        email: userInfo.email,
        bio: formState.bio,
        location: formState.location,
        career_goals: formState.goals,
        linkedin: formState.linkedIn,
        profile_picture: uploadedProfilePictureUrl,
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) {
      console.error("Error saving profile:", error.message);
      setSavedMessage(`Error: ${error.message}`);
    } else {
      setSavedMessage("Profile updates saved.");
      setProfilePictureUrl(uploadedProfilePictureUrl);
    }

    setLoading(false);
  };

    return (
        <section className="profile-tab" aria-labelledby="profile-tab-title">
            <div className="profile-tab__header">
                <div className="profile-tab__avatar" aria-hidden="true">
                   {profilePictureUrl ? (
                 <img
                 src={profilePictureUrl}
                  alt="Profile"
                  className="profile-tab__avatar-image"
                     />
                      ) : (
                        <span className="profile-tab__avatar-initials">
                          {userInfo.initials}
                        </span>
                      )}
                </div>
                <div>
                    <h2 id="profile-tab-title" className="profile-tab__title">
                         {formState.fullName || userInfo.fullName || "Your Profile"}
                    </h2>
                    <p className="profile-tab__subtitle">Keep your details up to date for better job matches.</p>
                    <p className="profile-tab__email">{userInfo.email || "No email provided"}</p>
                </div>
            </div>

            <form className="profile-tab__form" onSubmit={handleSubmit}>
                <label className="profile-tab__field" htmlFor="fullName">
                <span>Full Name</span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formState.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  />
</label>
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

                <label className="profile-tab__field" htmlFor="github">
                    <span>GitHub Profile</span>
                    <input
                        id="github"
                        name="github"
                        type="url"
                        value={formState.github}
                        onChange={handleInputChange}
                        placeholder="https://www.github.com/in/username"
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