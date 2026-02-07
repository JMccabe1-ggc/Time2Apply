import Header from "./Header";

const Resume = () => {

    

    return(
        <>
        <Header />
        <h1>Upload your resume</h1>
        <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
        <hr />
        <button>Click here to parse</button>
        <br />
        <label htmlFor="">Name: </label>
        <br />
        <label htmlFor="">Phone Number: </label>
        <br />
        <label htmlFor="">Email: </label>
        <br />
        <label htmlFor="">Education: </label>
        <br />
        <label htmlFor="">Experience: </label>
        <br />
        <label htmlFor="">Skills: </label>
        <br />
        <label htmlFor="">Licenses/Certification: </label>
        <br />
        <label htmlFor="">References: </label>
        
        </>
    );
};

export default Resume;