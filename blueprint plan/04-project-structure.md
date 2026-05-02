# Job Fair 2026 — Project Structure & Component Tree

## Frontend File Tree

```
frontend/
├── .env                        # VITE_API_URL=http://localhost:8000
├── .env.production             # VITE_API_URL=https://<backend>.up.railway.app
├── .gitignore
├── .nvmrc                      # 22
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── railway.toml
├── public/
│   ├── favicon.ico
│   └── companies/              # Company logos for landing page carousel
│       ├── company1.png
│       ├── company2.png
│       └── ...                 # 80+ logos
└── src/
    ├── main.jsx
    ├── App.jsx                 # React Router setup
    ├── App.css
    ├── index.css               # Tailwind directives + custom styles
    │
    ├── pages/
    │   ├── LandingPage.jsx     # / — hero, stats, company carousel, CTA
    │   ├── RegisterPage.jsx    # /register — public pre-registration
    │   ├── OnSpotPage.jsx      # /onspot — public instant registration (no auth)
    │   ├── AdminLoginPage.jsx  # /admin — login form
    │   ├── AdminDashboard.jsx  # /admin/dashboard — 4-tab panel
    │   ├── VolunteerRegisterPage.jsx  # /volunteer/register — volunteer sign-up
    │   └── VolunteerValidatePage.jsx  # /volunteer/validate — QR scan + SID input
    │
    ├── components/
    │   ├── landing/
    │   │   ├── HeroSection.jsx         # Animated hero with gradient text + CTA
    │   │   ├── StatsCounter.jsx        # Live registration count cards
    │   │   ├── CompanyCarousel.jsx      # Auto-scrolling company logos (80+)
    │   │   ├── EventDetails.jsx        # Date, venue, what to expect
    │   │   └── Footer.jsx              # Links, social, copyright
    │   │
    │   ├── forms/
    │   │   ├── RegistrationForm.jsx      # Multi-step form (shared by Register & OnSpot)
    │   │   ├── PersonalInfoStep.jsx      # Step 1: name, phone, email, college
    │   │   ├── AcademicDetailsStep.jsx   # Step 2: academic_level, stream, conditionals
    │   │   ├── ProfessionalStep.jsx      # Step 2 alt: company, designation, experience
    │   │   ├── CollegeInfoStep.jsx       # Optional: principal & coordinator info
    │   │   └── FormField.jsx             # Reusable input/select wrapper
    │   │
    │   ├── admin/
    │   │   ├── MetricCards.jsx            # 6 animated count-up stat cards
    │   │   ├── RegistrationsTable.jsx     # Pre-register tab: paginated, approve/reject/resend
    │   │   ├── OnSpotTable.jsx            # On-spot tab: read-only, auto-approved
    │   │   ├── AttendanceTable.jsx        # Validated records with IST timestamps
    │   │   ├── ProfileModal.jsx           # Full attendee detail modal
    │   │   ├── CSVImportModal.jsx         # Google Forms CSV upload
    │   │   ├── ResendConfirmModal.jsx     # "Resend All Passes" confirmation modal
    │   │   ├── ApproveRejectButtons.jsx   # Action buttons per row
    │   │   └── ExportButtons.jsx          # CSV download + Resend All button
    │   │
    │   ├── scanner/
    │   │   ├── QRScanner.jsx             # html5-qrcode wrapper
    │   │   ├── ScanSuccess.jsx           # Green checkmark + attendee info
    │   │   └── ScanError.jsx             # Error/duplicate warning
    │   │
    │   └── shared/
    │       ├── Navbar.jsx                # Top nav (minimal, context-aware)
    │       ├── LoadingSpinner.jsx        # Animated spinner
    │       ├── AnimatedPage.jsx          # Framer Motion page wrapper
    │       └── Toast.jsx                 # Success/error notifications
    │
    ├── hooks/
    │   ├── useAuth.js                    # JWT token management
    │   ├── useApi.js                     # Fetch wrapper with auth headers
    │   └── useCountUp.js                 # Animated number counter
    │
    └── utils/
        ├── api.js                        # Base API URL + fetch helpers
        ├── validators.js                 # Phone, email validation
        └── constants.js                  # Dropdown options, academic levels, company list
```

## Backend File Tree

