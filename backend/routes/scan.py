from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import supabase
from datetime import timezone, timedelta

router = APIRouter(prefix="/scan", tags=["scan"])

IST = timezone(timedelta(hours=5, minutes=30))

class ScanRequest(BaseModel):
    sid: str

@router.post("/verify")
async def verify_qr(payload: ScanRequest):
    try:
        result = supabase.table("attendees").select("*").eq("sid", payload.sid).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Invalid QR code. SID not found.")
        attendee = result.data[0]
        if attendee.get("attended"):
            attended_at = attendee.get("attended_at")
            ist_time = ""
            if attended_at:
                from datetime import datetime
                dt = datetime.fromisoformat(attended_at.replace("Z", "+00:00"))
                ist_time = dt.astimezone(IST).strftime("%I:%M %p IST")
            return {
                "status": "duplicate",
                "message": f"Already checked in at {ist_time}",
                "attendee": {
                    "full_name": attendee.get("full_name"),
                    "attended_at_ist": ist_time
                }
            }
        supabase.table("attendees").update({
            "attended": True,
            "attended_at": "now()"
        }).eq("sid", payload.sid).execute()
        return {
            "status": "valid",
            "attendee": {
                "full_name": attendee.get("full_name"),
                "academic_level": attendee.get("academic_level"),
                "stream": attendee.get("stream"),
                "reg_type": attendee.get("reg_type"),
                "sid": attendee.get("sid")
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
