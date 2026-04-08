from fastapi import FastAPI, HTTPException, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from config.client import supabase  
import re
from datetime import datetime, timedelta
import requests
import os
import fitz
import json
from services.embedding.encoder import generate_embedding

from services.matching.engine import compute_match

from services.skill_extraction.extractor import extract_skills_from_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000"],
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

@app.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):

    # validating
    if file.content_type != "application/pdf":
        raise HTTPException(status_code= 400, detail = "You uploaded non PDF file, only pdf files allowed")
    
    file_bytes = await file.read()

    if len(file_bytes) > (5 * 1024 * 1024) :
        raise HTTPException(status_code=400, detail="File size is too big")
    
    # extract the text
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        raw_text = ""
        for text in doc:
            raw_text += text.get_text()
        doc.close()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid PDF file")
    
    if len(raw_text.strip()) < 100:
        raise HTTPException(status_code=400, detail="Unreadable PDF")
    
    # Clean text
    cleaned_text = re.sub(r'\s+', ' ', raw_text).strip()

    # Get the embedding from the clean text
    embedding = generate_embedding(cleaned_text)

    # Deactivate old resumes
    supabase.table("resumes") \
        .update({"is_active": False}) \
        .eq("user_id", "4f81add4-3bf6-45d3-911a-2082d2b5ef51") \
        .execute()

    # Insert new resume
    insert_res = supabase.table("resumes").insert({
        # "user_id": current_user.id,
        "user_id": "4f81add4-3bf6-45d3-911a-2082d2b5ef51",
        "file_name": file.filename,
        "file_size": len(file_bytes),
        "file_path": "file_path",
        "raw_text": raw_text,
        "cleaned_text": cleaned_text,
        "embedding": embedding,
        "is_active": True
    }).execute()

    resume_id =  insert_res.data[0]["id"]

    skills = extract_skills_from_text(cleaned_text)

    # print(type(embedding), embedding[:5])


    for skill in skills:

        skill_row = (
            supabase.table("skills")
            .select("id")
            .eq("skill_name", skill)
            .single()
            .execute()
        )

        skill_id = skill_row.data["id"]

        supabase.table("resume_skills").insert({
            "resume_id": resume_id,
            "skill_id": skill_id
        }).execute()


    return {
        "message": "Resume uploaded successfully",
        "resume_id": resume_id,
        "skills_extracted": skills
    }
    

@app.get("/resume/active/skills")
async def get_active_resume_skills():
    resume_res = (
        supabase.table("resumes")
        .select("id")
        .eq("user_id", "4f81add4-3bf6-45d3-911a-2082d2b5ef51")
        .eq("is_active", True)
        .single()
        .execute()
    )

    if not resume_res.data:
        return {"skills": []}

    resume_id = resume_res.data["id"]

    resume_skills_res = (
        supabase.table("resume_skills")
        .select("skill_id")
        .eq("resume_id", resume_id)
        .execute()
    )

    skill_ids = [row["skill_id"] for row in resume_skills_res.data]

    if not skill_ids:
        return {"skills": []}

    skills_res = (
        supabase.table("skills")
        .select("skill_name")
        .in_("id", skill_ids)
        .execute()
    )

    skills = [row["skill_name"] for row in skills_res.data]

    return {"skills": skills}  

@app.post("/jobs/search")
def search_job(data: JobSearchQuery):

