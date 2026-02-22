import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

# VALID data
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

# INVALID email
def test_signup_sad():
    response = client.post("/signup", json = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe",
        "password": "Password123!"
    })

    assert response.status_code == 422