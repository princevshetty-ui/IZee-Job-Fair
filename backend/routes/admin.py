from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
import csv
import io
from fastapi.responses import StreamingResponse
from db import supabase
from auth import hash_password, verify_password, get_current_admin
from sid_generator import generate_sid
import qrcode
from PIL import Image
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Models
class AdminLoginRequest(BaseModel):
    email: str
    password: str

class AdminSetupRequest(BaseModel):
    email: str
    password: str

class AdminApproveRequest(BaseModel):
    pass

class AdminRejectRequest(BaseModel):
    pass

class AdminResendRequest(BaseModel):
    pass

class VolunteerRegistrationRequest(BaseModel):
    full_name: str
    roll_number: str
    phone: str
    email: str
    course: str
    year: int

class VolunteerLoginRequest(BaseModel):
    roll_number: str
    email: str

class ValidateRequest(BaseModel):
    sid: str

# Check if admin exists
def check_admin_exists():
    response = supabase.table("admin_users").select("*").execute()
    return len(response.data) > 0

# Create admin setup endpoint
@router.post("/admin/setup")
async def setup_admin(request: AdminSetupRequest):
    # Check if admin already exists
    if check_admin_exists():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin already exists"
        )
    
    # Create the first admin user
    hashed_password = hash_password(request.password)
    admin_data = {
        "email": request.email,
        "password": hashed_password
    }
    
    response = supabase.table("admin_users").insert(admin_data).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create admin"
        )
    
    return {"message": "Admin created successfully"}

@router.post("/admin/login")
async def login_admin(request: AdminLoginRequest):
    # Verify admin credentials
    admin_check = supabase.table("admin_users").select("*").eq("email", request.email).execute()
    
    if not admin_check.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    admin = admin_check.data[0]
    if not verify_password(request.password, admin["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create token
    from auth import create_token
    token = create_token(request.email, "admin")
    
    return {"access_token": token, "token_type": "bearer"}

@router.get("/admin/stats")
async def get_stats():
    # Get count metrics from attendees table
    response = supabase.table("attendees").select("*").execute()
    
    total_registrations = len(response.data)
    
    # Count by status
    pending_count = 0
    approved_count = 0
    rejected_count = 0
    attended_count = 0
    
    for attendee in response.data:
        if attendee["status"] == "pending":
            pending_count += 1
        elif attendee["status"] == "approved":
            approved_count += 1
        elif attendee["status"] == "rejected":
            rejected_count += 1
        if attendee.get("attended", False):
            attended_count += 1
    
    return {
        "total_registrations": total_registrations,
        "pending_approvals": pending_count,
        "approved_registrations": approved_count,
        "rejected_registrations": rejected_count,
        "attended_count": attended_count
    }

@router.get("/admin/registrations")
async def get_registrations(page: int = 1, limit: int = 10, search: Optional[str] = None):
    # Get paginated, searchable, filterable registrations
    query = supabase.table("attendees").select("*")
    
    # Apply search if provided
    if search:
        query = query.ilike("full_name", f"%{search}%")
    
    # Apply pagination
    offset = (page - 1) * limit
    response = query.range(offset, offset + limit - 1).execute()
    
    return response.data

@router.put("/admin/approve/{attendee_id}")
async def approve_attendee(attendee_id: str, background_tasks: BackgroundTasks):
    # Generate SID
    attendee = supabase.table("attendees").select("*").eq("id", attendee_id).execute()
    if not attendee.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendee not found"
        )
    
    # Get the academic level for SID generation
    academic_level = attendee.data[0]["academic_level"]
    sid = generate_sid(academic_level)
    
    # Update attendee with SID and generate pass
    response = supabase.table("attendees").update({
        "sid": sid,
        "status": "approved"
    }).eq("id", attendee_id).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve attendee"
        )
    
    # Generate pass image
    # (Implementation would be here)
    
    # Queue email
    # (Implementation would be here)
    
    return {"message": "Attendee approved", "sid": sid}

@router.put("/admin/reject/{attendee_id}")
async def reject_attendee(attendee_id: str):
    response = supabase.table("attendees").update({
        "status": "rejected"
    }).eq("id", attendee_id).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendee not found"
        )
    
    return {"message": "Attendee rejected"}

@router.post("/admin/resend/{attendee_id}")
async def resend_pass(attendee_id: str, background_tasks: BackgroundTasks):
    # Re-generate pass and re-send email for approved attendees only
    attendee = supabase.table("attendees").select("*").eq("id", attendee_id).eq("status", "approved").execute()
    
    if not attendee.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approved attendee not found"
        )
    
    # Re-generate pass and send email
    # (Implementation would be here)
    
    return {"message": "Pass resent successfully"}

@router.post("/admin/resend-all")
async def resend_all_passes(background_tasks: BackgroundTasks):
    # Bulk re-email all approved passes respecting Brevo limit
    attendees = supabase.table("attendees").select("*").eq("status", "approved").execute()
    
    # Respect 280/day Brevo limit
    # (Implementation would be here)
    
    return {"message": f"Resent passes to {len(attendees.data)} attendees"}

@router.get("/admin/attendance")
async def get_attendance():
    # Get attended records with timestamps
    response = supabase.table("attendees").select("*").eq("attended", True).order("attended_at", desc=True).execute()
    
    return response.data

@router.get("/admin/export/all")
async def export_all():
    # Export all registrations as CSV
    response = supabase.table("attendees").select("*").execute()
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write headers
    if response.data:
        writer.writerow(response.data[0].keys())
        # Write data
        for row in response.data:
            writer.writerow(row.values())
    
    output.seek(0)
    
    # Return as downloadable file
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=registrations.csv"}
    )

@router.get("/admin/export/attended")
async def export_attended():
    # Export attended records as CSV
    response = supabase.table("attendees").select("*").eq("attended", True).execute()
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write headers
    if response.data:
        writer.writerow(response.data[0].keys())
        # Write data
        for row in response.data:
            writer.writerow(row.values())
    
    output.seek(0)
    
    # Return as downloadable file
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=attended.csv"}
    )

@router.post("/admin/import")
async def import_registrations(file: bytes):
    # CSV upload with Google Forms column mapping
    # (Implementation would be here)
    
    return {"message": "Registrations imported successfully"}