from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.responses import Response
from db import supabase
from auth import get_current_admin
from utils.csv_export import export_attendees_csv, export_pre_register_zip, export_onspot_csv
from utils.excel_export import (
    export_master_excel, export_pre_excel, export_onspot_excel,
    export_volunteers_excel, export_attended_excel,
)
from utils.csv_import import map_gforms_row
from pass_generator import generate_pass
from email_service import send_pass_email
from sid_generator import generate_sid
import csv
import io
import os
import json
from pydantic import BaseModel
from auth import create_token

router = APIRouter()

_SETTINGS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'settings.json')

def _load_settings() -> dict:
    try:
        with open(_SETTINGS_FILE, 'r') as f:
            return json.load(f)
    except Exception:
        return {"registration_open": True}

def _save_settings(data: dict):
    with open(_SETTINGS_FILE, 'w') as f:
        json.dump(data, f)


class AdminLogin(BaseModel):
    email: str
    password: str


class BulkActionRequest(BaseModel):
    ids: list[str]


class RegistrationStatusRequest(BaseModel):
    open: bool


@router.post("/admin/login")
async def admin_login(login_data: AdminLogin):
    admin_email = os.getenv("ADMIN_EMAIL", "admin@izeebschool.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    received_email = login_data.email.strip()
    received_password = login_data.password.strip()
    if received_email == admin_email and received_password == admin_password:
        token = create_token(admin_email)
        return {"access_token": token, "token_type": "bearer"}
    print(f"Login failed: Expected '{admin_email}', got '{received_email}'")
    raise HTTPException(status_code=401, detail="Invalid credentials")


@router.get("/admin/registration-status")
async def get_registration_status():
    settings = _load_settings()
    return {"open": settings.get("registration_open", True)}


@router.put("/admin/registration-status")
async def set_registration_status(body: RegistrationStatusRequest, admin: dict = Depends(get_current_admin)):
    settings = _load_settings()
    settings["registration_open"] = body.open
    _save_settings(settings)
    return {"open": body.open}


@router.get("/admin/stats")
async def get_stats(admin: dict = Depends(get_current_admin)):
    try:
        all_data = supabase.table("attendees").select(
            "status, reg_type, attended, attendee_type"
        ).execute()
        rows = all_data.data or []

        vol_data = supabase.table("volunteers").select("id").execute()
        total_volunteers = len(vol_data.data or [])

        total_pre = sum(1 for r in rows if r.get("reg_type") == "pre")
        total_onspot = sum(1 for r in rows if r.get("reg_type") == "onspot")
        approved = sum(1 for r in rows if r.get("status") == "approved")
        attended = sum(1 for r in rows if r.get("attended") is True)
        pending = sum(1 for r in rows if r.get("status") == "pending")
        rejected = sum(1 for r in rows if r.get("status") == "rejected")

        onspot_students = sum(1 for r in rows if r.get("reg_type") == "onspot" and r.get("attendee_type") == "student")
        onspot_freshers = sum(1 for r in rows if r.get("reg_type") == "onspot" and r.get("attendee_type") == "fresher")
        onspot_professionals = sum(1 for r in rows if r.get("reg_type") == "onspot" and r.get("attendee_type") == "professional")

        pre_attended = sum(1 for r in rows if r.get("reg_type") == "pre" and r.get("attended") is True)
        onspot_attended = sum(1 for r in rows if r.get("reg_type") == "onspot" and r.get("attended") is True)
        students_attended = sum(1 for r in rows if r.get("attendee_type") == "student" and r.get("attended") is True)
        freshers_attended = sum(1 for r in rows if r.get("attendee_type") == "fresher" and r.get("attended") is True)
        professionals_attended = sum(1 for r in rows if r.get("attendee_type") == "professional" and r.get("attended") is True)

        return {
            "total_pre_registered": total_pre,
            "total_onspot": total_onspot,
            "approved": approved,
            "attended": attended,
            "pending": pending,
            "rejected": rejected,
            "passes_sent": approved,
            "total_volunteers": total_volunteers,
            "onspot_students": onspot_students,
            "onspot_freshers": onspot_freshers,
            "onspot_professionals": onspot_professionals,
            "total_validated": attended,
            "pre_attended": pre_attended,
            "onspot_attended": onspot_attended,
            "students_attended": students_attended,
            "freshers_attended": freshers_attended,
            "professionals_attended": professionals_attended,
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


@router.get("/admin/volunteers")
async def get_volunteers(admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("volunteers").select("*").order("created_at", desc=True).execute()
        return {"data": response.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/admin/volunteers/delete")
async def delete_volunteers_bulk(req: BulkActionRequest, admin: dict = Depends(get_current_admin)):
    deleted = 0
    for vid in req.ids:
        try:
            supabase.table("volunteers").delete().eq("id", vid).execute()
            deleted += 1
        except Exception:
            pass
    return {"deleted": deleted}


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
            sid = generate_sid(attendee.get("attendee_type", "student"), attendee.get("academic_level", "UG"), supabase)
            supabase.table("attendees").update({"sid": sid}).eq("id", attendee_id).execute()

        reg_type_label = "ON-SPOT" if reg_type == "onspot" else "PRE-REGISTERED"
        pass_image_b64 = generate_pass({**attendee, "sid": sid})
        background_tasks.add_task(send_pass_email, email, full_name, sid, pass_image_b64, reg_type_label)
        return {"message": "Attendee approved", "email": email}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/admin/reject/{attendee_id}")
async def reject_attendee(attendee_id: str, admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").update({"status": "rejected"}).eq("id", attendee_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Attendee not found")
        return {"message": "Attendee rejected"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/admin/resend/{attendee_id}")
async def resend_pass(attendee_id: str, background_tasks: BackgroundTasks, admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").select("*").eq("id", attendee_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Attendee not found")

        attendee = response.data[0]
        if attendee.get("status") != "approved":
            raise HTTPException(status_code=400, detail="Attendee is not approved")

        sid = attendee.get("sid")
        if not sid:
            sid = generate_sid(attendee.get("attendee_type", "student"), attendee.get("academic_level", "UG"), supabase)
            supabase.table("attendees").update({"sid": sid}).eq("id", attendee_id).execute()

        reg_type = attendee.get("reg_type", "pre")
        reg_type_label = "ON-SPOT" if reg_type == "onspot" else "PRE-REGISTERED"
        pass_image_b64 = generate_pass({**attendee, "sid": sid})
        background_tasks.add_task(send_pass_email, attendee.get("email"), attendee.get("full_name"), sid, pass_image_b64, reg_type_label)
        return {"message": "Pass resent successfully", "email": attendee.get("email")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/admin/bulk-approve")
async def bulk_approve(req: BulkActionRequest, background_tasks: BackgroundTasks, admin: dict = Depends(get_current_admin)):
    approved_count = 0
    failed_count = 0
    errors = []

    for attendee_id in req.ids:
        try:
            supabase.table("attendees").update({"status": "approved"}).eq("id", attendee_id).execute()
            r = supabase.table("attendees").select("*").eq("id", attendee_id).execute()
            if not r.data:
                failed_count += 1
                errors.append(f"{attendee_id}: not found")
                continue

            attendee = r.data[0]
            sid = attendee.get("sid")
            if not sid:
                sid = generate_sid(attendee.get("attendee_type", "student"), attendee.get("academic_level", "UG"), supabase)
                supabase.table("attendees").update({"sid": sid}).eq("id", attendee_id).execute()

            pass_image = generate_pass({**attendee, "sid": sid})
            background_tasks.add_task(
                send_pass_email,
                attendee.get("email"), attendee.get("full_name"), sid, pass_image, "PRE-REGISTERED"
            )
            approved_count += 1
        except Exception as e:
            failed_count += 1
            errors.append(str(e))

    return {"approved": approved_count, "failed": failed_count, "errors": errors}


@router.post("/admin/bulk-resend")
async def bulk_resend(req: BulkActionRequest, background_tasks: BackgroundTasks, admin: dict = Depends(get_current_admin)):
    queued_count = 0
    failed_count = 0

    for attendee_id in req.ids:
        try:
            r = supabase.table("attendees").select("*").eq("id", attendee_id).execute()
            if not r.data:
                failed_count += 1
                continue

            attendee = r.data[0]
            if attendee.get("status") != "approved":
                failed_count += 1
                continue

            sid = attendee.get("sid")
            if not sid:
                sid = generate_sid(attendee.get("attendee_type", "student"), attendee.get("academic_level", "UG"), supabase)
                supabase.table("attendees").update({"sid": sid}).eq("id", attendee_id).execute()

            reg_type = attendee.get("reg_type", "pre")
            reg_type_label = "ON-SPOT" if reg_type == "onspot" else "PRE-REGISTERED"
            pass_image = generate_pass({**attendee, "sid": sid})
            background_tasks.add_task(
                send_pass_email,
                attendee.get("email"), attendee.get("full_name"), sid, pass_image, reg_type_label
            )
            queued_count += 1
        except Exception:
            failed_count += 1

    return {"queued": queued_count, "failed": failed_count}


@router.post("/admin/resend-all")
async def resend_all_passes(background_tasks: BackgroundTasks, admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("attendees").select("*").eq("status", "approved").execute()
        attendees = response.data or []
        for attendee in attendees:
            sid = attendee.get("sid")
            if not sid:
                sid = generate_sid(attendee.get("attendee_type", "student"), attendee.get("academic_level", "UG"), supabase)
                supabase.table("attendees").update({"sid": sid}).eq("id", attendee.get("id")).execute()
            reg_type = attendee.get("reg_type", "pre")
            reg_type_label = "ON-SPOT" if reg_type == "onspot" else "PRE-REGISTERED"
            pass_image_b64 = generate_pass({**attendee, "sid": sid})
            background_tasks.add_task(send_pass_email, attendee.get("email"), attendee.get("full_name"), sid, pass_image_b64, reg_type_label)
        return {"message": f"Queued {len(attendees)} emails for sending", "queued": len(attendees)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/admin/attendees/{attendee_id}")
async def delete_attendee(attendee_id: str, admin=Depends(get_current_admin)):
    supabase.table("attendees").delete().eq("id", attendee_id).execute()
    return {"deleted": True}


@router.post("/admin/bulk-delete")
async def bulk_delete(body: dict, admin=Depends(get_current_admin)):
    ids = body.get("ids", [])
    for id in ids:
        supabase.table("attendees").delete().eq("id", id).execute()
    return {"deleted": len(ids)}


# ─── Exports ───

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


@router.get("/admin/export/volunteers")
async def export_volunteers(admin: dict = Depends(get_current_admin)):
    try:
        response = supabase.table("volunteers").select("*").execute()
        rows = response.data or []
        out = io.StringIO()
        if rows:
            writer = csv.DictWriter(out, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        return Response(content=out.getvalue(), media_type="text/csv", headers={
            "Content-Disposition": "attachment; filename=volunteers.csv"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/admin/export/attendee-type/{attendee_type}")
async def export_by_type(attendee_type: str, admin: dict = Depends(get_current_admin)):
    if attendee_type not in ("student", "fresher", "professional"):
        raise HTTPException(status_code=400, detail="Invalid attendee type")
    try:
        response = supabase.table("attendees").select("*").eq("attendee_type", attendee_type).execute()
        rows = response.data or []
        out = io.StringIO()
        if rows:
            writer = csv.DictWriter(out, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        return Response(content=out.getvalue(), media_type="text/csv", headers={
            "Content-Disposition": f"attachment; filename={attendee_type}s.csv"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Excel Exports ───

XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


@router.get("/admin/export/excel/master")
async def export_excel_master(admin: dict = Depends(get_current_admin)):
    try:
        att_res = supabase.table("attendees").select("*").execute()
        vol_res = supabase.table("volunteers").select("*").execute()
        data = export_master_excel(att_res.data or [], vol_res.data or [])
        return Response(content=data, media_type=XLSX_MIME, headers={
            "Content-Disposition": "attachment; filename=IZee_Job_Fair_2026_Master.xlsx"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/admin/export/excel/pre")
async def export_excel_pre(admin: dict = Depends(get_current_admin)):
    try:
        res = supabase.table("attendees").select("*").eq("reg_type", "pre").execute()
        data = export_pre_excel(res.data or [])
        return Response(content=data, media_type=XLSX_MIME, headers={
            "Content-Disposition": "attachment; filename=Pre_Registrations.xlsx"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/admin/export/excel/onspot")
async def export_excel_onspot(admin: dict = Depends(get_current_admin)):
    try:
        res = supabase.table("attendees").select("*").eq("reg_type", "onspot").execute()
        data = export_onspot_excel(res.data or [])
        return Response(content=data, media_type=XLSX_MIME, headers={
            "Content-Disposition": "attachment; filename=OnSpot_Registrations.xlsx"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/admin/export/excel/volunteers")
async def export_excel_volunteers(admin: dict = Depends(get_current_admin)):
    try:
        res = supabase.table("volunteers").select("*").execute()
        data = export_volunteers_excel(res.data or [])
        return Response(content=data, media_type=XLSX_MIME, headers={
            "Content-Disposition": "attachment; filename=Volunteers.xlsx"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/admin/export/excel/attended")
async def export_excel_attended(admin: dict = Depends(get_current_admin)):
    try:
        res = supabase.table("attendees").select("*").eq("attended", True).execute()
        data = export_attended_excel(res.data or [])
        return Response(content=data, media_type=XLSX_MIME, headers={
            "Content-Disposition": "attachment; filename=Attendance.xlsx"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Import ───

@router.post("/admin/import")
async def import_registrations(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    _: dict = Depends(get_current_admin),
):
    content = await file.read()
    # utf-8-sig strips the BOM Google Forms sometimes prepends
    decoded = content.decode("utf-8-sig", errors="ignore")
    reader = csv.DictReader(io.StringIO(decoded))

    # Pre-load existing (name, phone, email) triples for O(1) duplicate checks
    existing_resp = supabase.table("attendees").select("full_name, phone, email").execute()
    existing_set: set[tuple] = set()
    for r in (existing_resp.data or []):
        existing_set.add((
            (r.get("full_name") or "").strip().lower(),
            (r.get("phone") or "").strip(),
            (r.get("email") or "").strip().lower(),
        ))

    imported = 0
    skipped_duplicates = 0
    skipped_errors = 0
    errors = []

    for row_index, row in enumerate(reader, start=2):
        mapped = map_gforms_row(row)
        if not mapped:
            skipped_errors += 1
            errors.append({"row": row_index, "message": "Row skipped: name, phone, and email all missing"})
            continue

        # Block only if all three identity fields match an existing record
        dup_key = (
            mapped["full_name"].lower(),
            mapped["phone"],
            mapped["email"].lower(),
        )
        if dup_key in existing_set:
            skipped_duplicates += 1
            continue

        try:
            mapped["sid"] = generate_sid(mapped.get("attendee_type", "student"), mapped["academic_level"], supabase)
            response = supabase.table("attendees").insert(mapped).execute()
            if not response.data:
                skipped_errors += 1
                errors.append({"row": row_index, "message": "Database insert returned no data"})
                continue

            attendee = response.data[0]
            existing_set.add(dup_key)  # guard against same duplicate appearing later in batch

            pass_image = generate_pass(attendee)
            background_tasks.add_task(
                send_pass_email,
                attendee.get("email"),
                attendee.get("full_name"),
                attendee.get("sid"),
                pass_image,
                "PRE-REGISTERED",
            )
            imported += 1
        except Exception as exc:
            skipped_errors += 1
            errors.append({"row": row_index, "message": str(exc)})

    all_ok = skipped_errors == 0
    note = (
        "All valid rows imported. Passes queued for email delivery."
        if all_ok
        else f"{imported} rows imported. {skipped_errors} row(s) had errors."
    )

    return {
        "imported": imported,
        "skipped_duplicates": skipped_duplicates,
        "skipped_errors": skipped_errors,
        "errors": errors,
        "note": note,
    }
