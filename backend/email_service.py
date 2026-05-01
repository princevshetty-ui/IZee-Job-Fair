import os
import httpx
import json
from typing import List, Dict, Any
import asyncio
from datetime import datetime

# Get the Brevo API key from environment variables
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "noreply@izee.com")
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "IZEE Job Fair 2026")

HEADERS = {
    "api-key": BREVO_API_KEY,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

# Brevo API endpoint
API_URL = "https://api.brevo.com/v3/smtp/email"

async def send_pass_email(email: str, name: str, sid: str, pass_image_b64: str, reg_type: str):
    """
    Send a pass image via email using Brevo API v3
    
    Args:
        email (str): Recipient email address
        name (str): Recipient name
        sid (str): SID of the attendee
        pass_image_b64 (str): Base64 encoded pass image
        reg_type (str): Registration type
        
    Returns:
        dict: Response from the API
    """
    # Create the email content
    if not BREVO_API_KEY:
        return {"error": "BREVO_API_KEY is not configured"}

    subject = f"Your IZEE Job Fair 2026 Pass - {sid}"
    
    html_content = f"""
    <html>
        <body>
            <h2>Dear {name},</h2>
            <p>Thank you for registering for IZEE Job Fair 2026.</p>
            <p>Your e-pass is attached to this email.</p>
            <p><strong>Event Details:</strong></p>
            <ul>
                <li><strong>Event:</strong> IZEE Job Fair 2026</li>
                <li><strong>Date:</strong> 8th May 2026</li>
                <li><strong>Time:</strong> 9:00 AM - 5:00 PM</li>
                <li><strong>Venue:</strong> IZEE Campus</li>
                <li><strong>Registration Type:</strong> {reg_type}</li>
                <li><strong>Your SID:</strong> {sid}</li>
            </ul>
            <p>Please bring a printed copy of this pass or have the digital version accessible on your phone.</p>
            <p>Looking forward to seeing you at the event!</p>
            <p>Best regards,<br/>IZEE Organizing Team</p>
        </body>
    </html>
    """
    
    # Create attachment filename
    attachment_name = f"JobFair2026_Pass_{sid}.jpg"
    
    # Create the payload
    payload = {
        "sender": {
            "name": BREVO_SENDER_NAME,
            "email": BREVO_SENDER_EMAIL
        },
        "to": [
            {
                "email": email,
                "name": name
            }
        ],
        "subject": subject,
        "htmlContent": html_content,
        "attachment": [
            {
                "content": pass_image_b64,
                "name": attachment_name
            }
        ]
    }
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                API_URL,
                headers=HEADERS,
                json=payload
            )
            return response.json()
    except Exception as e:
        return {"error": str(e)}

async def send_batch_emails(attendees: List[Dict[str, Any]], start_index: int = 0, daily_limit: int = 280):
    """
    Send batch emails to attendees with a daily safety limit.
    """
    if not attendees:
        return {"sent": 0, "errors": []}

    from pass_generator import generate_pass

    sent = 0
    errors = []
    end_index = min(len(attendees), start_index + daily_limit)

    for attendee in attendees[start_index:end_index]:
        try:
            sid = attendee.get("sid")
            if not sid:
                continue

            reg_type_value = attendee.get("reg_type", "pre")
            reg_type_label = "ON-SPOT" if reg_type_value == "onspot" else "PRE-REGISTERED"

            pass_image = generate_pass(
                academic_level=attendee.get("academic_level"),
                full_name=attendee.get("full_name"),
                stream=attendee.get("stream"),
                sid=sid,
                reg_type=reg_type_label
            )

            result = await send_pass_email(
                attendee.get("email"),
                attendee.get("full_name"),
                sid,
                pass_image,
                reg_type_label
            )

            if result.get("error"):
                errors.append(result)
            else:
                sent += 1
        except Exception as exc:
            errors.append({"error": str(exc)})

    return {"sent": sent, "errors": errors}

if __name__ == "__main__":
    # Test the email service
    print("Email service module loaded successfully")