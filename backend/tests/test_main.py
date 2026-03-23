import sys
from pathlib import Path
from services.skill_extraction.normalizer import normalize_text
from services.skill_extraction.extractor import extract_skills_from_text

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
    text = "Hello \nWorld \n   this\n is\n messy" + "\n" * 4 + "End"
    response = normalize_text(text)
    assert response == "hello world this is messy end"




