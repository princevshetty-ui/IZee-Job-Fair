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
   - Model: `deepseek-ai/deepseek-v4-pro` (best for code generation)
   - API Key: your `nvapi-...` key

### 6. GitHub Repository

Repo: `https://github.com/princevshetty-ui/IZee-Job-Fair.git`

Every session prompt tells the agent to commit and push on success.
If the remote isn't added yet, run:
```bash
cd "c:\Users\hp\Desktop\IZee Job Fair"
git remote add origin https://github.com/princevshetty-ui/IZee-Job-Fair.git
git push -u origin main
```

### 7. Local Prerequisites (Before Running Any Code)

**Backend (Python):**
```bash
cd "c:\Users\hp\Desktop\IZee Job Fair\backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Create .env file with your env vars (see ENV VARS section below)
uvicorn main:app --reload --port 8000
```

**Frontend (Node.js):**
```bash
cd "c:\Users\hp\Desktop\IZee Job Fair\frontend"
npm install
# Create .env with: VITE_API_URL=http://localhost:8000
npm run dev
```

**Requires:** Python 3.11+, Node.js 22+, npm 10+

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
```

---

## IMPLEMENTATION SESSIONS

### Which Tool to Use

| Situation | Use |
|-----------|-----|
| AI Studio (Gemini 2.5 Pro) has credits | Use AI Studio (best quality) |
| AI Studio rate-limited or down | Use Kilo Code + NVIDIA NIM (`deepseek-ai/deepseek-v4-pro`) |
| Need fast iteration / debugging | Use Kilo Code + `deepseek-ai/deepseek-v4-flash` |

---

### SESSION 1 — Backend Foundation

**Estimated time:** 45 minutes  
**Model:** `deepseek-ai/deepseek-v4-pro` (or Gemini 2.5 Pro in AI Studio)

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
   - POST /api/admin/resend/{id} → re-generate pass + re-send email (approved rows only)
   - POST /api/admin/resend-all → bulk re-email all approved passes (respect 280/day Brevo limit)
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
    - POST /api/volunteer/validate → accept {sid}, validate attendee
      * Check SID exists, check if already attended
      * If NOT attended: set attended=true, attended_at=NOW(), validated_by=volunteer.id
        Return attendee details instantly (name, academic_level, stream, reg_type)
      * If ALREADY attended: return duplicate warning with IST time
        IST = timezone(timedelta(hours=5, minutes=30))
        ist_time = attended_at.astimezone(IST).strftime("%I:%M %p IST")
      * Response is INSTANT — no waiting, no polling

11. routes/onspot.py — POST /api/onspot:
    - PUBLIC — no auth required (anyone with the link can register)
    - Same fields as /api/register
    - If attendee_type == 'professional': auto-set academic_level='Professional', stream='N/A'
    - Insert with status='approved', reg_type='onspot' (auto-approved, no admin step)
    - Generate SID immediately
    - Generate pass image (Pillow) in memory — NOT stored in DB
    - Send email via Brevo HTTP API (async, BackgroundTasks)
    - Return pass_image base64 for on-screen display

13. railway.toml:
    [build] builder = "nixpacks"
    [deploy] startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"

14. create_admin.py — standalone script:
    Usage: python create_admin.py admin@izeebschool.com MyPassword
    Uses passlib to hash, inserts into admin_users via supabase client

AFTER COMPLETING ALL FILES:

1. Create MEMORY.md with what was created and any issues.

2. TEST: Run these commands and verify no errors:
   cd backend
   pip install -r requirements.txt
   python -c "from main import app; print('✅ FastAPI app imports OK')"
   python -c "from auth import create_token, hash_password; print('✅ Auth module OK')"
   python -c "from sid_generator import generate_sid; print('✅ SID generator OK')"
   python -c "from routes.register import router; print('✅ Register route OK')"
   python -c "from routes.admin import router; print('✅ Admin route OK')"
   python -c "from routes.volunteer import router; print('✅ Volunteer route OK')"

3. If ALL tests pass, run:
   cd "c:\Users\hp\Desktop\IZee Job Fair"
   git add backend/
   git commit -m "feat(backend): add FastAPI foundation — routes, auth, DB client, SID generator"
   git push origin main
   (Remote: https://github.com/princevshetty-ui/IZee-Job-Fair.git)

4. If any test fails, fix the error first, then commit.
```

**✅ YOUR MANUAL TESTS (do these yourself before moving to Session 2):**

