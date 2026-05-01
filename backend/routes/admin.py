from fastapi import APIRouter, HTTPException, status, BackgroundTasks, Depends, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import csv
import io
from fastapi.responses import StreamingResponse
from db import supabase
from auth import hash_password, verify_password, get_current_admin
from sid_generator import generate_sid
from pass_generator import generate_pass
from email_service import send_pass_email, send_batch_emails
from utils.csv_import import map_gforms_row
from utils.csv_export import export_attendees_csv

router = APIRouter()

class AdminLoginRequest(BaseModel):
    email: str
    password: str

class AdminSetupRequest(BaseModel):
    email: str
    password: str

def check_admin_exists():
    response = supabase.table("admin_users").select("id").execute()
    return len(response.data) > 0

def reg_type_label(reg_type: str) -> str:
    return "ON-SPOT" if reg_type == "onspot" else "PRE-REGISTERED"

@router.post("/admin/setup", status_code=status.HTTP_201_CREATED)
async def setup_admin(request: AdminSetupRequest):
    if check_admin_exists():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin already exists"
        )

    hashed_password = hash_password(request.password)
    admin_data = {
        "email": request.email,
        "hashed_password": hashed_password
    }

    response = supabase.table("admin_users").insert(admin_data).execute()
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create admin"
        )

    return {"message": "Admin account created"}

@router.post("/admin/login")
async def login_admin(request: AdminLoginRequest):
    admin_check = supabase.table("admin_users").select("*").eq("email", request.email).execute()

    if not admin_check.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    admin = admin_check.data[0]
    if not verify_password(request.password, admin["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    from auth import create_token
    token = create_token(request.email, "admin")

    return {"access_token": token, "token_type": "bearer"}

@router.get("/admin/stats")
async def get_stats(_: dict = Depends(get_current_admin)):
    response = supabase.table("attendees").select("*").execute()

    total_pre = 0
    total_onspot = 0
    approved = 0
    pending = 0
    rejected = 0
    attended = 0

    for attendee in response.data:
        if attendee.get("reg_type") == "pre":
            total_pre += 1
        elif attendee.get("reg_type") == "onspot":
            total_onspot += 1

        status_value = attendee.get("status")
        if status_value == "approved":
            approved += 1
        elif status_value == "pending":
            pending += 1
        elif status_value == "rejected":
            rejected += 1

        if attendee.get("attended"):
            attended += 1

    return {
        "total_pre_registered": total_pre,
        "total_onspot": total_onspot,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
        "attended": attended
    }

@router.get("/admin/registrations")
async def get_registrations(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    reg_type: Optional[str] = None,
    status: Optional[str] = None,
    academic_level: Optional[str] = None,
    stream: Optional[str] = None,
    _: dict = Depends(get_current_admin)
):
    query = supabase.table("attendees").select("*", count="exact")

    if reg_type:
        query = query.eq("reg_type", reg_type)
    if status:
        query = query.eq("status", status)
    if academic_level:
        query = query.eq("academic_level", academic_level)
    if stream:
        query = query.eq("stream", stream)
    if search:
        search_value = f"%{search}%"
        query = query.or_(
            f"full_name.ilike.{search_value},phone.ilike.{search_value},sid.ilike.{search_value}"
        )

    offset = (page - 1) * limit
    response = query.range(offset, offset + limit - 1).execute()

    return {
        "data": response.data,
        "page": page,
        "limit": limit,
        "total": response.count or 0
    }

@router.put("/admin/approve/{attendee_id}")
async def approve_attendee(attendee_id: str, background_tasks: BackgroundTasks, _: dict = Depends(get_current_admin)):
    attendee_response = supabase.table("attendees").select("*").eq("id", attendee_id).execute()
    if not attendee_response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendee not found"
        )

    attendee = attendee_response.data[0]
    if attendee.get("status") == "approved" and attendee.get("sid"):
        return {"message": "Attendee already approved", "sid": attendee["sid"]}

    sid = attendee.get("sid") or generate_sid(attendee["academic_level"])

    update_response = supabase.table("attendees").update({
        "sid": sid,
        "status": "approved"
    }).eq("id", attendee_id).execute()

    if not update_response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve attendee"
        )

    pass_image = generate_pass(
        academic_level=attendee["academic_level"],
        full_name=attendee["full_name"],
        stream=attendee["stream"],
        sid=sid,
        reg_type=reg_type_label(attendee.get("reg_type", "pre"))
    )

    background_tasks.add_task(
        send_pass_email,
        attendee["email"],
        attendee["full_name"],
        sid,
        pass_image,
        reg_type_label(attendee.get("reg_type", "pre"))
    )

    return {"message": "Attendee approved", "sid": sid}

