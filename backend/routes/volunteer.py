from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
import re
from datetime import datetime, timezone, timedelta
from db import supabase
from auth import create_volunteer_token, get_current_volunteer

router = APIRouter()

# Models
class VolunteerRegistrationRequest(BaseModel):
    full_name: str
    roll_number: str
    phone: str
    email: str
    course: str
    year: str

class VolunteerLoginRequest(BaseModel):
    roll_number: str
    email: str

class ValidateRequest(BaseModel):
    sid: str

@router.post("/volunteer/register", status_code=status.HTTP_201_CREATED)
async def register_volunteer(request: VolunteerRegistrationRequest):
    # Validate roll_number: exactly 12 alphanumeric chars
    if not re.match(r'^[a-zA-Z0-9]{12}$', request.roll_number):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Roll number must be exactly 12 alphanumeric characters"
        )
    
    # Block if roll_number already exists, regardless of status
    roll_check = supabase.table("volunteers").select("id").eq("roll_number", request.roll_number).execute()
    if roll_check.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This roll number is already registered."
        )
    
    # Insert volunteer data
    volunteer_data = {
        "full_name": request.full_name,
        "roll_number": request.roll_number,
        "phone": request.phone,
        "email": request.email,
        "course": request.course,
        "year": request.year
    }
    
    response = supabase.table("volunteers").insert(volunteer_data).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register volunteer"
        )
    
    return {"message": "Volunteer registered successfully", "id": response.data[0]["id"]}

@router.post("/volunteer/login")
async def login_volunteer(request: VolunteerLoginRequest):
    # Look up by roll_number
    volunteer_check = supabase.table("volunteers").select("*").eq("roll_number", request.roll_number).execute()
    
    if not volunteer_check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Volunteer not found"
        )
    
    volunteer = volunteer_check.data[0]
    
    # Verify email matches
    if volunteer["email"] != request.email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email does not match"
        )
    
    # Create volunteer token
    token = create_volunteer_token(request.roll_number, str(volunteer["id"]))
    
    return {"access_token": token, "token_type": "bearer"}

@router.post("/volunteer/validate")
async def validate_attendee(request: ValidateRequest, current_volunteer: dict = Depends(get_current_volunteer)):
    # Check if SID exists
    attendee_check = supabase.table("attendees").select("*").eq("sid", request.sid).execute()
    
    if not attendee_check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendee not found"
        )
    
    attendee = attendee_check.data[0]
    
    # Check if already attended
    if attendee.get("attended", False):
        # Return duplicate warning with IST time
        IST = timezone(timedelta(hours=5, minutes=30))
        attended_at = attendee["attended_at"]
        if isinstance(attended_at, str):
            attended_at = datetime.fromisoformat(attended_at.replace('Z', '+00:00'))
        ist_time = attended_at.astimezone(IST).strftime("%I:%M %p IST")
        
        return {
            "message": "Duplicate validation attempt",
            "warning": f"Already attended at {ist_time}",
            "attendee": {
                "name": attendee["full_name"],
                "academic_level": attendee["academic_level"],
                "stream": attendee["stream"],
                "reg_type": attendee["reg_type"]
            }
        }
    
    # Set attended=true, attended_at=NOW(), validated_by=volunteer.id
    # For now, we'll use a placeholder for volunteer_id since we don't have access to the current volunteer
    # In a real implementation, you would get the volunteer_id from the token
    response = supabase.table("attendees").update({
        "attended": True,
        "attended_at": datetime.utcnow().isoformat(),
        "validated_by": current_volunteer.get("volunteer_id")
    }).eq("sid", request.sid).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update attendance"
        )
    
    # Return attendee details instantly
    return {
        "message": "Attendance validated successfully",
        "attendee": {
            "name": attendee["full_name"],
            "academic_level": attendee["academic_level"],
            "stream": attendee["stream"],
            "reg_type": attendee["reg_type"]
        }
    }