# Get the active resume for the job match %
    resume_res = (
        supabase.table("resumes")
        .select("*")
        .eq("user_id", "4f81add4-3bf6-45d3-911a-2082d2b5ef51")
        .eq("is_active", True)
        .limit(1)
        .execute()
    )

    active_resume = resume_res.data[0] if resume_res.data else None

    resume_skills = set()

    if active_resume:
        skills_res = (
            supabase.table("resume_skills")
            .select("skills(skill_name)")
            .eq("resume_id", active_resume["id"])
            .execute()
        )

        resume_skills = {
            item["skills"]["skill_name"]
            for item in skills_res.data
        }

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

    # check if table exist and still populated
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

            jobs_list = [item["jobs"] for item in jobs.data]

            enriched_jobs = attach_match_data(
                jobs_list,
                active_resume,
                resume_skills
            )

            return {
                "source": "cache",
                "jobs": enriched_jobs
            }
    
    # The search query is empty and already expired, CALL the API
    try:
        api_jobs = call_jsearch_api(normalize_query, normalize_location)
    except Exception as e:
        raise HTTPException(status_code=500, detail="External API failed")
    
    expires_at = now + timedelta(hours=12)

    # This is if data exist but expired
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

        job_skills = extract_skills_from_text(job["description"] or "")
        job_embedding = generate_embedding(job["description"] or "")

        # print(type(job_embedding), job_embedding[:5])

        # Upsert job
        job_insert = (
            supabase.table("jobs")
            .upsert({
                "external_job_id": job["external_id"],
                "title": job["title"],
                "company": job["company"],
                "location": job["location"],
                "publisher": job["publisher"],
                "description": job["description"],
                "salary_min": job.get("salary_min"),
                "salary_max": job.get("salary_max"),
                "job_type": job.get("job_type"),
                "posted_date": job.get("posted_date"),
                "apply_url": job.get("apply_url"),
                "source": "jsearch",
                "raw_data": job,
                "embedding": job_embedding,
                "fetched_at": now.isoformat()
            }, on_conflict="external_job_id,source")
            .execute()
        )

        job_id = job_insert.data[0]["id"]

        # job_skills_res = (
        #     supabase.table("job_skills")
        #     .select("skills(skill_name)")
        #     .eq("job_id", job_id)
        #     .execute()
        # )

        # job_skills = {
        #     item["skills"]["skill_name"] for item in job_skills_res.data
        # }

        # 
        job_skills = set(job_skills)

        for skill in job_skills:
            skill_row = (
                supabase.table("skills")
                .select("id")
                .eq("skill_name", skill)
                .single()
                .execute()
            )

            if not skill_row.data:
                continue

            skill_id = skill_row.data["id"]

            existing = supabase.table("job_skills") \
                .select("id") \
                .eq("job_id", job_id) \
                .eq("skill_id", skill_id) \
                .execute()

            if not existing.data:
                supabase.table("job_skills").insert({
                    "job_id": job_id,
                    "skill_id": skill_id
                }).execute()

            # if not existing_skill.data:
            #     supabase.table("job_skills").insert({
            #         "job_id": job_id,
            #         "skill_id": skill_id
            #     }).execute()

        # JOB MATCHING
        
        resume_embedding = parse_embedding(active_resume.get("embedding") if active_resume else None)

        if resume_embedding and job_embedding:
            match_result = compute_match(
                resume_embedding,
                job_embedding,
                resume_skills,
                job_skills
            )
        else:
            match_result = {
                "match_percentage": 0,
                "matched_skills": [],
                "missing_skills": []
            }

        job["match"] = match_result

        # Link search to job
        supabase.table("search_results").insert({
            "search_query_id": search_query_id,
            "job_id": job_id
        }).execute()

    return {
        "source": "api",
        "jobs": api_jobs
    }

def call_jsearch_api(query: str, location: str, radius: int = 25):
    url = "https://jsearch.p.rapidapi.com/search"

    query_string = {
        "query": query,
        "location": location,
        "radius": radius
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
            "publisher": job.get("job_publisher"),
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

# data pipeline to attch match % to job data
def attach_match_data(jobs, active_resume, resume_skills):
    enriched_jobs = []

    resume_embedding = parse_embedding(active_resume.get("embedding") if active_resume else None)

    for job in jobs:

        job_embedding = parse_embedding(job.get("embedding"))

        # fallback: if missing embedding, skip
        if not job_embedding:
            job["match"] = {
                "match_percentage": 0,
                "matched_skills": [],
                "missing_skills": []
            }
            enriched_jobs.append(job)
            continue

        # get job skills from DB
        job_skills_res = (
            supabase.table("job_skills")
            .select("skills(skill_name)")
            .eq("job_id", job["id"])
            .execute()
        )

        job_skills = {
            item["skills"]["skill_name"]
            for item in job_skills_res.data
        }

        if resume_embedding:
            match_result = compute_match(
                resume_embedding,
                job_embedding,
                resume_skills,
                job_skills
            )
        else:
            match_result = {
                "match_percentage": 0,
                "matched_skills": [],
                "missing_skills": []
            }

        job["match"] = match_result
        enriched_jobs.append(job)

    return enriched_jobs

def parse_embedding(embedding):
    if embedding is None:
        return None

    # list -> float
    if isinstance(embedding, list):
        return [float(x) for x in embedding]
    
    if isinstance(embedding, str):
        return json.loads(embedding)

    raise ValueError("Invalid embedding format")

@app.get("/embed/test")
def get_embed():

    resume_res = (
        supabase.table("resumes")
        .select("*")
        .eq("user_id", "4f81add4-3bf6-45d3-911a-2082d2b5ef51")
        .eq("is_active", True)
        .limit(1)
        .execute()
    )

    active_resume = resume_res.data[0] if resume_res.data else None
    test_resume_embedding = active_resume["embedding"]
    return {
        "embedding": test_resume_embedding
    }

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