@router.put("/admin/reject/{attendee_id}")
async def reject_attendee(attendee_id: str, _: dict = Depends(get_current_admin)):
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
async def resend_pass(attendee_id: str, background_tasks: BackgroundTasks, _: dict = Depends(get_current_admin)):
    attendee_response = supabase.table("attendees").select("*").eq("id", attendee_id).eq("status", "approved").execute()

    if not attendee_response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approved attendee not found"
        )

    attendee = attendee_response.data[0]
    if not attendee.get("sid"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot resend without SID"
        )

    pass_image = generate_pass(
        academic_level=attendee["academic_level"],
        full_name=attendee["full_name"],
        stream=attendee["stream"],
        sid=attendee["sid"],
        reg_type=reg_type_label(attendee.get("reg_type", "pre"))
    )

    background_tasks.add_task(
        send_pass_email,
        attendee["email"],
        attendee["full_name"],
        attendee["sid"],
        pass_image,
        reg_type_label(attendee.get("reg_type", "pre"))
    )

    return {"message": "Pass resent successfully"}

@router.post("/admin/resend-all")
async def resend_all_passes(background_tasks: BackgroundTasks, _: dict = Depends(get_current_admin)):
    attendees = supabase.table("attendees").select("*").eq("status", "approved").execute()
    background_tasks.add_task(send_batch_emails, attendees.data, 0)

    return {"message": f"Queued resend for {len(attendees.data)} attendees"}

@router.get("/admin/attendance")
async def get_attendance(_: dict = Depends(get_current_admin)):
    response = supabase.table("attendees").select("*").eq("attended", True).order("attended_at", desc=True).execute()
    return response.data

@router.get("/admin/export/all")
async def export_all(_: dict = Depends(get_current_admin)):
    response = supabase.table("attendees").select("*").execute()
    csv_content = export_attendees_csv(response.data, export_type="all")
    return StreamingResponse(
        io.BytesIO(csv_content.encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=registrations.csv"}
    )

@router.get("/admin/export/attended")
async def export_attended(_: dict = Depends(get_current_admin)):
    response = supabase.table("attendees").select("*").eq("attended", True).execute()
    csv_content = export_attendees_csv(response.data, export_type="attended")
    return StreamingResponse(
        io.BytesIO(csv_content.encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=attended.csv"}
    )

@router.post("/admin/import")
async def import_registrations(file: UploadFile = File(...), _: dict = Depends(get_current_admin)):
    content = await file.read()
    decoded = content.decode("utf-8", errors="ignore")
    reader = csv.DictReader(io.StringIO(decoded))

    inserted = 0
    skipped = 0
    errors = []

    for row in reader:
        mapped = map_gforms_row(row)
        if not mapped:
            skipped += 1
            continue

        try:
            response = supabase.table("attendees").insert(mapped).execute()
            if response.data:
                inserted += 1
            else:
                skipped += 1
        except Exception as exc:
            errors.append(str(exc))
            skipped += 1

    return {
        "message": "Registrations imported successfully",
        "count": inserted,
        "skipped": skipped,
        "errors": errors
    }