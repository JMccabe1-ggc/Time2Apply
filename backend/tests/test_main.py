import sys
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from main import app
from services.skill_extraction.normalizer import normalize_text

client = TestClient(app)

AUTH_USER_ID = "auth-user-123"
AUTH_HEADER = {"Authorization": "Bearer valid-token"}


class FakeQuery:
    def __init__(self, execute_return=None):
        self.execute_return = execute_return or SimpleNamespace(data=[])
        self.calls = []

    def _record(self, name, *args, **kwargs):
        self.calls.append((name, args, kwargs))
        return self

    def select(self, *args, **kwargs):
        return self._record("select", *args, **kwargs)

    def insert(self, *args, **kwargs):
        return self._record("insert", *args, **kwargs)

    def update(self, *args, **kwargs):
        return self._record("update", *args, **kwargs)

    def delete(self, *args, **kwargs):
        return self._record("delete", *args, **kwargs)

    def upsert(self, *args, **kwargs):
        return self._record("upsert", *args, **kwargs)

    def eq(self, *args, **kwargs):
        return self._record("eq", *args, **kwargs)

    def in_(self, *args, **kwargs):
        return self._record("in_", *args, **kwargs)

    def order(self, *args, **kwargs):
        return self._record("order", *args, **kwargs)

    def limit(self, *args, **kwargs):
        return self._record("limit", *args, **kwargs)

    def single(self, *args, **kwargs):
        return self._record("single", *args, **kwargs)

    def execute(self):
        self.calls.append(("execute", tuple(), {}))
        return self.execute_return


def make_table_side_effect(table_queries):
    def side_effect(table_name):
        queries = table_queries.get(table_name)
        if not queries:
            raise AssertionError(f"Unexpected table access: {table_name}")
        return queries.pop(0)

    return side_effect


def find_call(query: FakeQuery, method_name: str):
    for recorded_name, args, kwargs in query.calls:
        if recorded_name == method_name:
            return args, kwargs
    raise AssertionError(f"Call {method_name!r} not found. Recorded calls: {query.calls}")


