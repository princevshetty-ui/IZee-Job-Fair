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
│   └── favicon.ico
└── src/
    ├── main.jsx
    ├── App.jsx                 # React Router setup
    ├── App.css
    ├── index.css               # Tailwind directives + custom styles
    │
    ├── pages/
    │   ├── RegisterPage.jsx    # /register — public pre-registration
    │   ├── OnSpotPage.jsx      # /onspot — staff-only registration
    │   ├── ScanPage.jsx        # /scan — volunteer QR scanner
    │   ├── AdminLoginPage.jsx  # /admin — login form
    │   ├── AdminDashboard.jsx  # /admin/dashboard — main panel
    │   ├── VolunteerRegisterPage.jsx  # /volunteer/register — volunteer sign-up
    │   ├── VolunteerValidatePage.jsx  # /volunteer/validate — QR scan + SID input
    │   └── VolunteerOnSpotPage.jsx    # /volunteer/onspot — on-spot registration
    │
    ├── components/
    │   ├── forms/
    │   │   ├── RegistrationForm.jsx      # Multi-step form (shared by Register & OnSpot)
    │   │   ├── PersonalInfoStep.jsx      # Step 1: name, phone, email, college
    │   │   ├── AcademicDetailsStep.jsx   # Step 2: academic_level, stream, conditionals
    │   │   ├── ProfessionalStep.jsx      # Step 2 alt: company, designation, experience
    │   │   ├── CollegeInfoStep.jsx       # Optional: principal & coordinator info
    │   │   └── FormField.jsx             # Reusable input/select wrapper
    │   │
    │   ├── admin/
    │   │   ├── MetricCards.jsx           # Animated count-up stat cards
    │   │   ├── RegistrationsTable.jsx    # Searchable/filterable data table
    │   │   ├── OnSpotTable.jsx             # On-spot tab: read-only, auto-approved entries
    │   │   ├── AttendanceTable.jsx       # Scanned attendees list
    │   │   ├── ProfileModal.jsx          # Full attendee detail modal
    │   │   ├── CSVImportModal.jsx        # Google Forms CSV upload
    │   │   ├── ApproveRejectButtons.jsx  # Action buttons per row
    │   │   └── ExportButtons.jsx         # CSV download buttons
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
    │       ├── Toast.jsx                 # Success/error notifications
    │       └── VolunteerAuthGuard.jsx    # Redirects to login if no volunteer JWT
    │
    ├── hooks/
    │   ├── useAuth.js                    # JWT token management
    │   ├── useApi.js                     # Fetch wrapper with auth headers
    │   └── useCountUp.js                 # Animated number counter
    │
    └── utils/
        ├── api.js                        # Base API URL + fetch helpers
        ├── validators.js                 # Phone, email validation
        └── constants.js                  # Dropdown options, academic levels
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
│   ├── register.py             # POST /api/register
│   ├── onspot.py               # POST /api/onspot (admin/staff)
│   ├── scan.py                 # POST /api/scan (legacy)
│   ├── admin.py                # All /api/admin/* routes (incl. /admin/setup)
│   └── volunteer.py            # /api/volunteer/* (register, login, onspot, validate)
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

## Frontend Page Map

### Route Configuration (App.jsx)
```jsx
<BrowserRouter>
  <Routes>
    /register → RegisterPage (public)
    /volunteer/register → VolunteerRegisterPage (public, hidden link)
    /volunteer/validate → VolunteerValidatePage (volunteer JWT required)
    /volunteer/onspot → VolunteerOnSpotPage (volunteer JWT required)
    /admin → AdminLoginPage
    /admin/dashboard → AdminDashboard (admin JWT required)
    / → redirect to /register
  </Routes>
</BrowserRouter>
```

## Component Hierarchy

### RegisterPage / OnSpotPage
```
RegisterPage
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
```

### AdminDashboard
```
AdminDashboard
├── Navbar (with logout)
├── MetricCards (6 cards, animated count-up)
│   ├── Total Pre-Registered
│   ├── Total On-Spot
│   ├── Total Approved
│   ├── Total Attended
│   ├── Pending Approvals
│   └── Total Rejected
│
├── Tab Navigation (Registrations | Attendance | Import)
│
├── [Tab: Registrations]
│   ├── Search bar (name, phone, SID)
│   ├── Filter dropdowns (type, status, academic_level, stream)
│   ├── ExportButtons (Export All | Export Attended)
│   ├── RegistrationsTable
│   │   ├── Table row (per attendee)
│   │   │   ├── Name, Phone, Email, SID, Status, Type
│   │   │   ├── ApproveRejectButtons (on pending rows)
│   │   │   └── View button → opens ProfileModal
│   │   └── Pagination controls
│   └── ProfileModal (full attendee details)
│
├── [Tab: Attendance]
│   └── AttendanceTable (scanned records with timestamps)
│
└── [Tab: Import]
    └── CSVImportModal (file upload + mapping preview)
```

### ScanPage
```
ScanPage
├── AnimatedPage
├── QRScanner (html5-qrcode camera feed)
│   ├── Camera viewfinder
│   └── onScanSuccess callback → POST /api/scan
├── AnimatePresence
│   ├── ScanSuccess (spring scale animation)
│   │   ├── Green checkmark icon
│   │   ├── Attendee name
│   │   ├── Academic level / category
│   │   └── Auto-reset countdown (3s)
│   └── ScanError (shake animation)
│       ├── Warning icon
│       ├── Error message
│       └── "Already scanned at {time}"
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
