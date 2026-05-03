from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.responses import Response
from db import supabase
from auth import get_current_admin
from utils.csv_export import export_attendees_csv, export_pre_register_zip, export_onspot_csv
from utils.csv_import import map_gforms_row
from pass_generator import generate_pass
from email_service import send_pass_email
from sid_generator import generate_sid
import csv
import io
import os
from pydantic import BaseModel
from auth import create_token

router = APIRouter()

class AdminLogin(BaseModel):
    email: str
    password: str

@router.post("/admin/login")
async def admin_login(login_data: AdminLogin):
    admin_email = os.getenv("ADMIN_EMAIL", "admin@izeebschool.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    
    # Strip whitespace to prevent autocomplete errors
    received_email = login_data.email.strip()
    received_password = login_data.password.strip()
    
    if received_email == admin_email and received_password == admin_password:
        token = create_token(admin_email)
        return {"access_token": token, "token_type": "bearer"}
    else:
        # We can also add a print statement to debug in the terminal
        print(f"Login failed: Expected '{admin_email}', got '{received_email}'")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/admin/stats")
async def get_stats(admin: dict = Depends(get_current_admin)):
    try:
        all_data = supabase.table("attendees").select("status, reg_type, attended").execute()
        rows = all_data.data or []
        total_pre = sum(1 for r in rows if r.get("reg_type") == "pre")
        total_onspot = sum(1 for r in rows if r.get("reg_type") == "onspot")
        approved = sum(1 for r in rows if r.get("status") == "approved")
        attended = sum(1 for r in rows if r.get("attended") is True)
        pending = sum(1 for r in rows if r.get("status") == "pending")
        rejected = sum(1 for r in rows if r.get("status") == "rejected")
        return {
            "total_pre_registered": total_pre,
            "total_onspot": total_onspot,
            "approved": approved,
            "attended": attended,
            "pending": pending,
            "rejected": rejected
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/registrations")
async def get_registrations(reg_type: str = "pre", admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").select("*").eq("reg_type", reg_type).order("created_at", desc=True).execute()
        return {"data": response.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/attendance")
async def get_attendance(admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").select("*").eq("attended", True).order("attended_at", desc=True).execute()
        return response.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/admin/approve/{attendee_id}")
async def approve_attendee(attendee_id: str, background_tasks: BackgroundTasks, admin: dict = Depends(get_current_admin)):
    try:
        update_response = supabase.table("attendees").update({"status": "approved"}).eq("id", attendee_id).execute()
        if not update_response.data:
            raise HTTPException(status_code=404, detail="Attendee not found")

        fetch_response = supabase.table("attendees").select("*").eq("id", attendee_id).execute()
        if not fetch_response.data:
            raise HTTPException(status_code=404, detail="Attendee not found")

        attendee = fetch_response.data[0]
        full_name = attendee.get("full_name")
        email = attendee.get("email")
        sid = attendee.get("sid")
        reg_type = attendee.get("reg_type", "pre")

        if not sid:
            academic_level = attendee.get("academic_level", "UG")
            sid = generate_sid(academic_level)
            supabase.table("attendees").update({"sid": sid}).eq("id", attendee_id).execute()

        reg_type_label = "ON-SPOT" if reg_type == "onspot" else "PRE-REGISTERED"

        pass_image_b64 = generate_pass(
            academic_level=attendee.get("academic_level"),
            full_name=full_name,
            stream=attendee.get("stream"),
            sid=sid,
            reg_type=reg_type_label
        )

        background_tasks.add_task(send_pass_email, email, full_name, sid, pass_image_b64, reg_type_label)

        return {"message": "Attendee approved"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/admin/reject/{attendee_id}")
async def reject_attendee(attendee_id: int, admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").update({"status": "rejected"}).eq("id", attendee_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Attendee not found")
        return {"message": "Attendee rejected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/resend/{attendee_id}")
async def resend_pass(attendee_id: int, admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").select("*").eq("id", attendee_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Attendee not found")
        return {"message": "Pass resent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/resend-all")
async def resend_all_passes(admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").select("id").eq("status", "approved").execute()
        return {"message": f"Resending passes to {len(response.data or [])} attendees"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Export: All registrations (flat CSV) ───
@router.get("/admin/export/all")
async def export_all(admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").select("*").execute()
        csv_content = export_attendees_csv(response.data or [], "all")
        return Response(content=csv_content, media_type="text/csv", headers={
            "Content-Disposition": "attachment; filename=all_registrations.csv"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Export: Attended only (flat CSV) ───
@router.get("/admin/export/attended")
async def export_attended(admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").select("*").eq("attended", True).execute()
        csv_content = export_attendees_csv(response.data or [], "attended")
        return Response(content=csv_content, media_type="text/csv", headers={
            "Content-Disposition": "attachment; filename=attended_registrations.csv"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Export: Pre-Register (ZIP with Students / Professionals / Freshers sheets) ───
@router.get("/admin/export/pre")
async def export_pre_register(admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").select("*").eq("reg_type", "pre").execute()
        zip_bytes = export_pre_register_zip(response.data or [])
        return Response(
            content=zip_bytes,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=pre_registrations.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Export: On-Spot (separate CSV) ───
@router.get("/admin/export/onspot")
async def export_onspot(admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").select("*").eq("reg_type", "onspot").execute()
        csv_content = export_onspot_csv(response.data or [])
        return Response(content=csv_content, media_type="text/csv", headers={
            "Content-Disposition": "attachment; filename=onspot_registrations.csv"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/import")
async def import_registrations(file: UploadFile = File(...), _: dict = Depends(get_current_admin)):
    content = await file.read()
    decoded = content.decode("utf-8", errors="ignore")
    reader = csv.DictReader(io.StringIO(decoded))

    inserted = 0
    skipped = 0
    errors = []

    for row_index, row in enumerate(reader, start=2):
        mapped = map_gforms_row(row)
        if not mapped:
            missing_fields = []
            if not row.get("Name") and not row.get("Full Name"):
                missing_fields.append("Name/Full Name")
            if not row.get("Contact No") and not row.get("Phone") and not row.get("Phone Number"):
                missing_fields.append("Phone")
            if not row.get("Email"):
                missing_fields.append("Email")
            if not row.get("College Name") and not row.get("College"):
                missing_fields.append("College")
            if not row.get("Academic Details") and not row.get("Academic Level"):
                missing_fields.append("Academic Level")
            if not row.get("Graduation Stream") and not row.get("Stream"):
                missing_fields.append("Stream")
            errors.append({
                "row": row_index,
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            })
            skipped += 1
            continue

        try:
            mapped["sid"] = generate_sid(mapped["academic_level"])
            response = supabase.table("attendees").insert(mapped).execute()
            if response.data:
                inserted += 1
            else:
                errors.append({
                    "row": row_index,
                    "message": "Database insert returned no data"
                })
                skipped += 1
        except Exception as exc:
            errors.append({
                "row": row_index,
                "message": str(exc)
            })
            skipped += 1

    return {
        "message": "Registrations imported",
        "count": inserted,
        "skipped": skipped,
        "errors": errors
    }