# 🚀 Job Fair 2026 — Complete Start-to-Finish Implementation Guide

> This replaces the old `09-kilo-code-backup-plan.md`. It covers EVERYTHING
> from zero to deployed — including manual steps, AI prompts, and the order
> to do things.

---

## PREREQUISITES (Do These First, Manually)

### 1. Create Supabase Project (5 min)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Pause** or **delete** the old "Culturals-fest" project (events are over)
3. Click **New Project**
   - Name: `Job Fair 2026`
   - Database password: choose a strong one, **save it**
   - Region: `South Asia (Mumbai)` or closest
4. Wait for project to provision (~2 min)
5. Go to **Project Settings → API** and copy these:
   - `SUPABASE_URL` (starts with `https://xxx.supabase.co`)
   - `SUPABASE_ANON_KEY` (the `anon` / `public` key)
   - `SUPABASE_SERVICE_KEY` (the `service_role` key — **keep secret**)

### 2. Run Database Schema (5 min)

1. In Supabase, go to **SQL Editor**
2. Open `02-database-schema.md` from your blueprint files
3. Copy the ENTIRE SQL block (from `CREATE EXTENSION` to the last `WITH CHECK`)
4. Paste into SQL Editor and click **Run**
5. Verify in **Table Editor**: you should see 3 tables:
   - `attendees` (0 rows)
   - `admin_users` (0 rows)
   - `volunteers` (0 rows)

### 3. Set Up Brevo API Key (5 min)