```
backend/
├── main.py                     # FastAPI app, CORS, router includes
├── db.py                       # Supabase client init
├── auth.py                     # JWT creation, verification, dependency
├── pass_generator.py           # Pillow pass image generation
├── email_service.py            # Brevo HTTP API email sending (httpx)
├── qr_utils.py                 # QR code generation
├── sid_generator.py            # SID prefix logic + uniqueness check
├── create_admin.py             # One-time script: python create_admin.py <email> <password>
├── requirements.txt
├── railway.toml
├── .env                        # Local env vars
├── .env.example                # Template for env vars
│
├── routes/
│   ├── __init__.py
│   ├── register.py             # POST /api/register (public pre-registration)
│   ├── onspot.py               # POST /api/onspot (public instant registration)
│   ├── admin.py                # All /api/admin/* (login, setup, stats, approve, reject,
│   │                           #   resend, resend-all, registrations, attendance, export, import)
│   └── volunteer.py            # /api/volunteer/* (register, login, validate)
│
├── utils/
│   ├── __init__.py
│   ├── csv_import.py           # Google Forms CSV parsing + mapping
│   ├── csv_export.py           # CSV generation for downloads
│   └── validators.py           # Input validation helpers
│
├── assets/
│   ├── templates/
│   │   └── jobfair_template.png  # Client-provided pass template
│   └── fonts/
│       └── Inter-Bold.ttf        # TrueType font for pass text
│
└── sql/
    └── schema.sql              # Complete DB schema (reference copy)
```

## Frontend Route Map

### Route Configuration (App.jsx)
```
/                        → LandingPage (public — hero, companies, CTA)
/register                → RegisterPage (public pre-registration form)
/onspot                  → OnSpotPage (public — instant registration, no auth)
/volunteer/register      → VolunteerRegisterPage (public, hidden link)
/volunteer/validate      → VolunteerValidatePage (volunteer JWT required)
/admin                   → AdminLoginPage
/admin/dashboard         → AdminDashboard (admin JWT required)
```

## Component Hierarchy

### LandingPage (/)
```
LandingPage
├── Navbar (transparent, fixed, scrolls to solid)
├── HeroSection
│   ├── Animated gradient heading: "IZEE Job Fair 2026"
│   ├── Subheading: "8th May 2026 · Bangalore"
│   ├── "80+ Companies" badge with glow animation
│   ├── CTA button: "Register Now" → /register
│   └── Animated background particles / mesh gradient
├── StatsCounter (scroll-triggered)
│   ├── "4,000+" Pre-Registered (animated count-up)
│   ├── "80+" Companies (animated count-up)
│   └── "1,500+" Expected Attendees (animated count-up)
├── CompanyCarousel
│   ├── Infinite auto-scroll marquee (left to right)
│   ├── Row 1: logos 1-40 scrolling left
│   ├── Row 2: logos 41-80 scrolling right
│   └── Hover: pauses scroll, logo scales up
├── EventDetails
│   ├── Date & Venue card
│   ├── What to Expect (bullet points)
│   └── "For Students & Professionals" badges
└── Footer
    ├── IZEE Business School branding
    ├── Contact info
    └── Social links
```

### RegisterPage / OnSpotPage
```
RegisterPage (or OnSpotPage — same form, different API endpoint)
├── AnimatedPage (Framer Motion wrapper)
├── Navbar
└── RegistrationForm
    ├── Step Indicator (step 1/2/3 dots)
    ├── AnimatePresence (step transitions)
    │
    ├── [Step 1] PersonalInfoStep
    │   ├── FormField (full_name*)
    │   ├── FormField (phone*)
    │   ├── FormField (email*)
    │   ├── FormField (college_name*)
    │   └── FormField (attendee_type* — radio: student/professional)
    │
    ├── [Step 2a — Student] AcademicDetailsStep
    │   ├── FormField (academic_level* — dropdown)
    │   ├── AnimatePresence
    │   │   ├── FormField (stream* — conditional dropdown)
    │   │   ├── FormField (mba_specialization — if MBA)
    │   │   └── FormField (stream_other — if Others)
    │   └── Next/Submit button
    │
    ├── [Step 2b — Professional] ProfessionalStep
    │   ├── (NO academic_level dropdown — backend auto-sets to 'Professional')
    │   ├── (NO stream dropdown — backend auto-sets to 'N/A')
    │   ├── FormField (company_name)
    │   ├── FormField (designation)
    │   ├── FormField (experience_years)
    │   ├── FormField (graduation_college)
    │   ├── FormField (graduation_stream)
    │   └── FormField (graduation_year)
    │
    └── [Step 3 — Optional] CollegeInfoStep
        ├── FormField (principal_name)
        ├── FormField (principal_email)
        ├── FormField (coordinator_name)
        ├── FormField (coordinator_phone)
        └── FormField (coordinator_email)

OnSpotPage differences from RegisterPage:
  - Header says "On-Spot Registration" (not "Pre-Registration")
  - POSTs to /api/onspot (not /api/register)
  - On success: shows pass image on screen + "Pass emailed!" message
  - No "Awaiting approval" message — instant approval
```

