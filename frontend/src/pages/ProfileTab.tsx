import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import supabase from "@/lib/supabase";
import "../components/ui/ProfileTab.css";
import { State, City, type ICity, type IState } from "country-state-city";


//change to city and state instead of location
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
    github: "",
  });
  const [selectedFileName, setSelectedFileName] = useState("No image selected");
  const [savedMessage, setSavedMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const states: IState[] = State.getStatesOfCountry("US");
  const [selectedState, setSelectedState] = useState<string>("");
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);

    if (stateCode) {
      const stateCities: ICity[] = City.getCitiesOfState("US", stateCode);
      setCities(stateCities);
    } else {
      setCities([]);
      setSelectedCity("");
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
  };

  

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
        if (data.state) {
        const matchedState = states.find((state) => state.name === data.state);

        if (matchedState) {
      setSelectedState(matchedState.isoCode);
      const stateCities: ICity[] = City.getCitiesOfState("US", matchedState.isoCode);
      setCities(stateCities);
        }
        }

         if (data.city) {
       setSelectedCity(data.city);
        }
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

    if (!selectedState || !selectedCity) {
      setError("Please select both state and city.");
      return;
    }
    else {
        setError(null);
    }

    if (!user) {
      setSavedMessage("You must be logged in.");
      setLoading(false);
      return;
    }
    let uploadedProfilePictureUrl = profilePictureUrl;
     const stateName =
        states.find((state) => state.isoCode === selectedState)?.name || "";
     const fullLocation = `${selectedCity}, ${stateName}`;
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
        city: selectedCity,
        state: stateName,
        location: fullLocation,
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

  const handleCancel = () => {
    setSavedMessage("");
    setSelectedFileName("No image selected");
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
                    <label className="profile-tab__field" htmlFor="state">
                        <span>State</span>
                        <select name="state"
                        id="state"
                        value={selectedState}
                        onChange={handleStateChange}
                        className="profile-tab__select"
                        >
                            <option value="">Select a state</option>
                            {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}

                        </select>
                    </label>

                    <label className="profile-tab__field" htmlFor="city">
                        <span>City</span>
                        <select
                          name="city"
                          id="city"
                          value={selectedCity}
                          onChange={handleCityChange}
                          className="profile-tab__select"
                          disabled={!selectedState}
                        >
                            <option value="">{selectedState ? "Select a city" : "Select a state first"}</option>
                            {cities.map((city) => (
                                <option key={city.name} value={city.name}>
                                    {city.name}
                                </option>
                            ))}

                        </select>
                    </label>

                    
                </div>

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

                
                  <div className="profile-tab__social-group">
                    <p className="profile-tab__section-label">Social Links</p>
                    <label className="profile-tab__field" htmlFor="linkedIn">
                      <span>LinkedIn</span>
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
                      <span>GitHub</span>
                      <input
                        id="github"
                        name="github"
                        type="url"
                        value={formState.github}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username"
                      />
                    </label>
                  </div>

                  <label className="profile-tab__field profile-tab__field--file" htmlFor="profilePicture">
                    <span>Profile Picture</span>
                    <div className="profile-tab__upload-area">
                      <span className="profile-tab__upload-btn">Choose File</span>
                      <span className="profile-tab__upload-filename">{selectedFileName}</span>
                    </div>
                    <input
                      id="profilePicture"
                      name="profilePicture"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileChange}
                    />
                  </label>
                    {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
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