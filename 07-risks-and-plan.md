# Job Fair 2026 — Risk Points & Implementation Plan

## Gemini 2.5 Pro Risk Points + Correct Approaches

### Risk 1: Pillow Coordinate Math for Custom Template

**What will go wrong:** Gemini will guess coordinates or use 
percentages. Text will render off-screen or overlap the template design.

**Correct approach:**
```python
# NEVER guess coordinates. Use this workflow:
# 1. Open template in image editor
# 2. Read actual pixel dimensions: img.size → (width, height)
# 3. Hover cursor at desired position → note (x, y)
# 4. Set constants: NAME_X = 100, NAME_Y = 350
# 5. Test with: python pass_generator.py (add __main__ test block)

if __name__ == "__main__":
    test_attendee = {
        "full_name": "TEST VERY LONG NAME HERE TO CHECK WRAPPING",
        "academic_level": "UG",
        "stream": "BCA",
        "sid": "UGR59134",
        "reg_type": "pre",
    }
    result = generate_pass(test_attendee)
    # Decode and save for visual inspection
    import base64
    with open("test_pass.jpg", "wb") as f:
        f.write(base64.b64decode(result))
    print("Saved test_pass.jpg — inspect visually!")
```

---

### Risk 2: Async Email Sending Without Blocking Registration

**What will go wrong:** Email sending will block the HTTP response.
User waits 5-10s for the registration confirmation. Or worse, the
email fails and the entire request returns 500.

**Correct approach:**
```python
from fastapi import BackgroundTasks

@router.put("/admin/approve/{attendee_id}")
async def approve_attendee(
    attendee_id: str,
    background_tasks: BackgroundTasks,
    admin = Depends(get_current_admin)
):
    # 1. Update DB status (fast)
    # 2. Generate SID (fast)
    # 3. Generate pass image (fast, ~200ms)
    # 4. Queue email as background task (non-blocking)
    background_tasks.add_task(
        send_pass_email,
        email=attendee["email"],
        name=attendee["full_name"],
        pass_image_b64=pass_b64
    )
    # 5. Return immediately
    return {"success": True, "message": "Approved. Pass emailed."}
```

> [!IMPORTANT]  
> `BackgroundTasks` is built into FastAPI. Do NOT use Celery or Redis 
> for this scale. BackgroundTasks runs in the same process after the 
> response is sent.

---

### Risk 3: Supabase RLS with FastAPI Service Role vs Anon Key

**What will go wrong:** Using the anon key in the backend means RLS 
blocks admin operations. Using service_role key in the frontend 
exposes full DB access to the browser.

**Correct approach:**
```
Frontend (.env):  NEVER stores any Supabase key
                  Only calls YOUR backend API at VITE_API_URL

Backend (.env):   SUPABASE_KEY = service_role key
                  This bypasses RLS entirely
                  Backend handles ALL authorization via JWT middleware

Public insert:    POST /api/register → backend uses service_role
                  to insert. RLS anon INSERT policy exists as safety net
                  but backend doesn't rely on it.

Scan endpoint:    POST /api/scan → backend uses service_role.
                  No frontend Supabase calls.
```

**Key rule:** The frontend NEVER imports `supabase-js`. It only calls 
your FastAPI backend. The backend is the sole consumer of the 
Supabase service_role key.

---

### Risk 4: CORS Between Two Separate Railway Services

**What will go wrong:** Forgetting to add the Railway frontend URL to 
CORS, or using `allow_origins=["*"]` which fails with credentials.

**Correct approach (from working Izee Culturals code):**
```python
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

FRONTEND_URL = os.getenv("FRONTEND_URL", "")
if FRONTEND_URL:
    ALLOWED_ORIGINS.append(FRONTEND_URL)
    ALLOWED_ORIGINS.append(FRONTEND_URL.rstrip("/"))

RAILWAY_FRONTEND = os.getenv("RAILWAY_FRONTEND_URL", "")
if RAILWAY_FRONTEND:
    ALLOWED_ORIGINS.append(RAILWAY_FRONTEND)

ALLOWED_ORIGINS = list(set(o for o in ALLOWED_ORIGINS if o))
print(f"[CORS] Allowed origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

---

### Risk 5: Railway Env Var Injection into Vite (VITE_ prefix)

**What will go wrong:** Setting `API_URL` in Railway dashboard for 
frontend. Vite silently ignores it. Frontend calls `undefined/api/...`.

**Correct approach:**
```bash
# In Railway dashboard for FRONTEND service:
VITE_API_URL=https://your-backend.up.railway.app

