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

    subject = f"Your IZEE Job Fair 2026 Pass is Ready! — {sid}"

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Job Fair 2026 Pass</title>
</head>
<body style="margin:0;padding:0;background:#15120f;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#15120f;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;overflow:hidden;box-shadow:0 4px 60px rgba(0,0,0,0.7);">

          <!-- HEADER -->
          <tr>
            <td style="background:#a11f26;padding:32px 36px 28px;text-align:center;border-bottom:1px solid rgba(208,176,112,0.4);">
              <p style="color:#f5f1ed;font-size:11px;font-family:Arial,Helvetica,sans-serif;letter-spacing:5px;text-transform:uppercase;margin:0 0 10px;opacity:0.7;">IZEE Business School presents</p>
              <p style="color:#d0b070;font-size:42px;font-weight:400;letter-spacing:2px;margin:0;line-height:1;font-family:Georgia,'Times New Roman',serif;font-style:italic;">Job Fair</p>
              <p style="color:#f5f1ed;font-size:13px;letter-spacing:6px;text-transform:uppercase;margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-weight:600;">2026</p>
              <div style="width:40px;height:1px;background:#d0b070;margin:16px auto 0;opacity:0.6;"></div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#1c1814;padding:36px 36px 28px;">

              <p style="color:#8d7f76;font-size:10px;text-transform:uppercase;letter-spacing:4px;font-family:Arial,Helvetica,sans-serif;font-weight:600;margin:0 0 16px;">Your Pass is Ready</p>
              <h2 style="color:#f5f1ed;font-size:26px;font-weight:400;margin:0 0 6px;font-family:Georgia,serif;font-style:italic;">Welcome, <span style="color:#d0b070;">{name}</span></h2>
              <p style="color:#8d7f76;font-size:14px;margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;">Congratulations on completing your registration for IZEE Job Fair 2026.</p>

              <!-- SID box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#15120f;border:1px solid rgba(208,176,112,0.25);margin-bottom:24px;">
                <tr>
                  <td style="padding:22px;text-align:center;">
                    <p style="color:#8d7f76;font-size:10px;text-transform:uppercase;letter-spacing:4px;margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;">Your Pass ID</p>
                    <p style="color:#d0b070;font-size:28px;font-family:Courier,monospace;font-weight:bold;letter-spacing:5px;margin:0;">{sid}</p>
                  </td>
                </tr>
              </table>

              <!-- Event details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#15120f;border:1px solid rgba(208,176,112,0.15);margin-bottom:24px;">
                <tr>
                  <td style="padding:22px;">
                    <p style="color:#d0b070;font-size:10px;text-transform:uppercase;letter-spacing:4px;font-weight:600;margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;">Event Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="padding:5px 0;font-size:13px;color:#8d7f76;font-family:Arial,Helvetica,sans-serif;"><span style="color:#c9bfb5;font-weight:600;">&#9670;&nbsp; Date:</span>&nbsp; 8th May 2026</td></tr>
                      <tr><td style="padding:5px 0;font-size:13px;color:#8d7f76;font-family:Arial,Helvetica,sans-serif;"><span style="color:#c9bfb5;font-weight:600;">&#9670;&nbsp; Venue:</span>&nbsp; IZee Business School, Jigani, Bangalore &nbsp;<a href="https://maps.app.goo.gl/DfyZRwqNwGZ6vSd28" style="color:#d0b070;text-decoration:underline;">View on Google Maps</a></td></tr>
                      <tr><td style="padding:5px 0;font-size:13px;color:#8d7f76;font-family:Arial,Helvetica,sans-serif;"><span style="color:#c9bfb5;font-weight:600;">&#9670;&nbsp; Registration Type:</span>&nbsp; {reg_type}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What to bring -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#15120f;border:1px solid rgba(208,176,112,0.15);margin-bottom:24px;">
                <tr>
                  <td style="padding:22px;">
                    <p style="color:#f5f1ed;font-size:13px;font-weight:600;margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;">What to bring:</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="padding:4px 0;font-size:13px;color:#8d7f76;font-family:Arial,Helvetica,sans-serif;"><span style="color:#a11f26;">&#9670;</span>&nbsp; Updated resume (10 copies recommended)</td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#8d7f76;font-family:Arial,Helvetica,sans-serif;"><span style="color:#a11f26;">&#9670;</span>&nbsp; Passport-sized photographs</td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#8d7f76;font-family:Arial,Helvetica,sans-serif;"><span style="color:#a11f26;">&#9670;</span>&nbsp; Valid government-issued ID proof (Aadhaar / PAN / Passport)</td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#8d7f76;font-family:Arial,Helvetica,sans-serif;"><span style="color:#a11f26;">&#9670;</span>&nbsp; Academic Certification Copies</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Important notes -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#15120f;border:1px solid rgba(208,176,112,0.15);margin-bottom:24px;">
                <tr>
                  <td style="padding:22px;">
                    <p style="color:#f5f1ed;font-size:13px;font-weight:600;margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;">Important notes:</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="padding:4px 0;font-size:13px;color:#8d7f76;font-family:Arial,Helvetica,sans-serif;"><span style="color:#a11f26;">&#9670;</span>&nbsp; Arrive <strong style="color:#c9bfb5;">30 minutes early</strong></td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#8d7f76;font-family:Arial,Helvetica,sans-serif;"><span style="color:#a11f26;">&#9670;</span>&nbsp; This pass is <strong style="color:#c9bfb5;">mandatory for entry</strong></td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#8d7f76;font-family:Arial,Helvetica,sans-serif;"><span style="color:#a11f26;">&#9670;</span>&nbsp; Scan the QR code at the gate for verification</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Spam warning -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:rgba(208,176,112,0.06);border:1px solid rgba(208,176,112,0.35);margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;font-size:13px;color:#d0b070;font-family:Arial,Helvetica,sans-serif;">
                    &#9888;&#65039; <strong>Check your spam/junk folder</strong> if you don't see this email. Add our sender address to your contacts to ensure delivery.
                  </td>
                </tr>
              </table>

              <p style="color:#5a4f48;font-size:13px;margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;">Your pass image is attached to this email. Present it at the gate for entry.</p>
              <p style="color:#5a4f48;font-size:13px;margin:0;font-family:Arial,Helvetica,sans-serif;">Looking forward to seeing you at the event!</p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#15120f;padding:20px 36px;text-align:center;border-top:1px solid rgba(208,176,112,0.12);">
              <p style="color:#5a4f48;font-size:11px;margin:0;font-family:Arial,Helvetica,sans-serif;letter-spacing:2px;text-transform:uppercase;">IZee Business School &nbsp;|&nbsp; Jigani, Bangalore &nbsp;|&nbsp; Job Fair 2026</p>
              <p style="color:rgba(208,176,112,0.3);font-size:10px;margin:6px 0 0;font-family:Georgia,serif;font-style:italic;">Ambition &bull; Access &bull; Opportunity</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
    
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

            pass_image = generate_pass({**attendee, "sid": sid})

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