1. Go to [app.brevo.com](https://app.brevo.com) → SMTP & API → API Keys
2. Generate a new API key (starts with `xkeysib-...`)
3. Save it — this is your `BREVO_API_KEY`

### 4. Set Up Railway Account (5 min)

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. Upgrade to **Hobby plan** ($5/month) — add payment method
3. Create a new project: name it "Job Fair 2026"

### 5. Set Up NVIDIA NIM API (Backup, 5 min)

1. Go to [build.nvidia.com](https://build.nvidia.com) → Sign up
2. Verify phone number
3. Generate API key (`nvapi-...`)
4. In VS Code → Kilo Code → Settings:
   - Provider: `OpenAI Compatible`
   - Base URL: `https://integrate.api.nvidia.com/v1`
   - Model: `qwen/qwen2.5-coder-32b-instruct`
   - API Key: your `nvapi-...` key

---

## ENV VARS YOU NEED (Save These in a Notepad)

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJhbGci...  (service_role key)
JWT_SECRET=<generate: python -c "import secrets; print(secrets.token_hex(32))">
BREVO_API_KEY=xkeysib-xxxx
BREVO_SENDER_EMAIL=noreply@izeebschool.com
BREVO_SENDER_NAME=IZEE Job Fair 2026
FRONTEND_URL=<filled after frontend deploy>
STAFF_PASSWORD=<choose one for admin direct on-spot access>
```

---

## IMPLEMENTATION SESSIONS

### Which Tool to Use

| Situation | Use |
|-----------|-----|
| AI Studio (Gemini 2.5 Pro) has credits | Use AI Studio |
| AI Studio rate-limited or down | Use Kilo Code + NVIDIA (`qwen/qwen2.5-coder-32b-instruct`) |
| Debugging complex errors | Use `meta/llama-3.3-70b-instruct` in Kilo Code |

---

### SESSION 1 — Backend Foundation

**Estimated time:** 45 minutes  
**Model:** `qwen/qwen2.5-coder-32b-instruct` (or Gemini 2.5 Pro)

**PROMPT (copy-paste into AI Studio or Kilo Code):**

```
ROLE: You are building the backend for Job Fair 2026 — a FastAPI + Supabase
registration system. Create ALL files in: backend/

IMPORTANT CONTEXT:
- Database is already created in Supabase (3 tables: attendees, admin_users, volunteers)
- Use service_role key to bypass RLS
- NEVER store base64 images in the database
- Brevo HTTP API (NOT SMTP, NOT SDK) for emails
- Volunteers authenticate with roll_number + email (no password)

CREATE THESE FILES:

1. requirements.txt:
   fastapi==0.136.0, uvicorn[standard]==0.44.0, supabase==2.28.3,
   python-dotenv==1.2.2, Pillow==12.2.0, qrcode==8.2,
   python-jose[cryptography]==3.5.0, bcrypt==5.0.0, passlib[bcrypt]==1.7.4,
   httpx==0.28.1, python-multipart==0.0.26, pydantic==2.13.3

2. .env.example with all env vars (see list above)

3. db.py — Supabase client: load_dotenv, create_client, export as `supabase`

4. auth.py:
   - CryptContext(bcrypt)
   - verify_password(), hash_password()
   - create_token(email, role="admin") → JWT HS256, 24h expiry, payload: {sub, role, exp}
   - create_volunteer_token(roll_number, volunteer_id) → JWT HS256, 12h expiry, payload: {sub, role: "volunteer", volunteer_id, exp}
   - get_current_admin(token) → FastAPI Depends, checks role=="admin"
   - get_current_volunteer(token) → FastAPI Depends, checks role=="volunteer"
   - OAuth2PasswordBearer(tokenUrl="/api/admin/login")

5. sid_generator.py:
   Prefixes: UG→UGR, PG→PGR, Diploma→DIP, ITI→ITI, PUC→PUC, Graduate→GRD, Professional→PRO
   generate_sid(academic_level) → {PREFIX}{5-digit random 10000-99999}, check DB uniqueness, max 100 retries

6. main.py:
   - FastAPI app with CORS (localhost:5173 + FRONTEND_URL + RAILWAY_FRONTEND_URL)
   - Include routers: register, onspot, scan, admin, volunteer
   - GET /health → {"status": "ok"}

7. routes/__init__.py — empty

8. routes/register.py — POST /api/register:
   - Public, no auth
   - Accept: full_name, phone, email, college_name, academic_level, stream, attendee_type, + optional fields
   - If attendee_type == 'professional': auto-set academic_level='Professional', stream='N/A'
   - Check phone uniqueness, check email uniqueness (separate 409 for each)
   - Insert with status='pending', reg_type='pre'
   - Return 201

9. routes/admin.py:
   - POST /api/admin/setup → create first admin (only if admin_users is empty)
   - POST /api/admin/login → verify email+password, return JWT with role="admin"
   - GET /api/admin/stats → count metrics from attendees table
   - GET /api/admin/registrations → paginated, searchable, filterable
   - PUT /api/admin/approve/{id} → generate SID, generate pass (Pillow), queue email (BackgroundTasks)
   - PUT /api/admin/reject/{id} → update status='rejected'
   - GET /api/admin/attendance → attended records with timestamps
   - GET /api/admin/export/all → CSV download
   - GET /api/admin/export/attended → CSV download
   - POST /api/admin/import → CSV upload with Google Forms column mapping:
     * "Name" → full_name, "Contact No" → phone, "Email" → email
     * "College Name" → college_name, "Academic Details" → academic_level
     * CRITICAL: Map "PUC pass"→"PUC", "Undergraduate"→"UG", "Graduate"→"Graduate"
     * Auto-correct: if stream is MCA/MCom/MBA but academic says UG → set PG
     * "Graduation Stream" → stream, "MBA Specialization" → mba_specialization
     * Auto-set: attendee_type='student', reg_type='pre', status='approved'

10. routes/volunteer.py:
    - POST /api/volunteer/register → insert into volunteers table
      * Validate roll_number: exactly 12 alphanumeric chars, UNIQUE
      * Fields: full_name, roll_number, phone, email, course, year (all required)
    - POST /api/volunteer/login → look up by roll_number, verify email matches, return volunteer JWT
    - POST /api/volunteer/onspot → same as /api/onspot but uses volunteer JWT auth
      * If attendee_type == 'professional': auto-set academic_level='Professional', stream='N/A'
    - POST /api/volunteer/validate → accept {sid}, validate attendee
      * Same logic as /api/scan: check SID exists, check if already attended
      * Set attended=true, attended_at=NOW(), validated_by=volunteer.id
      * Return IST-formatted time for duplicates:
        from datetime import timezone, timedelta
        IST = timezone(timedelta(hours=5, minutes=30))
        ist_time = attended_at.astimezone(IST).strftime("%I:%M %p IST")

11. routes/onspot.py — POST /api/onspot (legacy admin route):
    - Requires X-Staff-Key header matching STAFF_PASSWORD env var
    - Same logic as volunteer/onspot but with staff auth

12. routes/scan.py — POST /api/scan (legacy):
    - Same as volunteer/validate but without volunteer auth tracking

13. railway.toml:
    [build] builder = "nixpacks"
    [deploy] startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"

14. create_admin.py — standalone script:
    Usage: python create_admin.py admin@izeebschool.com MyPassword
    Uses passlib to hash, inserts into admin_users via supabase client

AFTER COMPLETING: Create MEMORY.md with what was created and any issues.
```

---

### SESSION 2 — Pass Generator + Email Service

**Estimated time:** 30 minutes  
**Model:** `qwen/qwen2.5-coder-32b-instruct`

**PROMPT:**

```
ROLE: Continue building Job Fair 2026 backend. Read MEMORY.md first.

CREATE THESE FILES:

1. qr_utils.py:
   - generate_qr_image(sid, size=300) → PIL Image in RGBA
   - Uses qrcode library, ERROR_CORRECT_H

2. pass_generator.py:
   - Load template from assets/templates/jobfair_template.png
   - Convert to RGBA for alpha_composite support
   - Overlay text using Pillow ImageDraw:
     * Academic level badge (e.g., "UNDERGRADUATE")
     * Full name (auto-shrink font if name is long)
     * Stream
     * SID in gold color (#D4AF37)
     * Reg type badge: "PRE-REGISTERED" (green #22c55e) or "ON-SPOT" (red #ef4444)
   - Paste QR code using alpha_composite (not paste)
   - Use coordinate constants (adjust later with real template)
   - Convert to RGB, save as JPEG quality=75 (keep file ~200KB)
   - Return base64 string
   - ACADEMIC_DISPLAY dict: UG→UNDERGRADUATE, PG→POSTGRADUATE, Diploma→DIPLOMA,
     ITI→ITI, PUC→PUC PASS, Graduate→GRADUATE, Professional→WORKING PROFESSIONAL
   - Include __main__ test block

3. email_service.py — Brevo HTTP API v3:
   - POST to https://api.brevo.com/v3/smtp/email
   - Headers: api-key from BREVO_API_KEY env var
   - Async function using httpx.AsyncClient(timeout=30)
   - send_pass_email(email, name, sid, pass_image_b64, reg_type)
   - Pass image as base64 attachment, filename: JobFair2026_Pass_{sid}.jpg
   - HTML email body with event details
   - send_batch_emails(attendees, start_index) for bulk import with 280/day safety limit

4. utils/__init__.py — empty
5. utils/csv_import.py — Google Forms column mapping + auto-correction logic
6. utils/csv_export.py — CSV generation for all/attended exports
7. utils/validators.py — phone/email validation helpers

8. Create assets/templates/ folder (empty — developer places template later)
9. Create assets/fonts/ folder (empty — developer places font later)

REMEMBER: Pass images are generated in-memory only. NEVER stored in DB.

UPDATE MEMORY.md with Session 2 details.
```

---

### SESSION 3 — Frontend Foundation + Forms

**Estimated time:** 60 minutes  
**Model:** `qwen/qwen2.5-coder-32b-instruct`

**PROMPT:**

```
ROLE: Build the React frontend for Job Fair 2026.

SETUP (run these commands first):
cd "c:\Users\hp\Desktop\IZee Job Fair"
npm create vite@latest frontend -- --template react
cd frontend
npm install tailwindcss @tailwindcss/vite framer-motion react-router-dom html5-qrcode

CREATE THESE FILES:

1. vite.config.js — React plugin + API proxy for /api/* to localhost:8000
2. src/index.css — Tailwind directives, dark theme base, Inter font from Google Fonts
3. src/App.jsx — React Router v6:
   /register → RegisterPage (public)
   /volunteer/register → VolunteerRegisterPage (public, hidden link)
   /volunteer/validate → VolunteerValidatePage (volunteer auth required)
   /volunteer/onspot → VolunteerOnSpotPage (volunteer auth required)
   /admin → AdminLoginPage
   /admin/dashboard → AdminDashboard (admin auth required)
   / → redirect to /register

4. src/utils/api.js:
   const API_URL = import.meta.env.VITE_API_URL || ''
   apiCall(endpoint, options) → auto-adds Authorization header, handles 401 redirect

5. src/utils/constants.js:
   ACADEMIC_LEVELS: UG, PG, Diploma, ITI, PUC, Graduate (NO Professional in dropdown)
   UG_STREAMS: BBA, BCA, BCom, BSc, BA, Others
   PG_STREAMS: MCA, MCom, MBA, MSc, MA, Others
   MBA_SPECIALIZATIONS: HR, Marketing, Finance, Health Care, Operations
   getStreamsForLevel(level) → returns array or null
   COURSES: BCA, BBA, BCom, BSc, BA, MCA, MCom, MBA (for volunteer form)
   YEARS: 1st Year, 2nd Year, 3rd Year

6. src/utils/validators.js — validatePhone, validateEmail, validateRollNumber (12 alphanumeric)

7. src/components/shared/AnimatedPage.jsx — Framer Motion wrapper
8. src/components/shared/Toast.jsx — notification with auto-dismiss
9. src/components/shared/LoadingSpinner.jsx

10. src/components/forms/FormField.jsx — reusable input/select with label and error
11. src/components/forms/RegistrationForm.jsx:
    Multi-step form with AnimatePresence slide transitions:
    Step 1: PersonalInfoStep — name*, phone*, email*, college*, attendee_type* (radio)
    Step 2a (student): AcademicDetailsStep — academic_level*, stream*, conditionals
    Step 2b (professional): ProfessionalStep — company, designation, experience (all optional)
    Step 3: CollegeInfoStep — principal/coordinator info (all optional)
    Progress dots, Next/Back/Submit buttons, loading state

12. src/pages/RegisterPage.jsx — wraps RegistrationForm, POST /api/register
13. src/pages/VolunteerRegisterPage.jsx:
    - Fields: full_name*, roll_number* (12 alphanumeric, validate live), phone*, email*, course*, year*
    - POST /api/volunteer/register
    - Success screen: "You're registered as a volunteer!"

14. src/pages/VolunteerValidatePage.jsx:
    - FIRST: Login form (roll_number + email) → POST /api/volunteer/login → store JWT
    - AFTER LOGIN: Two-tab interface:
      Tab 1: QR Scanner (html5-qrcode camera) → extract SID → POST /api/volunteer/validate
      Tab 2: Manual SID Input (text field + Validate button) → POST /api/volunteer/validate
    - Show results: green card (valid) / red card (duplicate with IST time) / error
    - Auto-reset after 3 seconds

15. src/pages/VolunteerOnSpotPage.jsx:
    - Same RegistrationForm but POST to /api/volunteer/onspot
    - Requires volunteer JWT (redirect to login if missing)

DESIGN:
- Dark theme (#0f172a background), slate-700 cards, blue-500 accents
- Inter font from Google Fonts
- Framer Motion: page transitions, step slide animations, spring scale for results
- Mobile-first responsive (volunteers use phones)
- All buttons have loading spinner state

CREATE frontend/MEMORY.md with Session 3 details.
```

---

### SESSION 4 — Admin Panel

**Estimated time:** 45 minutes  
**Model:** `qwen/qwen2.5-coder-32b-instruct`

**PROMPT:**

```
ROLE: Continue Job Fair 2026 frontend. Read frontend/MEMORY.md first.

CREATE THESE FILES:

1. src/hooks/useAuth.js — JWT management (get/set/clear token, check expiry)
2. src/hooks/useCountUp.js — animated counter (0 → target, ease-out cubic, 1.5s duration)
3. src/hooks/useApi.js — fetch wrapper with auto-auth and error handling

4. src/pages/AdminLoginPage.jsx:
   - Email + password form
   - POST /api/admin/login → store JWT
   - Redirect to /admin/dashboard on success

5. src/pages/AdminDashboard.jsx:
   - Tab layout: Registrations | Attendance | Import
   - MetricCards row at top

6. src/components/admin/MetricCards.jsx:
   - 6 cards: Pre-Registered, On-Spot, Approved, Attended, Pending, Rejected
   - Animated count-up, Framer Motion fade-in
   - Color coded: pending=yellow, approved=green, rejected=red

7. src/components/admin/RegistrationsTable.jsx:
   - GET /api/admin/registrations with pagination
   - Search bar (name, phone, SID)
   - Filter dropdowns (status, reg_type, academic_level, stream)
   - Approve/Reject buttons on pending rows
   - Click row → ProfileModal

8. src/components/admin/ProfileModal.jsx — full attendee detail view
9. src/components/admin/ExportButtons.jsx — trigger CSV downloads
10. src/components/admin/CSVImportModal.jsx — file upload + results display
11. src/components/admin/AttendanceTable.jsx — scanned records with IST timestamps
12. src/components/shared/Navbar.jsx — context-aware nav bar

13. frontend/railway.toml:
    [build] builder = "nixpacks", buildCommand = "npm install && npm run build"
    [build.nixpacksPlan.phases.setup] nixPkgs = ["nodejs_22", "npm-10_x"]
    [deploy] startCommand = "npx vite preview --host 0.0.0.0 --port $PORT"

DESIGN: Dark glassmorphism cards, smooth transitions, mobile-responsive tables.

UPDATE frontend/MEMORY.md with Session 4 details.
```

---

### SESSION 5 — Deploy + Test

**Estimated time:** 30 minutes  
**Do this manually (not AI):**

1. **Create admin account:**
   ```bash
   cd backend
   python create_admin.py admin@izeebschool.com YourSecurePassword
   ```

2. **Test locally:**
   ```bash
   # Terminal 1: Backend
   cd backend && uvicorn main:app --reload --port 8000
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

3. **Deploy backend to Railway:**
   ```bash
   cd backend
   railway link  # select your project
   railway up
   # Set env vars in Railway dashboard (all from .env.example)
   ```

4. **Deploy frontend to Railway:**
   ```bash
   cd frontend
   railway link  # create new service in same project
   railway up
   # Set: VITE_API_URL=https://your-backend.up.railway.app
   ```

5. **Update backend CORS:**
   - In Railway dashboard for backend, add:
     `FRONTEND_URL=https://your-frontend.up.railway.app`

6. **Import Google Forms CSV:**
   - Export CSV from Google Forms
   - Login to admin panel → Import tab → Upload CSV
   - Verify imported records appear in registrations table

7. **Test all flows:**
   - [ ] Register as student → check pending in admin
   - [ ] Register as professional → verify academic_level auto-set
   - [ ] Admin approve → check email received with pass
   - [ ] Register as volunteer → login → scan QR → validate
   - [ ] Volunteer manual SID input → validate
   - [ ] Duplicate scan → shows IST time
   - [ ] On-spot registration via volunteer
   - [ ] CSV export → download and verify
   - [ ] Mobile responsiveness → test scanner on phone

---

## RECOVERY: If a Session Fails

```
1. Open MEMORY.md in the relevant folder (backend/ or frontend/)
2. Note what was completed vs what's missing
3. Start a new session with:
   "Read MEMORY.md in this project folder. Continue from where
   it left off. After completing, update MEMORY.md."
```

---

## MODEL RECOMMENDATIONS

| Task | Model | Why |
|------|-------|-----|
| All coding (90% of work) | `qwen/qwen2.5-coder-32b-instruct` | Best free code model |
| Complex debugging | `meta/llama-3.3-70b-instruct` | Better reasoning |
| AI Studio available | `Gemini 2.5 Pro` | Use this first (best quality) |
| Quick file edits | `qwen/qwen2.5-coder-32b-instruct` | Fast, precise |