1. Open a terminal in `backend/` folder
2. Activate venv: `venv\Scripts\activate`
3. Run: `pip install -r requirements.txt`
4. Run: `uvicorn main:app --reload --port 8000`
5. Open browser: `http://localhost:8000/docs` — FastAPI Swagger docs should load
6. Check these endpoints exist in Swagger:
   - `POST /api/register`
   - `POST /api/onspot`
   - `POST /api/admin/setup`
   - `POST /api/admin/login`
   - `POST /api/volunteer/register`
   - `POST /api/volunteer/login`
   - `POST /api/volunteer/validate`
7. Try: `GET http://localhost:8000/health` → should return `{"status": "ok"}`
8. Stop server with Ctrl+C

---

### SESSION 2 — Pass Generator + Email Service

**Estimated time:** 30 minutes  
**Model:** `deepseek-ai/deepseek-v4-flash` (fast, handles utils well)

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

AFTER COMPLETING ALL FILES:

1. UPDATE MEMORY.md with Session 2 details.

2. TEST: Run these commands:
   cd backend
   python -c "from pass_generator import generate_pass; print('✅ Pass generator OK')"
   python -c "from email_service import send_pass_email; print('✅ Email service OK')"
   python -c "from qr_utils import generate_qr_image; print('✅ QR utils OK')"
   python -c "from utils.csv_import import map_gforms_row; print('✅ CSV import OK')"
   python -c "from utils.csv_export import export_attendees_csv; print('✅ CSV export OK')"

