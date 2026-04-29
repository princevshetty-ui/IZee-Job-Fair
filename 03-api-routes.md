# Job Fair 2026 — API Route Specifications

## Base URL
- Local: `http://localhost:8000`
- Production: `https://<your-railway-backend>.up.railway.app`

---

## PUBLIC ROUTES

### POST `/api/register` — Pre-Registration
```
Auth: None (public)
Content-Type: application/json

Request Body:
{
    "full_name": "Rahul Sharma",           // required
    "phone": "9876543210",                 // required, unique
    "email": "rahul@example.com",          // required, unique
    "college_name": "IZEE Business School",// required
    "academic_level": "UG",                // required for students: UG|PG|Diploma|ITI|PUC|Graduate
                                              // backend auto-sets to 'Professional' if attendee_type=professional
    "stream": "BCA",                       // required for students; auto-set to 'N/A' for professionals
    "attendee_type": "student",            // required: student|professional
    "principal_name": "Dr. Kumar",         // optional
    "principal_email": "kumar@izee.com",   // optional
    "coordinator_name": "Mrs. Priya",      // optional
    "coordinator_phone": "9988776655",     // optional
    "coordinator_email": "priya@izee.com", // optional
    "mba_specialization": null,            // optional (only if stream=MBA)
    "stream_other": null,                  // optional (only if stream=Others)
    // Professional fields (optional, only if attendee_type=professional):
    "company_name": null,
    "designation": null,
    "experience_years": null,
    "graduation_college": null,
    "graduation_stream": null,
    "graduation_year": null
}

Success Response (201):
{
    "success": true,
    "message": "Registration submitted successfully. Awaiting approval.",
    "data": { "id": "uuid", "full_name": "Rahul Sharma", "status": "pending" }
}

Error Responses:
  409: { "detail": "Phone number already registered" }
  409: { "detail": "Email already registered" }
  422: { "detail": "Validation error: ..." }
```

### POST `/api/scan` — QR Validation (Entry Gate)
```
Auth: Volunteer JWT (roll_number + email login)
Content-Type: application/json

Request Body:
{
    "sid": "UGR59134"
}

Success Response (200):
{
    "success": true,
    "status": "valid",
    "attendee": {
        "full_name": "Rahul Sharma",
        "academic_level": "UG",
        "stream": "BCA",
        "reg_type": "pre",
        "sid": "UGR59134"
    }
}

Already Scanned (200):
{
    "success": false,
    "status": "duplicate",
    "message": "Already checked in at 3:30 PM IST",
    "attendee": {
        "full_name": "Rahul Sharma",
        "attended_at": "2026-05-08T10:00:00Z",
        "attended_at_ist": "3:30 PM IST"  // converted for display
    }
}

Not Found (404):
{ "detail": "Invalid QR code. SID not found." }
```

> [!IMPORTANT]
> `attended_at` is stored in UTC. The backend must also return an IST-formatted
> string (`attended_at_ist`) for display on the volunteer's phone.
> ```python
> from datetime import timezone, timedelta
> IST = timezone(timedelta(hours=5, minutes=30))
> ist_time = attended_at.astimezone(IST).strftime("%I:%M %p IST")
> ```

---

## VOLUNTEER-ONLY ROUTES

### POST `/api/volunteer/register` — Volunteer Self-Registration
```
Auth: None (public — shared link with IZEE students)
Content-Type: application/json

Request Body:
{
    "full_name": "Ankit Kumar",     // required
    "roll_number": "IZEE2024BCA01", // required, 12-digit alphanumeric, UNIQUE
    "phone": "9876543210",          // required
    "email": "ankit@izee.com",      // required
    "course": "BCA",               // required
    "year": "2nd Year"             // required
}

Success Response (201):
{
    "success": true,
    "message": "Volunteer registered successfully.",
    "data": { "id": "uuid", "full_name": "Ankit Kumar", "roll_number": "IZEE2024BCA01" }
}

Error Responses:
  409: { "detail": "Roll number already registered." }
  422: { "detail": "Roll number must be exactly 12 alphanumeric characters." }
```

### POST `/api/volunteer/login` — Volunteer Authentication
```
Auth: None
Content-Type: application/json

Request Body:
{ "roll_number": "IZEE2024BCA01", "email": "ankit@izee.com" }

Backend Logic:
  1. Look up volunteer by roll_number
  2. Verify email matches
  3. Issue JWT (volunteer role, 12h expiry)

Success (200):
{
    "access_token": "eyJhbGci...",
    "token_type": "bearer",
    "volunteer": {
        "full_name": "Ankit Kumar",
        "roll_number": "IZEE2024BCA01",
        "course": "BCA"
    }
}

Error (401):
{ "detail": "Invalid roll number or email." }
```