def eq_calls(query: FakeQuery):
    return [args for name, args, _ in query.calls if name == "eq"]


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("main.supabase")
def test_missing_authorization_header_returns_401(mock_supabase):
    response = client.post(
        "/resume/upload",
        files={"file": ("resume.pdf", b"fake-pdf", "application/pdf")},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Missing Authorization header"
    mock_supabase.auth.get_user.assert_not_called()


@patch("main.supabase")
def test_invalid_token_returns_401(mock_supabase):
    mock_supabase.auth.get_user.side_effect = Exception("bad jwt")

    response = client.get("/resume", headers={"Authorization": "Bearer fake-token"})

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired access token"


@patch("main.extract_skills_from_text")
@patch("main.generate_embedding")
@patch("main.fitz.open")
@patch("main.supabase")
def test_resume_upload_uses_authenticated_user_id(
    mock_supabase,
    mock_fitz_open,
    mock_generate_embedding,
    mock_extract_skills,
):
    mock_supabase.auth.get_user.return_value.user.id = AUTH_USER_ID
    mock_generate_embedding.return_value = [0.1, 0.2]
    mock_extract_skills.return_value = ["python"]

    class FakeDoc(list):
        def close(self):
            return None

    mock_fitz_open.return_value = FakeDoc(
        [SimpleNamespace(get_text=lambda: "Experienced Python engineer " * 10)]
    )

    deactivate_resume_query = FakeQuery(SimpleNamespace(data=[]))
    insert_resume_query = FakeQuery(SimpleNamespace(data=[{"id": "resume-1"}]))
    lookup_skill_query = FakeQuery(SimpleNamespace(data={"id": "skill-1"}))
    insert_resume_skill_query = FakeQuery(SimpleNamespace(data=[]))

    mock_supabase.table.side_effect = make_table_side_effect(
        {
            "resumes": [deactivate_resume_query, insert_resume_query],
            "skills": [lookup_skill_query],
            "resume_skills": [insert_resume_skill_query],
        }
    )

    response = client.post(
        "/resume/upload",
        headers=AUTH_HEADER,
        files={"file": ("resume.pdf", b"fake-pdf", "application/pdf")},
    )

    assert response.status_code == 200
    assert response.json()["resume_id"] == "resume-1"
    assert ("user_id", AUTH_USER_ID) in eq_calls(deactivate_resume_query)

    insert_args, _ = find_call(insert_resume_query, "insert")
    assert insert_args[0]["user_id"] == AUTH_USER_ID


@patch("main.supabase")
def test_job_search_fetches_active_resume_for_authenticated_user(mock_supabase):
    mock_supabase.auth.get_user.return_value.user.id = AUTH_USER_ID

    active_resume_query = FakeQuery(
        SimpleNamespace(data=[{"id": "resume-1", "embedding": [0.1, 0.2]}])
    )
    resume_skills_query = FakeQuery(SimpleNamespace(data=[]))
    search_queries_query = FakeQuery(
        SimpleNamespace(
            data=[
                {
                    "id": "search-1",
                    "expires_at": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
                }
            ]
        )
    )
    search_results_query = FakeQuery(SimpleNamespace(data=[]))

    mock_supabase.table.side_effect = make_table_side_effect(
        {
            "resumes": [active_resume_query],
            "resume_skills": [resume_skills_query],
            "search_queries": [search_queries_query],
            "search_results": [search_results_query],
        }
    )

    response = client.post(
        "/jobs/search",
        headers=AUTH_HEADER,
        json={"title": "Engineer", "location": "Boston"},
    )

    assert response.status_code == 200
    assert response.json() == {"source": "cache", "jobs": []}
    assert ("user_id", AUTH_USER_ID) in eq_calls(active_resume_query)


# VALID data and VALID PASSWORD
@patch("main.supabase")
def test_signup_happy(mock_supabase):
    mock_supabase.auth.admin.create_user.return_value.user.id = "123"
    mock_supabase.table().insert().execute.return_value = {}

    response = client.post(
        "/signup",
        json={
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "password": "Password123!",
        },
    )

    assert response.status_code == 200
    assert response.json()["user_id"] == "123"
    assert response.json()["message"] == "Account created successfully "


test_password_data = [
    ("not12char", 400, "Password must be at least 12 characters long."),
    ("no_capitalize_letter", 400, "Password must include at least one uppercase letter."),
    ("THERE_is_no_numbers", 400, "Password must include at least one number."),
    ("N0SpecialCharacters", 400, "Password must include at least one special character."),
]


@pytest.mark.parametrize("password, expected_status_code, detail", test_password_data)
def test_signup_sad_password(password, expected_status_code, detail):
    response = client.post(
        "/signup",
        json={
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "password": password,
        },
    )

    assert response.status_code == expected_status_code
    assert response.json()["detail"] == detail


def test_signup_sad_email():
    response = client.post(
        "/signup",
        json={
            "firstName": "John",
            "lastName": "Doe",
            "email": "johndoe",
            "password": "Password123!",
        },
    )

    assert response.status_code == 422


@patch("main.supabase")
def test_login_happy(mock_supabase):
    mock_supabase.auth.sign_in_with_password.return_value.user.id = "123"
    mock_supabase.auth.sign_in_with_password.return_value.session.access_token = "fake_token"

    response = client.post(
        "/login",
        json={"email": "johndoe@example.com", "password": "password123"},
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Login successful"
    assert response.json()["user_id"] == "123"
    assert response.json()["access_token"] == "fake_token"


@patch("main.supabase")
def test_login_sad(mock_supabase):
    mock_supabase.auth.sign_in_with_password.side_effect = Exception("Invalid Credential")

    response = client.post(
        "/login",
        json={"email": "johndoe@example.com", "password": "password123"},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid Credential"


def test_normalize_text():
    text = "Hello \nWorld \n   this\n is\n messy" + "\n" * 4 + "End"
    response = normalize_text(text)
    assert response == "hello world this is messy end"
