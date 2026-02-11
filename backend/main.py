from fastapi import FastAPI
from config.client import supabase
import os

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ok"}

#get
#post
#put
#delete
#update
#patch maybe


@app.get("/profiles")
def get_profiles():
    res = supabase.table("profiles").select("*").execute()
    return res.data