### POST `/api/volunteer/onspot` — Volunteer On-Spot Registration
```
Auth: Volunteer JWT (Bearer token from login)
Content-Type: application/json

Request Body: Same fields as /api/register

Backend Logic:
  1. Verify volunteer JWT is valid
  2. Validate mandatory fields
  3. If attendee_type == 'professional': auto-set academic_level='Professional', stream='N/A'
  4. Check phone/email uniqueness
  5. Insert with status="approved", reg_type="onspot"
  6. Generate SID immediately
  7. Generate pass image (Pillow) — in memory only, NOT stored in DB
  8. Send email via Brevo HTTP API (async, non-blocking)

Success Response (201):
{
    "success": true,
    "message": "On-spot registration complete. Pass emailed.",
    "data": {
        "id": "uuid",
        "sid": "UGR59134",
        "full_name": "Rahul Sharma",
        "pass_image": "<base64_jpg_string>"   // for optional on-screen display
    }
}
```

### POST `/api/volunteer/validate` — Validate Attendee (QR or SID)
```
Auth: Volunteer JWT (Bearer token from login)
Content-Type: application/json

Request Body:
{ "sid": "UGR59134" }   // from QR scan OR manual text input

Backend Logic: Same as POST /api/scan but also:
  1. Records which volunteer validated (validated_by = volunteer.id)
  2. Returns IST-formatted timestamp for duplicate entries

Success Response (200):
{
    "success": true,
    "status": "valid",
    "attendee": {
        "full_name": "Rahul Sharma",
        "academic_level": "UG",
        "stream": "BCA",
        "reg_type": "pre",
        "sid": "UGR59134"
    },
    "validated_by": "Ankit Kumar"
}

Already Validated (200):
{
    "success": false,
    "status": "duplicate",
    "message": "Already validated at 3:30 PM IST",
    "attendee": {
        "full_name": "Rahul Sharma",
        "attended_at_ist": "3:30 PM IST"
    }
}

Not Found (404):
{ "detail": "SID not found. Check the code and try again." }
```

---

## PUBLIC ON-SPOT REGISTRATION

### POST `/api/onspot` — On-Spot Registration (Public Link)
```
Auth: None (public — anyone with the link can register)
Content-Type: application/json

Request Body: Same fields as /api/register

Backend Logic:
  1. Validate mandatory fields
  2. If attendee_type == 'professional': auto-set academic_level='Professional', stream='N/A'
  3. Check phone/email uniqueness
  4. Insert with status="approved", reg_type="onspot"
  5. Generate SID immediately
  6. Generate pass image (Pillow) — in memory, NOT stored in DB
  7. Send email via Brevo HTTP API (async, non-blocking)
  8. Return pass_image base64 for optional on-screen display

NOTE: This route requires NO login, NO password, NO volunteer auth.
The link is shared only with people at the event venue. On submit,
the candidate instantly receives their pass via email.

Success Response (201):
{
    "success": true,
    "message": "On-spot registration complete. Pass emailed.",
    "data": {
        "id": "uuid",
        "sid": "UGR59134",
        "full_name": "Rahul Sharma",
        "pass_image": "<base64_jpg_string>"   // for optional on-screen display
    }
}
```

---

## ADMIN ROUTES (JWT Protected)

### POST `/api/admin/login`
```
Auth: None
Request Body:
{ "email": "admin@izeebschool.com", "password": "admin123" }

Success (200):
{
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 86400
}

Error (401):
{ "detail": "Invalid credentials" }
```

### POST `/api/admin/setup` — First-Time Admin Creation
```
Auth: None (auto-disables after first admin exists)
Content-Type: application/json

Request Body:
{ "email": "admin@izeebschool.com", "password": "YourSecurePassword" }

Backend Logic:
  1. Check if ANY admin_users rows exist
  2. If yes → return 403 "Admin already exists. Use login."
  3. If no  → hash password with passlib bcrypt, insert row

Success (201):
{
    "success": true,
    "message": "Admin account created. Use /api/admin/login to authenticate."
}

Already Exists (403):
{ "detail": "Admin already configured. Use /api/admin/login." }
```

> [!WARNING]
> Do NOT seed admin credentials via SQL with a hardcoded bcrypt hash.
> Placeholder hashes will not verify. Always use this setup route or
> the `create_admin.py` script to create the first admin with a real hash.

### GET `/api/admin/stats` — Dashboard Metrics
```
Auth: Bearer <JWT>

Response (200):
{
    "total_pre_registered": 1250,
    "total_onspot": 45,
    "total_approved": 980,
    "total_attended": 650,
    "pending_approvals": 315,
    "total_rejected": 0
}
```

