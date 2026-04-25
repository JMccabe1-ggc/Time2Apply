
import { useNavigate } from "react-router-dom";
import "./ui/Header.css";
import supabase from "@/lib/supabase";

const Header = () => {
    const navigate = useNavigate();

    const handleSignOutEverywhere = async () => {
        await supabase.auth.signOut({ scope: "global" });
         navigate("/login", {replace: true});
         const {data} = await supabase.auth.getSession();
         console.log("session after logout", data.session);
    };

    const goToSearch = () => {
        navigate("/user");
    };

    const goToApplications = () => {
        navigate("/applications");
    }

    const goToResume = () => {
        navigate("/resume");
    };

    const goToProfile = () => {
        navigate("/profile");
    };

    return(
        <div className="sticky top-0 z-50 backdrop-blur">
        <header className="user-header">
            <h3 className="user-header__title">Time2Apply</h3>
            <nav className="user-header__nav" aria-label="Primary">
                <ul>
                    <li><button onClick={goToSearch}>Search</button></li>
                    <li><button onClick={goToApplications}>Applications</button></li>
                    <li><button onClick={goToResume}>Resume</button></li>
                    <li><button onClick={goToProfile}>Profile</button></li>
                </ul>
            </nav>
            <button className="user-header__signout" onClick={handleSignOutEverywhere}>Sign Out</button>
        </header>
        </div>
    );
};

export default Header;