# In frontend code:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

# NEVER use process.env in frontend. 
# ALWAYS use import.meta.env.VITE_*
```

**Also:** The env var must be set BEFORE build time. Vite bakes 
`VITE_*` vars into the bundle at build time. Changing them after 
build requires a rebuild.

---

### Risk 6: Brevo 300/day Limit Handling for Bulk Import

**What will go wrong:** CSV import of 500 rows triggers 500 emails. 
First 300 succeed, next 200 get HTTP 429 or silently fail.

**Correct approach:**
```python
import asyncio
from datetime import datetime, timedelta

BREVO_DAILY_LIMIT = 280  # Safety margin under 300

async def send_batch_emails(attendees: list, start_index: int = 0):
    """
    Send emails in batches respecting Brevo API daily limit.
    Returns count of sent + remaining for next day.
    """
    sent = 0
    for i, attendee in enumerate(attendees[start_index:], start=start_index):
        if sent >= BREVO_DAILY_LIMIT:
            remaining = len(attendees) - i
            return {
                "sent": sent,
                "remaining": remaining,
                "resume_at": i,
                "next_batch": (datetime.now() + timedelta(days=1)).isoformat()
            }
        
        try:
            await send_pass_email(
                email=attendee["email"],
                name=attendee["full_name"],
                pass_image_b64=attendee["pass_b64"]
            )
            sent += 1
            # Small delay to avoid API rate limiting
            await asyncio.sleep(0.3)
        except Exception as e:
            print(f"Email failed for {attendee['email']}: {e}")
            continue
    
    return {"sent": sent, "remaining": 0}
```

---

### Risk 7: QR Code Paste Coordinates on Pillow Template

**What will go wrong:** QR code rendered at wrong position, 
overlapping text, or outside visible area. Alpha compositing fails 
if image modes don't match.

**Correct approach:**
```python
# 1. QR is generated as RGBA
qr_img = generate_qr_image(sid, size=QR_SIZE)  # Returns RGBA

# 2. Template MUST be RGBA for alpha_composite to work
img = Image.open(TEMPLATE_PATH).convert('RGBA')  # ← Critical

