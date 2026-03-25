import "../components/ui/PreferenceTab.css";
import CreatableSelect from "react-select/creatable";
import Header from "../components/Header";
import {useEffect, useState } from "react";
import type { MultiValue } from "react-select";
import supabase from "@/lib/supabase";
import { State, City, type IState, type ICity } from "country-state-city";
const PreferenceTab = () => {

type PreferenceOption = {
    label: string;
    value: string;
};

    const [jobTitles, setJobTitles] = useState<PreferenceOption[]>([]);
    const [jobLocationsCity, setJobLocationsCity] = useState<PreferenceOption[]>([]);
    const [jobLocationsState, setJobLocationsState] = useState<PreferenceOption[]>([]);
    const [jobSkills, setJobSkills] = useState<PreferenceOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [savedMessage, setSavedMessage] = useState("");
    const states: IState[] = State.getStatesOfCountry("US");
    const [cities, setCities] = useState<ICity[]>([]);

    const handleStateChange = (newValue: MultiValue<PreferenceOption>) => {
    const selectedStates = [...newValue];
    setJobLocationsState(selectedStates);

    if (selectedStates.length > 0) {
      const lastSelectedState = selectedStates[selectedStates.length - 1].value;
      const stateCities: ICity[] = City.getCitiesOfState("US", lastSelectedState);
      setCities(stateCities);
    } else {
      setCities([]);
      setJobLocationsCity([]);
    }
    };

    type Option = { label: string; value: string };
    const jobTitleOptions: Option[] = [
  { label: "Frontend Developer", value: "frontend-developer" },
  { label: "Backend Developer", value: "backend-developer" },
  { label: "Full Stack Developer", value: "full-stack-developer" },
  { label: "Software Engineer", value: "software-engineer" },
  { label: "Data Analyst", value: "data-analyst" },
  { label: "DevOps Engineer", value: "devops-engineer" },
];  
    const skillOptions: PreferenceOption[] = [
    { label: "React", value: "React" },
    { label: "TypeScript", value: "TypeScript" },
    { label: "JavaScript", value: "JavaScript" },
    { label: "SQL", value: "SQL" },
    { label: "Python", value: "Python" },
    { label: "Java", value: "Java" },
    { label: "HTML", value: "HTML" },
    { label: "CSS", value: "CSS" },
    { label: "Node.js", value: "Node.js" },
    { label: "Git", value: "Git" },
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

    const stateOptions = states.map((state) => ({
    label: state.name,
     value: state.isoCode,
    }));
    const cityOptions = cities.map((city) => ({
     label: city.name,
     value: city.name,
      }));

    const handleJobSkillsChange = (newValue: MultiValue<PreferenceOption>) => {
        setJobSkills([...newValue]);
    };

    const totalPreferences =
        jobTitles.length + jobLocationsCity.length + jobLocationsState.length + jobSkills.length;

        useEffect(() => {
  const loadPreferences = async () => {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading preferences:", error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setJobTitles(
        (data.job_titles ?? []).map((item: string) => ({
          label: item,
          value: item,
        }))
      );

      setJobLocationsCity(
        (data.preferred_cities ?? []).map((item: string) => ({
          label: item,
          value: item,
        }))
      );

      setJobLocationsState(
        (data.preferred_states ?? []).map((item: string) => ({
          label: item,
          value: item,
        }))
      );

      setJobSkills(
        (data.skills ?? []).map((item: string) => ({
          label: item,
          value: item,
        }))
      );
    }

    setLoading(false);
  };

      loadPreferences();
    }, []);
    const handleSavePreferences = async () => {
      setSavedMessage("");
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setSavedMessage("You must be logged in.");
        setLoading(false);
        return;
      }

  const { error } = await supabase.from("preferences").upsert(
    {
      user_id: user.id,
      job_titles: jobTitles.map((item) => item.label),
      preferred_cities: jobLocationsCity.map((item) => item.label),
      preferred_states: jobLocationsState.map((item) => item.label),
      skills: jobSkills.map((item) => item.label),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.error("Error saving preferences:", error.message);
    setSavedMessage(`Error: ${error.message}`);
  } else {
    setSavedMessage("Preferences saved.");
  }

  setLoading(false);
  
};

    return (
      <>
        <section className="preference-tab">
          <header className="preference-tab__header">
            <h1 className="preference-tab__title">Profile Preferences</h1>
            <p className="preference-tab__subtitle">
              Add target roles so job recommendations and filters can match your search goals.
            </p>
          </header>

          <div className="preference-tab__content">
            <div className="preference-tab__field">
              <label className="preference-tab__label">Preferred Job Titles</label>
              <CreatableSelect<PreferenceOption, true>
                options={jobTitleOptions}
                isMulti
                placeholder="Type and press enter (e.g. Frontend Developer)"
                value={jobTitles}
                onChange={handleJobTitleChange}
                className="preference-select"
                classNamePrefix="preference-select"
                noOptionsMessage={() => "Create a new title"}
              />
            </div>

            <div className="preference-tab__field">
              <label className="preference-tab__label">Preferred Cities</label>
              <CreatableSelect<PreferenceOption, true>
                options={cityOptions}
                isMulti
                placeholder="Select city"
                value={jobLocationsCity}
                onChange={handleJobLocationCityChange}
                className="preference-select"
                classNamePrefix="preference-select"
                isDisabled={!cities.length}
              />
            </div>

            <div className="preference-tab__field">
              <label className="preference-tab__label">Preferred States</label>
              <CreatableSelect<PreferenceOption, true>
                options={stateOptions}
                isMulti
                placeholder="Select state"
                value={jobLocationsState}
                onChange={handleStateChange}
                className="preference-select"
                classNamePrefix="preference-select"
              />
            </div>

            <div className="preference-tab__field">
              <label className="preference-tab__label">Preferred Skills</label>
              <CreatableSelect<PreferenceOption, true>
                options={skillOptions}
                isMulti
                placeholder="Type and press enter (e.g. React, SQL, TypeScript)"
                value={jobSkills}
                onChange={handleJobSkillsChange}
                className="preference-select"
                classNamePrefix="preference-select"
                noOptionsMessage={() => "Create a new skill"}
              />
            </div>

            <div className="preference-tab__note">
              {totalPreferences === 0
                ? "No preferences set yet."
                : `${totalPreferences} preference${totalPreferences === 1 ? "" : "s"} saved in this session.`}
            </div>

            <div className="preference-tab__actions">
              <button
                type="button"
                className="profile-tab__button profile-tab__button--primary"
                onClick={handleSavePreferences}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Preferences"}
              </button>
            </div>

            {savedMessage ? (
              <p className="preference-tab__status">{savedMessage}</p>
            ) : null}
          </div>
        </section>
      </>
    );
};

export default PreferenceTab;