3. If ALL tests pass, run:
   cd "c:\Users\hp\Desktop\IZee Job Fair"
   git add backend/
   git commit -m "feat(backend): add pass generator, email service, QR utils, CSV import/export"
   git push origin main
   (Remote: https://github.com/princevshetty-ui/IZee-Job-Fair.git)

4. If any test fails, fix the error first, then commit.
```

**✅ YOUR MANUAL TESTS (do these yourself before moving to Session 3):**

1. Make sure backend is running: `cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000`
2. Open `http://localhost:8000/docs` in browser
3. Try `POST /api/admin/setup` with `{"email": "test@test.com", "password": "Test1234"}` → should return 201
4. Try `POST /api/register` with test student data → should return 201 (status=pending)
5. Try `POST /api/admin/login` with your admin creds → should return JWT token
6. Use that JWT as Bearer token to `PUT /api/admin/approve/{id}` → check terminal for pass generation log
7. If Brevo API key is in `.env`, check your email inbox for the pass image
8. Try `POST /api/onspot` with test data → should return 201 + base64 pass image in response

---

### SESSION 3 — Frontend Foundation + Forms

**Estimated time:** 60 minutes  
**Model:** `deepseek-ai/deepseek-v4-pro` (large frontend generation needs best model)

**PROMPT:**

```
ROLE: Build the React frontend for Job Fair 2026.

SETUP (run these commands first):
cd "c:\Users\hp\Desktop\IZee Job Fair"
npm create vite@latest frontend -- --template react
cd frontend
npm install tailwindcss @tailwindcss/vite framer-motion react-router-dom html5-qrcode

IMPORTANT: In index.html, add Google Fonts link for Inter (400-700) and Outfit (700-900).

CREATE THESE FILES:

1. vite.config.js — React plugin + Tailwind plugin + API proxy /api/* to localhost:8000
2. src/index.css — Tailwind directives + dark theme (#0a0e1a base), glassmorphism utilities,
   Inter for body, Outfit for hero headings, gradient accent classes
3. src/App.jsx — React Router v6:
   / → LandingPage (public hero page with company carousel)
   /register → RegisterPage (public pre-registration)
   /onspot → OnSpotPage (public instant registration, NO auth)
   /volunteer/register → VolunteerRegisterPage (public, hidden link)
   /volunteer/validate → VolunteerValidatePage (volunteer JWT required)
   /admin → AdminLoginPage
   /admin/dashboard → AdminDashboard (admin JWT required)

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
10. src/components/shared/Navbar.jsx — transparent on landing, solid elsewhere

11. src/pages/LandingPage.jsx — THE HERO PAGE (first thing anyone sees):
    Full-viewport hero with animated gradient heading "IZEE JOB FAIR 2026" (Outfit font),
    subtitle "8th May 2026 · IZEE Business School, Bangalore",
    glowing badge "80+ Companies Hiring" with pulse animation,
    two CTA buttons: "Register Now" (gradient bg → /register) and "On-Spot Registration" (outline → /onspot),
    animated floating shapes background using Framer Motion.

    Stats section (scroll-triggered): 3 cards "4,000+ Registrations" | "80+ Companies" | "1,500+ Attendees"
    with animated count-up on scroll into view.

    Company Carousel: Two rows of company names/logos auto-scrolling in opposite directions.
    CSS marquee animation (@keyframes marquee, translateX, infinite linear). Hover pauses.
    Company list in constants.js: COMPANIES = ["TCS", "Infosys", "Wipro", "HCL", ...]

    Event Details section: Date/venue card, "Who Should Attend", "What to Expect".
    Footer: IZEE branding, contact, copyright.

12. Form components: FormField, RegistrationForm, PersonalInfoStep, AcademicDetailsStep,
    ProfessionalStep, CollegeInfoStep (same specs as before)

13. src/pages/RegisterPage.jsx — wraps RegistrationForm, POST /api/register
14. src/pages/OnSpotPage.jsx:
    - PUBLIC — same RegistrationForm as RegisterPage, NO auth needed
    - POST to /api/onspot
    - On success: show pass image (base64) on screen + "Pass emailed!" toast
    - Header: "On-Spot Registration"

15. src/pages/VolunteerRegisterPage.jsx — volunteer sign-up form
16. src/pages/VolunteerValidatePage.jsx:
    - Login → QR scanner + manual SID input
    - Validation response is INSTANT — no loading delay
    - Green card (valid + attendee details) / Red card (duplicate + IST time)
    - Auto-reset after 3 seconds

DESIGN (CRITICAL — must look premium):
- Dark theme: #0a0e1a background, NOT plain black
- Glassmorphism cards: backdrop-blur-xl, bg-white/5, border border-white/10
- Gradient accents: blue-500 → purple-500 (primary), emerald-400 (success), rose-500 (error)
- Fonts: Inter for body text, Outfit for hero headings
- Framer Motion on EVERYTHING: page transitions, card hover lift, button press scale
- Mobile-first (volunteers use phones at gate)
- All buttons: loading spinner + scale-95 on press
- Form focus: ring glow animation (ring-blue-500/50)

AFTER COMPLETING ALL FILES:

1. CREATE frontend/MEMORY.md with Session 3 details.

2. TEST: Run these commands:
   cd frontend
   npm run build
   (If build succeeds with 0 errors → all imports and JSX are valid)

3. Quick visual test:
   npm run dev
   Open http://localhost:5173/ in browser
   Verify: landing page loads with hero, company carousel, stats
   Open http://localhost:5173/register
   Verify: form loads, steps work, dropdowns appear
   Open http://localhost:5173/onspot
   Verify: same form, header says "On-Spot Registration"
   Open http://localhost:5173/volunteer/register
   Verify: volunteer form loads, roll number field validates
   Press Ctrl+C to stop dev server

4. If ALL tests pass, run:
   cd "c:\Users\hp\Desktop\IZee Job Fair"
   git add frontend/
   git commit -m "feat(frontend): add landing page, registration forms, volunteer pages"
   git push origin main
   (Remote: https://github.com/princevshetty-ui/IZee-Job-Fair.git)

5. If build fails, fix errors first, then commit.
```

**✅ YOUR MANUAL TESTS (do these yourself before moving to Session 4):**

Prerequisite: Backend must be running on port 8000!

1. Open `http://localhost:5173/` → Landing page:
   - [ ] Hero heading "IZEE JOB FAIR 2026" with gradient text visible?
   - [ ] "80+ Companies Hiring" badge pulsing/glowing?
   - [ ] Two CTA buttons: "Register Now" and "On-Spot Registration"?
   - [ ] Company names scrolling in 2 rows (opposite directions)?
   - [ ] Stats counter animates when you scroll down to it?
2. Click "Register Now" → goes to `/register`
   - [ ] Multi-step form works? Steps slide left/right?
   - [ ] Selecting "Professional" auto-hides academic fields?
   - [ ] Selecting academic level shows correct stream dropdown?
3. Open `/onspot` → same form but header says "On-Spot Registration"
4. Open `/volunteer/register` → roll number field rejects <12 chars?
5. Test mobile: Chrome DevTools → toggle device toolbar → iPhone 14
   - [ ] Landing page readable on mobile?
   - [ ] Forms usable without horizontal scroll?

---

### SESSION 4 — Admin Panel

**Estimated time:** 45 minutes  
**Model:** `deepseek-ai/deepseek-v4-pro` (complex admin panel, many components)

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
   - 4 TABS: Pre-Register | On-Spot Register | Attendance | Import
   - MetricCards row at top (always visible above tabs)
   - Tab 1 (Pre-Register): Shows ONLY reg_type='pre' records. Admin can approve/reject pending ones.
   - Tab 2 (On-Spot Register): Shows ONLY reg_type='onspot' records. These are already approved
     (no approve button needed — on-spot entries are auto-approved on submit).
   - Tab 3 (Attendance): Shows validated/scanned records with IST timestamps.
   - Tab 4 (Import): CSV upload for Google Forms migration.

6. src/components/admin/MetricCards.jsx:
   - 6 cards: Pre-Registered, On-Spot, Approved, Attended, Pending, Rejected
   - Animated count-up, Framer Motion fade-in
   - Color coded: pending=yellow, approved=green, rejected=red, onspot=blue

7. src/components/admin/RegistrationsTable.jsx:
   - Tab 1 (Pre-Register) — reg_type='pre' only
   - GET /api/admin/registrations?reg_type=pre with pagination
   - Search bar (name, phone, SID), filter dropdowns (status, academic_level, stream)
   - Approve/Reject buttons on PENDING rows
   - "Resend" button on APPROVED rows → POST /api/admin/resend/{id}
   - Click row → ProfileModal

8. src/components/admin/OnSpotTable.jsx:
   - Tab 2 (On-Spot) — reg_type='onspot' only
   - GET /api/admin/registrations?reg_type=onspot with pagination
   - Search, NO approve/reject buttons (auto-approved)
   - "Resend" button per row → re-email the pass
   - Shows: name, phone, SID, academic_level, stream, created_at

   On-spot flow: user visits /onspot → fills form → backend INSTANTLY generates SID,
   creates pass, emails it → entry appears in this table. No admin approval needed.

9. src/components/admin/ProfileModal.jsx — full attendee detail view
10. src/components/admin/ExportButtons.jsx — CSV downloads + "Resend All Passes" button
11. src/components/admin/ResendConfirmModal.jsx:
    - Triggered by "Resend All Passes" button
    - Shows: "This will re-email passes to ALL {count} approved registrations. Are you sure?"
    - Cancel / Confirm buttons
    - On confirm: POST /api/admin/resend-all → progress toast
12. src/components/admin/CSVImportModal.jsx — file upload + results display
13. src/components/admin/AttendanceTable.jsx — validated records with IST timestamps

14. frontend/railway.toml:
    [build] builder = "nixpacks", buildCommand = "npm install && npm run build"
    [build.nixpacksPlan.phases.setup] nixPkgs = ["nodejs_22", "npm-10_x"]
    [deploy] startCommand = "npx vite preview --host 0.0.0.0 --port $PORT"

DESIGN: Same dark glassmorphism as Session 3. Mobile-responsive tables.

AFTER COMPLETING ALL FILES:

1. UPDATE frontend/MEMORY.md with Session 4 details.

2. TEST: Run these commands:
   cd frontend
   npm run build
   (Must succeed with 0 errors)

3. Visual test:
   npm run dev
   Open http://localhost:5173/admin in browser
   Verify: login page loads
   Open http://localhost:5173/admin/dashboard (after login)
   Verify: 4 tabs visible (Pre-Register, On-Spot, Attendance, Import)
   Verify: Resend All Passes button visible in header
   Open http://localhost:5173/volunteer/validate
   Verify: volunteer login form loads
   Press Ctrl+C to stop dev server

4. If ALL tests pass, run:
   cd "c:\Users\hp\Desktop\IZee Job Fair"
   git add frontend/
   git commit -m "feat(frontend): add admin dashboard with 4 tabs, resend, metrics"
   git push origin main
   (Remote: https://github.com/princevshetty-ui/IZee-Job-Fair.git)

5. If build fails, fix errors first, then commit.
```

**✅ YOUR MANUAL TESTS (do these yourself before moving to Session 5):**

Prerequisite: Both backend (port 8000) AND frontend (port 5173) running!

1. Go to `/admin` → Login with admin credentials
2. Dashboard should show:
   - [ ] 4 tabs: Pre-Register, On-Spot, Attendance, Import?
   - [ ] Metric cards at top with animated count-up?
3. Pre-Register tab:
   - [ ] Shows only pre-registered entries?
   - [ ] Search bar works (by name, phone, SID)?
   - [ ] Approve/Reject buttons visible on pending rows?
   - [ ] "Resend" button visible on approved rows?
4. On-Spot tab:
   - [ ] Shows only on-spot entries (auto-approved)?
   - [ ] No approve/reject buttons?
5. Click "Resend All Passes" button → confirmation modal appears?
6. Try Import tab → upload a test CSV file
7. Try Export buttons → downloads CSV with correct data?

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
   - [ ] Landing page loads → hero, stats, company carousel visible
   - [ ] Register as student → check pending in admin Pre-Register tab
   - [ ] Register as professional → verify academic_level auto-set to 'Professional'
   - [ ] Admin approve → check email received with pass (PRE-REGISTERED badge)
   - [ ] Admin resend → re-emails pass to approved attendee
   - [ ] On-spot registration at /onspot → instant pass + email (ON-SPOT badge)
   - [ ] On-spot entry shows in admin On-Spot tab
   - [ ] Register as volunteer → login → scan QR → validate (instant response)
   - [ ] Volunteer manual SID input → validate (instant response)
   - [ ] Duplicate scan → shows "Already validated at X:XX PM IST"
   - [ ] CSV import → records appear in Pre-Register tab
   - [ ] CSV export → download and verify
   - [ ] Resend All Passes → confirmation modal → queues emails
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

| Task | NVIDIA NIM Model | Why |
|------|-------|-----|
| Backend foundation (Session 1) | `deepseek-ai/deepseek-v4-pro` | Best code quality, 90%+ SWE-bench, handles multi-file projects |
| Pass gen + utilities (Session 2) | `deepseek-ai/deepseek-v4-flash` | Fast, efficient for utility files — 284B MoE, great throughput |
| Frontend + Landing (Session 3) | `deepseek-ai/deepseek-v4-pro` | Large JSX generation needs best model, 1M context window |
| Admin panel (Session 4) | `deepseek-ai/deepseek-v4-pro` | Complex component hierarchy, many files |
| Quick debugging | `deepseek-ai/deepseek-v4-flash` | Fast turnaround, 13B active params, low latency |
| Alternative (if DeepSeek down) | `mistralai/mistral-small-4-119b-2603` | Strong code gen, efficient output, 119B MoE |
| AI Studio available | Gemini 2.5 Pro | Use FIRST if credits available (best overall quality) |

---

### SESSION 6 — Full Feature Test (Copy-Paste Prompt)

**Use this AFTER all sessions are complete. Paste into AI Studio or Kilo Code.**

```
ROLE: You are a QA engineer testing the Job Fair 2026 system end-to-end.
Run every test below. For each, report PASS or FAIL with details.
If FAIL, fix the issue and re-test before moving on.

SETUP:
- Backend running: cd backend && uvicorn main:app --reload --port 8000
- Frontend running: cd frontend && npm run dev (port 5173)
- Supabase tables must be empty (or use fresh project)

═══════════════════════════════════════════
TEST 1: HEALTH CHECK
═══════════════════════════════════════════
curl http://localhost:8000/health
Expected: {"status": "ok"}

═══════════════════════════════════════════
TEST 2: ADMIN SETUP
═══════════════════════════════════════════
curl -X POST http://localhost:8000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "Test1234"}'
Expected: 201, "Admin account created"

Try again:
Expected: 403, "Admin already configured"

═══════════════════════════════════════════
TEST 3: ADMIN LOGIN
═══════════════════════════════════════════
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "Test1234"}'
Expected: 200, returns access_token
Save token as ADMIN_TOKEN

Wrong password:
Expected: 401, "Invalid credentials"

═══════════════════════════════════════════
TEST 4: PRE-REGISTRATION (Student)
═══════════════════════════════════════════
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test Student","phone":"9999900001","email":"student@test.com","college_name":"Test College","academic_level":"UG","stream":"BCA","attendee_type":"student"}'
Expected: 201, status="pending", reg_type="pre"

Duplicate phone:
Expected: 409, "Phone number already registered"

═══════════════════════════════════════════
TEST 5: PRE-REGISTRATION (Professional)
═══════════════════════════════════════════
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test Pro","phone":"9999900002","email":"pro@test.com","college_name":"N/A","attendee_type":"professional"}'
Expected: 201, academic_level auto-set to "Professional", stream auto-set to "N/A"

═══════════════════════════════════════════
TEST 6: ADMIN APPROVE
═══════════════════════════════════════════
GET /api/admin/registrations → find the student's UUID
PUT /api/admin/approve/{id} with ADMIN_TOKEN
Expected: 200, SID generated (e.g., UGR12345), email queued

Verify in DB: status=approved, sid is not null

═══════════════════════════════════════════
TEST 7: ADMIN RESEND
═══════════════════════════════════════════
POST /api/admin/resend/{id} with ADMIN_TOKEN (same approved student)
Expected: 200, "Pass re-sent to student@test.com"

Try on a pending attendee:
Expected: 400, "Cannot resend"

═══════════════════════════════════════════
TEST 8: ON-SPOT REGISTRATION (Public)
═══════════════════════════════════════════
curl -X POST http://localhost:8000/api/onspot \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Walk-In Person","phone":"9999900003","email":"walkin@test.com","college_name":"Walk-In College","academic_level":"PG","stream":"MBA","attendee_type":"student","mba_specialization":"HR"}'
Expected: 201, status="approved", reg_type="onspot", SID generated, pass_image returned as base64

═══════════════════════════════════════════
TEST 9: VOLUNTEER REGISTRATION
═══════════════════════════════════════════
curl -X POST http://localhost:8000/api/volunteer/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Volunteer One","roll_number":"IZEE2024BC01","phone":"9999900004","email":"vol@izee.com","course":"BCA","year":"2nd Year"}'
Expected: 201

Duplicate roll number:
Expected: 409

Invalid roll number (not 12 chars):
Expected: 422

═══════════════════════════════════════════
TEST 10: VOLUNTEER LOGIN
═══════════════════════════════════════════
curl -X POST http://localhost:8000/api/volunteer/login \
  -H "Content-Type: application/json" \
  -d '{"roll_number":"IZEE2024BC01","email":"vol@izee.com"}'
Expected: 200, returns access_token
Save as VOL_TOKEN

Wrong email:
Expected: 401

═══════════════════════════════════════════
TEST 11: VOLUNTEER VALIDATE (First Scan)
═══════════════════════════════════════════
POST /api/volunteer/validate with VOL_TOKEN
Body: {"sid": "<SID from test 6>"}
Expected: 200, status="valid", attendee details returned INSTANTLY
Verify in DB: attended=true, attended_at is set, validated_by is volunteer UUID

═══════════════════════════════════════════
TEST 12: VOLUNTEER VALIDATE (Duplicate Scan)
═══════════════════════════════════════════
POST /api/volunteer/validate with VOL_TOKEN (same SID)
Expected: 200, status="duplicate", message contains IST time (e.g., "3:30 PM IST")

═══════════════════════════════════════════
TEST 13: ADMIN DASHBOARD STATS
═══════════════════════════════════════════
GET /api/admin/stats with ADMIN_TOKEN
Expected: total_pre_registered >= 2, total_onspot >= 1, total_attended >= 1, pending >= 1

═══════════════════════════════════════════
TEST 14: ADMIN REGISTRATIONS (Filtered)
═══════════════════════════════════════════
GET /api/admin/registrations?reg_type=pre → shows only pre-registered
GET /api/admin/registrations?reg_type=onspot → shows only on-spot
GET /api/admin/registrations?status=pending → shows only pending
GET /api/admin/registrations?search=Walk-In → finds the on-spot entry

═══════════════════════════════════════════
TEST 15: CSV EXPORT
═══════════════════════════════════════════
GET /api/admin/export/all → downloads CSV with all records
GET /api/admin/export/attended → downloads CSV with attended records only
Verify: CSV has correct columns and data

═══════════════════════════════════════════
TEST 16: FRONTEND VISUAL CHECKS
═══════════════════════════════════════════
Open http://localhost:5173/ → Landing page: hero, stats, company carousel
Open /register → Multi-step form works, dropdowns conditional
Open /onspot → Same form, "On-Spot Registration" header
Open /admin → Login form, login with admin@test.com
Open /admin/dashboard → 4 tabs visible, metrics correct
  Pre-Register tab: resend button on approved rows
  On-Spot tab: walk-in entry visible
  Attendance tab: scanned record visible
Open /volunteer/register → Volunteer form with roll number validation
Open /volunteer/validate → Login → QR scanner + manual SID tab

═══════════════════════════════════════════
TEST 17: MOBILE RESPONSIVENESS
═══════════════════════════════════════════
Open Chrome DevTools → toggle device toolbar → iPhone 14 Pro
Check: /volunteer/validate → scanner fills screen, buttons reachable
Check: /onspot → form fields usable, no horizontal scroll
Check: / → landing page scales, carousel works

AFTER ALL TESTS PASS:
cd "c:\Users\hp\Desktop\IZee Job Fair"
git add -A
git commit -m "test: all 17 end-to-end tests passed — system verified"
git push origin main
```