# 3. Calculate paste position from CENTER point (not top-left!)
qr_paste_x = QR_CENTER_X - (QR_SIZE // 2)
qr_paste_y = QR_CENTER_Y - (QR_SIZE // 2)

# 4. Draw white background FIRST, then paste QR on top
plate_size = QR_SIZE + (2 * QR_BG_PADDING)
plate_x1 = QR_CENTER_X - (plate_size // 2)
plate_y1 = QR_CENTER_Y - (plate_size // 2)
draw.rectangle([plate_x1, plate_y1, plate_x1+plate_size, plate_y1+plate_size],
               fill=(255, 255, 255, 255))

# 5. Use alpha_composite (NOT paste) for transparency support
img.alpha_composite(qr_img, (qr_paste_x, qr_paste_y))

# 6. Convert to RGB only at final save step
final = img.convert('RGB')
final.save(buffer, format='JPEG', quality=92)
```

---

### Risk 8: JWT Expiry Handling on Frontend

**What will go wrong:** Admin logs in, token expires mid-session.
API calls start returning 401 but the UI shows generic "Network Error".

**Correct approach:**
```javascript
// utils/api.js
const API_URL = import.meta.env.VITE_API_URL || '';

export async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('admin_token');
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (response.status === 401) {
        // Token expired → clear and redirect to login
        localStorage.removeItem('admin_token');
        window.location.href = '/admin';
        throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return response;
}
```

---

## Day-by-Day Implementation Plan (5 Days)

### Day 1 (Monday): Foundation
| Time | Task |
|------|------|
| Morning | Run Supabase SQL schema (copy-paste from Section 2) |
| Morning | Verify tables, indexes, RLS policies in Supabase dashboard |
| Morning | Seed admin user, test login via SQL |

> **Admin setup:** Do NOT use the SQL seed hash. Instead, after deploying:
> ```bash
> python create_admin.py admin@izeebschool.com YourSecurePassword
> ```
> Or hit `POST /api/admin/setup` once from Postman/curl.
| Afternoon | Create backend folder structure |
| Afternoon | Implement `db.py`, `auth.py`, `sid_generator.py` |
| Afternoon | Implement `POST /api/admin/login` + JWT flow |
| Afternoon | Create Railway project, link repos, set env vars |
| Evening | Test backend locally: `uvicorn main:app --reload` |
| Evening | Deploy skeleton backend to Railway, verify `/health` |

**Deliverables:** Working DB, JWT login, Railway deployment pipeline.

---

### Day 2 (Tuesday): Registration Form + API
| Time | Task |
|------|------|
| Morning | Scaffold frontend: `npm create vite@latest ./ -- --template react` |
| Morning | Install deps: tailwind, framer-motion, react-router-dom, html5-qrcode |
| Morning | Set up Tailwind, App.jsx routing, index.css |
| Afternoon | Build `RegistrationForm.jsx` — multi-step with AnimatePresence |
| Afternoon | Build `PersonalInfoStep.jsx` (mandatory: name, phone, email, college) |
| Afternoon | Build `AcademicDetailsStep.jsx` (conditional dropdowns) |
| Afternoon | Build `CollegeInfoStep.jsx` (optional fields) |
| Evening | Implement `POST /api/register` backend route |
| Evening | Test full flow: form → API → Supabase insert |
| Evening | Deploy frontend to Railway, test CORS |

**Deliverables:** Working registration form, data stored in Supabase.

---

### Day 3 (Wednesday): Pass Generation + Email + On-Spot
| Time | Task |
|------|------|
| Morning | Place client template in `assets/templates/` |
| Morning | Implement `pass_generator.py` with coordinate adjustment |
| Morning | Test pass generation locally with test data |
| Morning | Adjust coordinates until pass looks correct |
| Afternoon | Implement `email_service.py` with Brevo HTTP API (httpx) |
| Afternoon | Test email: send a test pass to yourself |
| Afternoon | Implement `POST /api/onspot` route |
| Evening | Build `OnSpotPage.jsx` (same form, staff guard) |
| Evening | Test on-spot flow: form → SID → pass → email |

**Deliverables:** Working pass generator, email delivery, on-spot registration.

---

### Day 4 (Thursday): Admin Panel
| Time | Task |
|------|------|
| Morning | Build `AdminLoginPage.jsx` |
| Morning | Build `AdminDashboard.jsx` with tab layout |
| Morning | Build `MetricCards.jsx` with count-up animation |
| Afternoon | Implement `GET /api/admin/stats` |
| Afternoon | Implement `GET /api/admin/registrations` (pagination, search, filter) |
| Afternoon | Build `RegistrationsTable.jsx` with approve/reject buttons |
| Afternoon | Implement `PUT /api/admin/approve/{id}` + background email task |
| Afternoon | Implement `PUT /api/admin/reject/{id}` |
| Evening | Implement CSV export routes (`GET /api/admin/export/all` + `/attended`) |
| Evening | Build `ExportButtons.jsx` |
| Evening | Test full admin flow: login → view → approve → email sent |

**Deliverables:** Complete admin panel with approvals and CSV export.

---

### Day 5 (Friday): Scanner + Import + Polish
| Time | Task |
|------|------|
| Morning | Build `ScanPage.jsx` with html5-qrcode |
| Morning | Build `ScanSuccess.jsx` + `ScanError.jsx` with animations |
| Morning | Implement `POST /api/scan` route |
| Morning | Test scanning with a real QR from a generated pass |
| Afternoon | Implement `POST /api/admin/import` (CSV bulk import) |
| Afternoon | Build `CSVImportModal.jsx` |
| Afternoon | Test with actual Google Forms CSV export |
| Evening | End-to-end testing: register → approve → email → scan |
| Evening | Polish animations, fix mobile responsiveness |
| Evening | Final Railway deploy, test production |

**Deliverables:** Complete system, tested end-to-end.

---

## Key Backend Helper Files

### sid_generator.py
```python
import random
from db import supabase

SID_PREFIXES = {
    'UG': 'UGR',
    'PG': 'PGR',
    'Diploma': 'DIP',
    'ITI': 'ITI',
    'PUC': 'PUC',
    'Graduate': 'GRD',
    'Professional': 'PRO',  # auto-set by backend for professional attendees
}

def generate_sid(academic_level: str, attendee_type: str = 'student') -> str:
    """
    Generate a unique SID like UGR59134.
    Uses 5-digit random (10000-99999) = 90,000 combinations per prefix.
    Safely handles 4-5k+ registrations with near-zero collision risk.
    
    For professionals: academic_level is already set to 'Professional'
    by the route handler before this function is called.
    """
    prefix = SID_PREFIXES.get(academic_level, 'GEN')
    
    for _ in range(100):  # max 100 attempts
        number = random.randint(10000, 99999)
        sid = f"{prefix}{number}"
        
        # Check uniqueness in DB
        result = supabase.table('attendees') \
            .select('id') \
            .eq('sid', sid) \
            .execute()
        
        if not result.data:
            return sid
    
    # Fallback: use 6 digits if 5-digit space exhausted (extremely unlikely)
    number = random.randint(100000, 999999)
    return f"{prefix}{number}"
```

### email_service.py
```python
import httpx
import base64
import os

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# BREVO HTTP API v3 — NOT SMTP, NOT SDK
# Endpoint: POST https://api.brevo.com/v3/smtp/email
# Auth: api-key header
# Docs: https://developers.brevo.com/reference/sendtransacemail
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


async def send_pass_email(
    email: str,
    name: str,
    sid: str,
    pass_image_b64: str,
    reg_type: str = "pre"
):
    """
    Send pass image as email attachment via Brevo HTTP API.
    Uses httpx async client to POST to Brevo's transactional email endpoint.
    The pass image is sent as a base64-encoded attachment.
    """
    api_key = os.getenv("BREVO_API_KEY")  # Your Brevo API key (xkeysib-...)
    sender_email = os.getenv("BREVO_SENDER_EMAIL")
    sender_name = os.getenv("BREVO_SENDER_NAME", "IZEE Job Fair 2026")

    if not api_key:
        raise RuntimeError("BREVO_API_KEY not set in environment")

    type_label = "On-Spot" if reg_type == "onspot" else "Pre-Registration"

    payload = {
        "sender": {
            "name": sender_name,
            "email": sender_email
        },
        "to": [
            {
                "email": email,
                "name": name
            }
        ],
        "subject": f"Your Job Fair 2026 Entry Pass — {sid}",
        "htmlContent": f"""
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to IZEE Job Fair 2026!</h2>
                <p>Dear <strong>{name}</strong>,</p>
                <p>Your {type_label} has been confirmed.</p>
                <p>Your Entry Pass ID: <strong>{sid}</strong></p>
                <p>Please find your digital entry pass attached below.
                   Show this QR code at the entry gate on 8th May 2026.</p>
                <br>
                <p>Best regards,<br>IZEE Business School</p>
            </body>
            </html>
        """,
        "attachment": [
            {
                "content": pass_image_b64,   # base64 string directly
                "name": f"JobFair2026_Pass_{sid}.jpg"
            }
        ]
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": api_key
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(BREVO_API_URL, json=payload, headers=headers)

    if response.status_code in (200, 201):
        print(f"[EMAIL] Pass sent to {email} (SID: {sid})")
    else:
        print(f"[EMAIL ERROR] {response.status_code}: {response.text}")
        raise RuntimeError(f"Brevo API error: {response.status_code} — {response.text}")
```

### auth.py
```python
import os
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from db import supabase

SECRET_KEY = os.getenv("JWT_SECRET", "fallback-secret-change-me")
ALGORITHM = "HS256"
TOKEN_EXPIRY_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login")


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY_HOURS)
    return jwt.encode(
        {"sub": email, "exp": expire},
        SECRET_KEY,
        algorithm=ALGORITHM
    )


async def get_current_admin(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired")
```
