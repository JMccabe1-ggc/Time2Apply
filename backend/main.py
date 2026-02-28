from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from config.client import supabase  
import re
from datetime import datetime, timedelta
import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignupData(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str

class LoginData(BaseModel):
    email: EmailStr
    password: str

class JobSearchQuery(BaseModel):
    title: str
    location: str

@app.post("/jobs/search")
def search_job(data: JobSearchQuery):

    normalize_query = data.title.strip().lower()
    normalize_location = data.location.strip().lower() if data.location else None

    # Before we call the API, we check if the query exist
    existing = (
        supabase.table("search_queries")
        .select("*")
        .eq("query_text", normalize_query)
        .eq("location", normalize_location)
        .execute()
    )

    now = datetime.utcnow()

    if existing.data:
        search_row = existing.data[0]

        # Check the expiration date
        if search_row["expires_at"] and now < datetime.fromisoformat(search_row["expires_at"]):

            jobs = (
                supabase.table("search_results")
                .select("jobs(*)")
                .eq("search_query_id", search_row["id"])
                .execute()
            )

            return {
                "source": "cache",
                "jobs": [item["jobs"] for item in jobs.data]
            }
    
    # The search query is empty and already expired, CALL the API
    try:
        api_jobs = call_jsearch_api(normalize_query, normalize_location)
    except Exception as e:
        raise HTTPException(status_code=500, detail="External API failed")
    
    expires_at = now + timedelta(hours=12)

    if existing.data:
        search_query_id = search_row["id"]

        supabase.table("search_queries").update({
            "last_fetched_at": now.isoformat(),
            "expires_at": expires_at.isoformat()
        }).eq("id", search_query_id).execute()

        # Clean old mappings
        supabase.table("search_results").delete().eq("search_query_id", search_query_id).execute()

    else:
        new_search = (
            supabase.table("search_queries")
            .insert({
                "query_text": normalize_query,
                "location": normalize_location,
                "last_fetched_at": now.isoformat(),
                "expires_at": expires_at.isoformat()
            })
            .execute()
        )
        search_query_id = new_search.data[0]["id"]
    
    # Insert jobs + mapping
    for job in api_jobs:

        # Upsert job
        job_insert = (
            supabase.table("jobs")
            .upsert({
                "external_job_id": job["external_id"],
                "title": job["title"],
                "company": job["company"],
                "location": job["location"],
                "description": job["description"],
                "salary_min": job.get("salary_min"),
                "salary_max": job.get("salary_max"),
                "job_type": job.get("job_type"),
                "posted_date": job.get("posted_date"),
                "apply_url": job.get("apply_url"),
                "source": "jsearch",
                "raw_data": job,
                "fetched_at": now.isoformat()
            }, on_conflict="external_job_id,source")
            .execute()
        )

        job_id = job_insert.data[0]["id"]

        # Link search to job
        supabase.table("search_results").insert({
            "search_query_id": search_query_id,
            "job_id": job_id
        }).execute()

    return {
        "source": "api",
        "jobs": api_jobs
    }

def call_jsearch_api(query: str, location: str):
    url = "https://jsearch.p.rapidapi.com/search"

    query_string = {
        "query": query,
        "location": location
    }

    headers = {
        "X-RapidAPI-Key": os.getenv("JSEARCH_API_KEY"),
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=query_string, timeout=20)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Jsearch API Error: {str(e)}")

    data = response.json()

    jobs = []

    for job in data.get("data", []):
        jobs.append({
            "external_id": job.get("job_id"),
            "title": job.get("job_title"),
            "company": job.get("employer_name"),
            "location": job.get("job_city"),
            "description": job.get("job_description"),
            "salary_min": job.get("job_min_salary"),
            "salary_max": job.get("job_max_salary"),
            "job_type": job.get("job_employment_type"),
            "posted_date": job.get("job_posted_at_datetime_utc"),
            "apply_url": job.get("job_apply_link"),
            "raw_data": job
        })

    return jobs

@app.get("/")
def read_root():
    return {"status": "ok"}


#THIS IS PROFILES
@app.get("/profiles")
def get_profiles():
    try:
        res = supabase.table("profiles").select("*").execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/signup")
def show_signup_data():
    res = supabase.table("profiles").select("*").execute()
    return res.data

# THIS IS SIGNUP: Auth , DB insert  
@app.post("/signup")
def signup_user(data: SignupData):
    validate_password(data.password)
    try:
        # Create user WITHOUT sending confirmation email
        auth_res = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True  
        })

        user_id = auth_res.user.id

        # Insert into profiles table
        profile_res = (
            supabase.table("profiles")
            .insert({
                "full_name": f"{data.firstName} {data.lastName}",
                "email": data.email,
                "user_id": user_id,
                "current_title": None,
                "phone": None,
                "bio": None,
                "location": None,
            })
            .execute()
        )

        return {
            "message": "Account created successfully ",
            "user_id": user_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login")
def login_user(data: LoginData):
    try:
        auth_res = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
        return {
            "message": "Login successful",
            "user_id": auth_res.user.id,
            "access_token": auth_res.session.access_token
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def validate_password(password: str):
    if len(password) < 12:
        raise HTTPException(status_code=400, detail="Password must be at least 12 characters long.")

    if not re.search("[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must include at least one uppercase letter.")

    if not re.search("[0-9]", password):
        raise HTTPException(status_code=400, detail="Password must include at least one number.")

    if not re.search("[!@#$%^&*(),.?\":{}|<>_\-\\/\[\]`~+=;']", password):
        raise HTTPException(status_code=400, detail="Password must include at least one special character.")