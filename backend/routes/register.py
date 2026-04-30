from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from db import supabase
from typing import Optional

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
    reg_type: Optional[str] = "pre"
    status: Optional[str] = "pending"
    # Additional optional fields
    year_of_passing: Optional[int] = None
    course: Optional[str] = None
    specialization: Optional[str] = None
    current_year: Optional[int] = None
    company_name: Optional[str] = None
    designation: Optional[str] = None
    years_of_experience: Optional[int] = None
    # Professional fields
    company_address: Optional[str] = None
    company_phone: Optional[str] = None

@router.post("/register")
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
    
    # Insert the registration data
    registration_data = {
        "full_name": registration.full_name,
        "phone": registration.phone,
        "email": registration.email,
        "college_name": registration.college_name,
        "academic_level": registration.academic_level,
        "stream": registration.stream,
        "attendee_type": registration.attendee_type,
        "status": registration.status,
        "reg_type": registration.reg_type,
        "year_of_passing": registration.year_of_passing,
        "course": registration.course,
        "specialization": registration.specialization,
        "current_year": registration.current_year,
        "company_name": registration.company_name,
        "designation": registration.designation,
        "years_of_experience": registration.years_of_experience,
        "company_address": registration.company_address,
        "company_phone": registration.company_phone
    }
    
    response = supabase.table("attendees").insert(registration_data).execute()
    
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