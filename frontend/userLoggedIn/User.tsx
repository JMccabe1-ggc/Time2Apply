import { useState } from "react";
import Header from "./Header";
import "./User.css";
const User = () => {

    const [minSalary, setMinSalary] = useState(20000);
    const [maxSalary, setMaxSalary] = useState(150000);


    return(


        <div className="user-page">
            <Header />
            <div className="user-layout">
                <aside className="user-aside">
                    <div>
                        <h2>Filters</h2>
                        <h4>Search</h4>
                        <label htmlFor="search">Job Title, Company, Keywords</label>
                        <input type="text" name="search" id="search" />
                        <label htmlFor="location">Location</label>
                        <input type="text" name="location" id="location" />
                        <hr />
                        <label htmlFor="">Job Type</label>
                        
                        <input type="checkbox" name="fullTime" id="fullTime" checked />Full Time
                        <br />
                        <input type="checkbox" name="partTime" id="partTime" checked />Part Time
                        <br />
                        <input type="checkbox" name="contract" id="contract" checked />Contract
                        <br />
                        <input type="checkbox" name="internship" id="internship" checked />Internship
                        <br />
                        <hr />

                        <label htmlFor="">Job Site</label>

                        <input type="checkbox" name="" id="" checked/>LinkedIn
                        <br />
                        <input type="checkbox" name="" id="" checked/>Indeed
                        <br />
                        <input type="checkbox" name="" id="" checked />Handshake 
                        <br />
                        <input type="checkbox" name="" id="" checked />Monster 
                        <br /><hr />

                        <label htmlFor="">Application Type</label>
                        
                        <input type="checkbox" name="" id="" checked/>Easy Apply
                        <br />
                        <input type="checkbox" name="" id="" checked/>External Apply
                        <br />
                        <input type="checkbox" name="" id="" checked/>Questionaire 
                        <br />
                        <hr />
                        <label htmlFor="">Salary Range</label>


<div>
    {/* Min Slider */}
    <input
        type="range"
        min={0}
        max={200000}
        step={1000}
        value={minSalary}
        onChange={(e) =>
            setMinSalary(Math.min(Number(e.target.value), maxSalary - 1000))
        }
    />

    {/* Max Slider */}
    <input
        type="range"
        min={0}
        max={200000}
        step={1000}
        value={maxSalary}
        onChange={(e) =>
            setMaxSalary(Math.max(Number(e.target.value), minSalary + 1000))
        }
    />
</div>

<label htmlFor="salaryRange">{`${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()}`}</label>

                    </div>
                </aside>



                <main className="user-main">
                    <h2>Results</h2>
                </main>
            </div>
        </div>
    );
};

export default User;