### GET `/api/admin/registrations` — Paginated List
```
Auth: Bearer <JWT>
Query Params:
  ?page=1
  &per_page=25
  &search=rahul              (searches name, phone, sid)
  &reg_type=pre              (pre|onspot)
  &status=pending            (pending|approved|rejected)
  &attendee_type=student     (student|professional)
  &academic_level=UG
  &stream=BCA

Response (200):
{
    "data": [
        {
            "id": "uuid",
            "full_name": "Rahul Sharma",
            "phone": "9876543210",
            "email": "rahul@example.com",
            "college_name": "IZEE Business School",
            "academic_level": "UG",
            "stream": "BCA",
            "attendee_type": "student",
            "sid": "UGR59134",
            "status": "approved",
            "reg_type": "pre",
            "attended": false,
            "created_at": "2026-04-28T10:00:00Z"
        }
    ],
    "pagination": {
        "page": 1,
        "per_page": 25,
        "total": 1250,
        "total_pages": 50
    }
}
```

### PUT `/api/admin/approve/{id}` — Approve Registration
```
Auth: Bearer <JWT>
Path: id = attendee UUID

Backend Logic:
  1. Fetch attendee by ID
  2. Verify status == "pending"
  3. Generate SID (prefix by academic_level, 5-digit random, check uniqueness)
  4. Generate pass image via Pillow (template + QR + text overlay)
  5. Update status="approved", set sid
  6. Send email with pass attachment via Brevo HTTP API (async, via BackgroundTasks)

Response (200):
{
    "success": true,
    "message": "Approved. Pass emailed to rahul@example.com",
    "data": { "id": "uuid", "sid": "UGR59134", "status": "approved" }
}
```

### PUT `/api/admin/reject/{id}` — Reject Registration
```
Auth: Bearer <JWT>

Response (200):
{
    "success": true,
    "message": "Registration rejected.",
    "data": { "id": "uuid", "status": "rejected" }
}
```

### GET `/api/admin/attendance` — Attended Records
```
Auth: Bearer <JWT>
Query: ?page=1&per_page=25

Response (200):
{
    "data": [
        {
            "full_name": "Rahul Sharma",
            "sid": "UGR59134",
            "academic_level": "UG",
            "stream": "BCA",
            "reg_type": "pre",
            "attended_at": "2026-05-08T09:15:00Z"
        }
    ],
    "total": 650
}
```

### GET `/api/admin/export/all` — CSV Export (All)
```
Auth: Bearer <JWT>
Response: text/csv download
Filename: jobfair2026_all_registrations.csv
Columns: all attendee fields
```

### GET `/api/admin/export/attended` — CSV Export (Attended)
```
Auth: Bearer <JWT>
Response: text/csv download
Filename: jobfair2026_attended.csv
Columns: all attendee fields + attended_at
```

### POST `/api/admin/import` — Bulk CSV Import
```
Auth: Bearer <JWT>
Content-Type: multipart/form-data

Body: file = <google_forms_export.csv>

Column Mapping:
  "Name"                                           → full_name
  "Contact No"                                     → phone
  "Email"                                          → email
  "College Name"                                   → college_name
  "Principal Name"                                 → principal_name
  "Principal email id"                             → principal_email
  "Name - College Co-ordinator/Placement Head"     → coordinator_name
  "Contact no - College Coordinator/Placement Head"→ coordinator_phone
  "Email - College Coordinator/Placement Head"     → coordinator_email
  "Academic Details"                               → academic_level (map to enum)
  "Graduation Stream"                              → stream
  "MBA Specialization"                             → mba_specialization

Backend Logic:
  1. Parse CSV, map columns
  2. Skip duplicates (check phone + email)
  3. Set status=approved, reg_type=pre for all
  4. Generate SID for each row
  5. Queue pass emails via Brevo HTTP API (batch, respect 300/day limit)
  6. CRITICAL — map "Academic Details" to academic_level enum:
     "PUC pass" → "PUC", "Undergraduate" → "UG", "Graduate" → "Graduate"
     Auto-correct: if stream is MCA/MCom/MBA but academic says UG → override to PG
     (See 02-database-schema.md § CSV Import for full mapping code)

Response (200):
{
    "success": true,
    "imported": 245,
    "skipped_duplicates": 12,
    "email_queue": {
        "queued": 245,
        "note": "Emails sent in batches of 280/day. Remaining queued for tomorrow."
    }
}
```

---

## FastAPI Middleware & Auth

### JWT Configuration
```python
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
TOKEN_EXPIRY = 24 * 60 * 60  # 24 hours

# Dependency for protected routes
async def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
```

### CORS Configuration
```python
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    os.getenv("FRONTEND_URL", ""),
    os.getenv("RAILWAY_FRONTEND_URL", ""),
]
# Remove empty strings, deduplicate
ALLOWED_ORIGINS = list(set(o for o in ALLOWED_ORIGINS if o))
```
