import { State, City, type ICity, type IState } from "country-state-city";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";

const Location = () => {
  const states: IState[] = State.getStatesOfCountry("US");

  const [selectedState, setSelectedState] = useState<string>("");
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedState || !selectedCity) {
      setError("Please select both state and city.");
    } else {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
      } else {
        const user = sessionData?.session?.user;
      console.log("LOCATION PAGE ACTIVE EMAIL:", user?.email);
      console.log("LOCATION PAGE ACTIVE USER ID:", user?.id);
        if (!user) {
          setError("No logged-in user found.");
        } else {
    const stateName =
    states.find((state) => state.isoCode === selectedState)?.name || "";

   const fullLocation = `${selectedCity}, ${stateName}`;

   console.log("SAVE USER ID:", user.id);
   console.log("SAVE EMAIL:", user.email);
   console.log("FULL LOCATION:", fullLocation);

const { data: savedRow, error: saveError } = await supabase
  .from("profiles")
  .upsert(
    {
      user_id: user.id,
      email: user.email,
      location: fullLocation,
    },
    { onConflict: "user_id" }
  )
  .select()
  .single();

console.log("SAVED ROW:", savedRow);
console.log("SAVE ERROR:", saveError);

if (saveError) {
  setError(saveError.message);
} else {
  setError(null);
  navigate("/user");
}
        }
      }
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setSelectedCity("");

    if (stateCode) {
      const stateCities: ICity[] = City.getCitiesOfState("US", stateCode);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
  };
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute -top-32 right-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 left-0 w-96 h-96 bg-slate-500/20 blur-3xl rounded-full" />

      <div className="max-w-md mx-auto px-4 py-16 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Your Location
          </h1>
          <p className="text-slate-300 text-base md:text-lg">
            Set your starting location to find nearby opportunities.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 shadow-xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-slate-200 mb-2">
                State
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={handleStateChange}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-200 mb-2">
                City
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={handleCityChange}
                disabled={!selectedState}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {selectedState ? "Select a city" : "Select a state first"}
                </option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
                {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
    
    </>
  );
};


export default Location;