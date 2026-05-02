from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from db import supabase
from typing import Optional
from sid_generator import generate_sid

router = APIRouter()

class RegistrationRequest(BaseModel):
    full_name: str
    phone: str
    email: str
    college_name: str
    academic_level: str
    stream: str
    attendee_type: str
    # Optional fields
    principal_name: Optional[str] = None
    principal_email: Optional[str] = None
    coordinator_name: Optional[str] = None
    coordinator_phone: Optional[str] = None
    coordinator_email: Optional[str] = None
    mba_specialization: Optional[str] = None
    stream_other: Optional[str] = None
    # Professional fields
    company_name: Optional[str] = None
    designation: Optional[str] = None
    experience_years: Optional[float] = None
    graduation_college: Optional[str] = None
    graduation_stream: Optional[str] = None
    graduation_year: Optional[int] = None

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_attendee(registration: RegistrationRequest):
    # If attendee_type is professional, auto-set academic_level and stream
    if registration.attendee_type == 'professional':
        registration.academic_level = 'Professional'
        registration.stream = 'N/A'
    
    # Check phone uniqueness
    phone_check = supabase.table("attendees").select("id").eq("phone", registration.phone).execute()
    if phone_check.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Phone number already registered"
        )
    
    # Check email uniqueness
    email_check = supabase.table("attendees").select("id").eq("email", registration.email).execute()
    if email_check.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Generate a unique SID
    sid = generate_sid(registration.academic_level)

    # Insert the registration data
    registration_data = {
        "full_name": registration.full_name,
        "phone": registration.phone,
        "email": registration.email,
        "college_name": registration.college_name,
        "academic_level": registration.academic_level,
        "stream": registration.stream,
        "attendee_type": registration.attendee_type,
        "sid": sid,
        "status": "pending",
        "reg_type": "pre",
        "principal_name": registration.principal_name,
        "principal_email": registration.principal_email,
        "coordinator_name": registration.coordinator_name,
        "coordinator_phone": registration.coordinator_phone,
        "coordinator_email": registration.coordinator_email,
        "mba_specialization": registration.mba_specialization,
        "stream_other": registration.stream_other,
        "company_name": registration.company_name,
        "designation": registration.designation,
        "experience_years": registration.experience_years,
        "graduation_college": registration.graduation_college,
        "graduation_stream": registration.graduation_stream,
        "graduation_year": registration.graduation_year
    }
    
    try:
        response = supabase.table("attendees").insert(registration_data).execute()
    except Exception as e:
        print(f"Error inserting attendee: {e}")
        if "row-level security" in str(e) or "42501" in str(e):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Supabase RLS Policy Error: Please use the service_role key as your SUPABASE_KEY in the backend/.env, or add the INSERT policy on the attendees table in Supabase."
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register attendee"
        )
    
    return {
        "message": "Registration successful",
        "id": response.data[0]["id"],
        "status": "pending"
    }