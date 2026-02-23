from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from config.client import supabase  
import re

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