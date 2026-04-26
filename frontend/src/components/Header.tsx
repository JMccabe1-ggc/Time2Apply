
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./ui/Header.css";
import supabase from "@/lib/supabase";

const Header = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSignOutEverywhere = async () => {
        await supabase.auth.signOut({ scope: "global" });
        setMenuOpen(false);
         navigate("/login", {replace: true});
         const {data} = await supabase.auth.getSession();
         console.log("session after logout", data.session);
    };

    const goToSearch = () => {
        navigate("/user");
        setMenuOpen(false);
    };

    const goToApplications = () => {
        navigate("/applications");
        setMenuOpen(false);
    }

    const goToResume = () => {
        navigate("/resume");
        setMenuOpen(false);
    };

    const goToProfile = () => {
        navigate("/profile");
        setMenuOpen(false);
    };

    return(
        <div className="sticky top-0 z-50 backdrop-blur">
        <header className="user-header">
            <div className="user-header__left">
                <h3 className="user-header__title">Time2Apply</h3>
            </div>
            <button
                type="button"
                className="user-header__menu-toggle"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                {menuOpen ? "✕" : "☰"}
            </button>
            <nav className="user-header__nav" aria-label="Primary">
                <ul>
                    <li><button onClick={goToSearch}>Search</button></li>
                    <li><button onClick={goToApplications}>Applications</button></li>
                    <li><button onClick={goToResume}>Resume</button></li>
                    <li><button onClick={goToProfile}>Profile</button></li>
                </ul>
            </nav>
            <button className="user-header__signout" onClick={handleSignOutEverywhere}>Sign Out</button>

            <nav
                className={`user-header__mobile-nav ${menuOpen ? "is-open" : ""}`}
                aria-label="Mobile Primary"
            >
                <ul>
                    <li><button onClick={goToSearch}>Search</button></li>
                    <li><button onClick={goToApplications}>Applications</button></li>
                    <li><button onClick={goToResume}>Resume</button></li>
                    <li><button onClick={goToProfile}>Profile</button></li>
                    <li className="user-header__mobile-signout">
                        <button onClick={handleSignOutEverywhere}>Sign Out</button>
                    </li>
                </ul>
            </nav>
        </header>
        </div>
    );
};

export default Header;