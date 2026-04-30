from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from db import supabase
from sid_generator import generate_sid
from PIL import Image
import io
import qrcode
import httpx
import os
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()

router = APIRouter()

class OnSpotRegistrationRequest(BaseModel):
    full_name: str
    phone: str
    email: str
    college_name: str
    academic_level: str
    stream: str
    attendee_type: str
    # Optional fields
    year_of_passing: Optional[int] = None
    course: Optional[str] = None
    specialization: Optional[str] = None
    current_year: Optional[int] = None
    company_name: Optional[str] = None
    designation: Optional[str] = None
    years_of_experience: Optional[int] = None
    company_address: Optional[str] = None
    company_phone: Optional[str] = None

@router.post("/onspot")
async def register_onspot(background_tasks: BackgroundTasks, registration: OnSpotRegistrationRequest):
    # This is a public endpoint - no auth required
    return {"message": "On-spot registration successful"}