### AdminDashboard
```
AdminDashboard
├── Navbar (with logout + "Resend All Passes" button)
├── MetricCards (6 cards, animated count-up — always visible)
│   ├── Total Pre-Registered (blue)
│   ├── Total On-Spot (cyan)
│   ├── Total Approved (green)
│   ├── Total Attended (emerald)
│   ├── Pending Approvals (yellow)
│   └── Total Rejected (red)
│
├── Tab Navigation: Pre-Register | On-Spot | Attendance | Import
│
├── [Tab 1: Pre-Register]
│   ├── Search bar (name, phone, SID)
│   ├── Filter dropdowns (status, academic_level, stream)
│   ├── ExportButtons (Export All | Export Attended)
│   ├── RegistrationsTable (reg_type='pre' only)
│   │   ├── Table row (per attendee)
│   │   │   ├── Name, Phone, Email, SID, Status, Academic Level
│   │   │   ├── ApproveRejectButtons (on pending rows only)
│   │   │   ├── Resend button (on approved rows — POST /api/admin/resend/{id})
│   │   │   └── View button → opens ProfileModal
│   │   └── Pagination controls
│   └── ProfileModal (full attendee details)
│
├── [Tab 2: On-Spot]
│   ├── Search bar (name, phone, SID)
│   ├── OnSpotTable (reg_type='onspot' only)
│   │   ├── Table row: Name, Phone, SID, Academic Level, Stream, Created At
│   │   ├── Resend button (per row — re-email the pass)
│   │   ├── View button → ProfileModal
│   │   └── NO approve/reject (already auto-approved)
│   └── Pagination controls
│
├── [Tab 3: Attendance]
│   └── AttendanceTable (attended=true records)
│       ├── Name, SID, Academic Level, Reg Type, Attended At (IST)
│       └── Pagination
│
└── [Tab 4: Import]
    └── CSVImportModal (file upload + mapping preview + results)

Resend All Passes (in dashboard header):
  1. Button: "Resend All Passes" (behind ResendConfirmModal)
  2. Modal: "This will re-email passes to ALL {count} approved registrations. Are you sure?"
  3. Cancel / Confirm buttons
  4. On confirm: POST /api/admin/resend-all → show progress toast
```

### VolunteerValidatePage
```
VolunteerValidatePage
├── [IF NOT LOGGED IN] VolunteerLoginForm
│   ├── FormField (roll_number — 12 alphanumeric)
│   ├── FormField (email)
│   └── Login button → POST /api/volunteer/login → store JWT
│
├── [IF LOGGED IN] ValidationInterface
│   ├── Two-tab toggle: QR Scanner | Manual Input
│   │
│   ├── [Tab: QR Scanner]
│   │   └── QRScanner (html5-qrcode camera) → extract SID → POST /api/volunteer/validate
│   │
│   ├── [Tab: Manual Input]
│   │   ├── FormField (sid — text input, e.g., "UGR59134")
│   │   └── Validate button → POST /api/volunteer/validate
│   │
│   └── AnimatePresence (result display)
│       ├── ScanSuccess (spring scale animation)
│       │   ├── ✅ Green card
│       │   ├── Attendee name, academic level, stream
│       │   ├── SID displayed
│       │   └── Auto-reset after 3 seconds
│       └── ScanError (shake animation)
│           ├── ❌ Red card
│           ├── "Already validated at 3:30 PM IST"
│           └── Auto-reset after 3 seconds
└── Toast (for network errors)
```

## Dropdown Logic (constants.js)

```javascript
export const ACADEMIC_LEVELS = [
  { value: 'PUC', label: 'PUC Pass' },
  { value: 'UG', label: 'Undergraduate (UG)' },
  { value: 'PG', label: 'Postgraduate (PG)' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'ITI', label: 'ITI' },
  { value: 'Graduate', label: 'Graduate' },
];
// NOTE: 'Professional' is NOT in this list.
// When attendee_type = 'professional', the academic_level dropdown is hidden.
// The backend auto-sets academic_level='Professional' and stream='N/A'.

export const UG_STREAMS = ['BBA', 'BCA', 'BCom', 'BSc', 'BA', 'Others'];
export const PG_STREAMS = ['MCA', 'MCom', 'MBA', 'MSc', 'MA', 'Others'];
export const MBA_SPECIALIZATIONS = ['HR', 'Marketing', 'Finance', 'Health Care', 'Operations'];

// No stream dropdown for: PUC, Diploma, ITI, Graduate

export function getStreamsForLevel(level) {
  switch (level) {
    case 'UG': return UG_STREAMS;
    case 'PG': return PG_STREAMS;
    default: return null; // no dropdown
  }
}
```
