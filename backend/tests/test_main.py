import sys
from pathlib import Path
from services.skill_extraction.normalizer import normalize_text

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
import pytest
from unittest.mock import patch
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

# VALID data and VALID PASSWORD
@patch("main.supabase")
def test_signup_happy(mock_supabase):
    mock_supabase.auth.admin.create_user.return_value.user.id = "123"
    mock_supabase.table().insert().execute.return_value = {}

    response = client.post("/signup", json = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "password": "Password123!"
    })

    assert response.status_code == 200
    assert response.json()["user_id"] == "123"
    assert response.json()["message"] == "Account created successfully "

test_password_data = [
    ("not12char", 400, "Password must be at least 12 characters long."),
    ("no_capitalize_letter", 400, "Password must include at least one uppercase letter."),
    ("THERE_is_no_numbers", 400, "Password must include at least one number."),
    ("N0SpecialCharacters", 400, "Password must include at least one special character.")
]    

@pytest.mark.parametrize("password, expected_stat_code, detail", test_password_data)
def test_signup_sad_password(password, expected_stat_code, detail):
    response = client.post("/signup", json = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "password": password
    })

    print(f"Response status: {response.status_code}\nExpected status: {expected_stat_code}")
    print(f"Response detail: {response.json()["detail"]}\nExpected detail: {detail}")
    assert response.status_code == expected_stat_code
    assert response.json()["detail"] == detail

# INVALID email
def test_signup_sad_email():
    response = client.post("/signup", json = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe",
        "password": "Password123!"
    })

    assert response.status_code == 422

# VALID email and password
@patch("main.supabase")
def test_login_happy(mock_supabase):
    # Mock user id and token
    mock_supabase.auth.sign_in_with_password.return_value.user.id = "123"
    mock_supabase.auth.sign_in_with_password.return_value.session.access_token = "fake_token"

    response = client.post("/login", json = {
        "email": "johndoe@example.com",
        "password": "password123"
    })

    assert response.json()["message"] == "Login successful"
    assert response.json()["user_id"] == "123"
    assert response.json()["access_token"] == "fake_token"

# INVALID password
@patch("main.supabase")
def test_login_sad(mock_supabase):
    mock_supabase.auth.sign_in_with_password.side_effect = Exception("Invalid Credential")

    response = client.post("/login", json = {
        "email": "johndoe@example.com",
        "password": "password123"
    })

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid Credential"

def test_normalize_text():
    text = "Claudio Carrel Sandrio 678-481-2170 | csandrio@ggc.edu | linkedin.com/in/csandrio | github.com/ClaudioSandrio Education Georgia Gwinnett College Lawrenceville, GA Bachelor of Science in Information Technology Jan. 2023 – May 2026 Technical Skills Languages: Java, Python, SQL, React, JavaScript, HTML/CSS, R, C# Frameworks: FastAPI, Selenium, Spring Boot, Node.js, Express, Mockito, REST APIs, JWT Developer Tools: GitHub, JIRA, Power BI, Unity, Visual Paradigm, Firebase Libraries & NLP/ML: spaCy, Sentence Transformers, PyMuPDF, JQuery, React Router, Jsoup, JSON Databases: PostgreSQL, Supabase, MySQL, SQLite, MongoDB Projects Time2Apply | Python, FastAPI, PyMuPDF, spaCy, PostgreSQL, REST APIs, Sentence Transformers February 2026 • Developed a resume ingestion and parsing pipeline using Python, FastAPI, and PyMuPDF to extract and normalize text from PDF resumes for downstream analysis • Implemented a deterministic skill extraction engine using NLP techniques with spaCy, transforming unstructured resume text into structured skill data stored in PostgreSQL • Built an AI-driven job recommendation system using sentence embeddings and cosine similarity to compute semantic match scores between resumes and job descriptions • Engineered a scalable data architecture including resume storage, skill extraction pipelines, and cached job search results, enabling efficient retrieval and explainable job-match recommendations Hotel Price Automation & Analysis | Java, Selenium, SQLite, Mockito, JUnit October 2025 • Developed a robust Java web scraper using Selenium WebDriver to collect and analyze 9,000+ daily hotel price points from Booking.com • Engineered a full data persistence pipeline, storing all scraped results in an SQLite database via JDBC and authoring SQL queries (ORDER BY, LIMIT) to analyze the data and generate reports on the 10 cheapest booking dates • Authored a comprehensive test suite using JUnit (@Before, @After) to ensure data integrity and validate SQL logic • Leveraged the Mockito framework to mock dependencies, enabling isolated, high-speed unit tests on the core parsing logic Artify AI | Java, DALL E, JSON, Processing January 2025 • Artify AI is an interactive platform developed using Java and Processing for drawing and coloring, integrating DALL·E API for AI-generated image outlines based on user prompts • The program uses JSON to exchange data between the app and the DALL·E API, enabling seamless image generation and display • The project empowers non-IT students to explore AI prompt engineering in interactive digital art, enhancing their understanding of color manipulation, basic programming concepts, and AI technology Work Experience Teaching Assistant, Data Science Boot Camp Oct. 2025 – Feb. 2026 Georgia Gwinnett College Lawrenceville, GA • Serve as Teaching Assistant for a 12-hour data science boot camp, guiding students through the complete data analysis pipeline from data wrangling in Pandas to visualization • Mentor students in Python, providing hands-on support for data cleaning, querying, and aggregation using Pandas and NumPy in Jupyter Notebooks • Teach core data visualization principles, helping students select the right charts (bar, line, scatter) and use tools like Power BI and Matplotlib to tell effective data stories Visual Program and Tutorial Developer Aug. 2024 – Jan. 2026 Georgia Gwinnett College Lawrenceville, GA • Developed interactive games and animations using Java and Processing to demonstrate core programming concepts (data structures, algorithm, OOP) • Designed and developed structured teaching modules, breaking down complex programming topics and recorded technical walkthroughs for video-based programming tutorials and development of games • Ported applications to web using JavaScript and p5.js for cross-platform accessibility Certification Information Technology Specialist Certification: IT Specialist - Networking & Cybersecurity Amazon Web Services: AWS Certified Cloud Practitioner"
    response = normalize_text(text)
    print(response)


