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
<body style="margin:0;padding:0;background:#060a14;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#060a14;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,0.6);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#071020,#0c1f3f);padding:32px 36px 28px;text-align:center;border-bottom:2px solid #00CFFF;">
              <p style="color:#00CFFF;font-size:32px;font-weight:900;letter-spacing:6px;margin:0;line-height:1;">IZEE</p>
              <p style="color:#94a3b8;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:6px 0 0;">Business School</p>
              <div style="width:48px;height:2px;background:#00CFFF;margin:14px auto 0;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#0d1320;padding:36px 36px 28px;">

              <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 6px;">Your Job Fair 2026 Pass is Ready!</h2>
              <p style="color:#94a3b8;font-size:14px;margin:0 0 28px;">Hi <strong style="color:#e2e8f0;">{name}</strong>, congratulations on your registration.</p>

              <!-- SID box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#060a14;border:1px solid rgba(0,207,255,0.3);border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;text-align:center;">
                    <p style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin:0 0 8px;">Your Pass ID</p>
                    <p style="color:#00CFFF;font-size:26px;font-family:monospace;font-weight:bold;letter-spacing:4px;margin:0;">{sid}</p>
                  </td>
                </tr>
              </table>

              <!-- Event details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#060a14;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="color:#00CFFF;font-size:12px;text-transform:uppercase;letter-spacing:3px;font-weight:700;margin:0 0 14px;">Event Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="padding:4px 0;font-size:13px;color:#94a3b8;"><strong style="color:#e2e8f0;">Date:</strong>&nbsp; 8th May 2026</td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#94a3b8;"><strong style="color:#e2e8f0;">Venue:</strong>&nbsp; IZee Business School, Jigani, Bangalore &nbsp;<a href="https://maps.app.goo.gl/DfyZRwqNwGZ6vSd28" style="color:#00CFFF;text-decoration:underline;">View on Google Maps</a></td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#94a3b8;"><strong style="color:#e2e8f0;">Registration Type:</strong>&nbsp; {reg_type}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What to bring -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#060a14;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 12px;">What to bring:</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="padding:4px 0;font-size:13px;color:#94a3b8;">&#8226;&nbsp; 10 sets of updated CVs</td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#94a3b8;">&#8226;&nbsp; 10 passport-size photographs</td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#94a3b8;">&#8226;&nbsp; Valid government-issued ID proof (Aadhaar / PAN / Passport)</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Important notes -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#060a14;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 12px;">Important notes:</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="padding:4px 0;font-size:13px;color:#94a3b8;">&#8226;&nbsp; Arrive <strong style="color:#e2e8f0;">30 minutes early</strong></td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#94a3b8;">&#8226;&nbsp; This pass is <strong style="color:#e2e8f0;">mandatory for entry</strong></td></tr>
                      <tr><td style="padding:4px 0;font-size:13px;color:#94a3b8;">&#8226;&nbsp; Scan the QR code at the gate for verification</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Spam warning -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#1a1200;border:1px solid #f59e0b;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;font-size:13px;color:#fbbf24;">
                    &#9888;&#65039; <strong>Check your spam/junk folder</strong> if you don't see this email. Add our sender address to your contacts to ensure delivery.
                  </td>
                </tr>
              </table>

              <p style="color:#64748b;font-size:13px;margin:0 0 6px;">Your pass image is attached to this email. Present it at the gate for entry.</p>
              <p style="color:#64748b;font-size:13px;margin:0;">Looking forward to seeing you at the event!</p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#07090f;padding:18px 36px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="color:#334155;font-size:12px;margin:0;">IZee Business School, Jigani, Bangalore &nbsp;|&nbsp; Job Fair 2026</p>
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