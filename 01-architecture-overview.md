# Job Fair 2026 — Architecture Overview

## Key Change: Mandatory Fields
Only these fields are **mandatory** (marked with `*`):
- `full_name*`, `phone*`, `email*`, `college_name*`, `academic_level*`, `stream*`

All other fields (principal info, coordinator info, etc.) exist in the form but are **optional**.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      RAILWAY HOSTING                            │
│                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────────────┐ │
│  │  FRONTEND SERVICE    │      │  BACKEND SERVICE             │ │
│  │  React 18 + Vite     │      │  FastAPI (Python 3.11)       │ │
│  │  Tailwind CSS v3     │ HTTP │                              │ │
│  │  Framer Motion       │─────▶│  /api/register    (public)   │ │
│  │                      │      │  /api/onspot      (staff)    │ │
│  │  PAGES:              │      │  /api/scan        (volunteer)│ │
│  │  /register  (public) │      │  /api/admin/*     (JWT auth) │ │
│  │  /onspot    (staff)  │      │                              │ │
│  │  /scan      (volun.) │      │  MODULES:                    │ │
│  │  /admin     (admin)  │      │  ├─ pass_generator.py (PIL)  │ │
│  │                      │      │  ├─ email_service.py (Brevo) │ │
│  │  vite preview (prod) │      │  ├─ qr_utils.py             │ │
│  │  Port: $PORT         │      │  └─ auth.py (JWT)            │ │
│  └──────────────────────┘      │  Port: $PORT (uvicorn)       │ │
│                                └──────────┬───────────────────┘ │
└────────────────────────────────────────────┼─────────────────────┘
                                             │
                          ┌──────────────────┼──────────────────┐
                          │                  ▼                  │
                          │         SUPABASE (PostgreSQL)       │
                          │                                     │
                          │  Tables:                            │
                          │  ├─ attendees (all registrations)   │
                          │  └─ admin_users (login credentials) │
                          │                                     │
                          │  RLS Policies:                      │
                          │  ├─ Public: INSERT only (attendees) │
                          │  ├─ Auth: Full CRUD (admin JWT)     │
                          │  └─ Service Role: scan endpoint     │
                          └─────────────────────────────────────┘

                          ┌─────────────────────────────────────┐
                          │     BREVO HTTP API (v3/smtp/email)  │
                          │  Free tier: 300 emails/day          │
                          │  Pass image attached as base64 JPG  │
                          │  Uses httpx POST, NOT SMTP/SDK      │
                          └─────────────────────────────────────┘
```

## Feature Flow

### F1: Pre-Registration
```
User visits /register
    → Fills multi-step form (Step 1: Personal, Step 2: Academic)
    → POST /api/register
    → Backend validates, inserts with status="pending"
    → Admin sees in /admin panel
    → Admin clicks "Approve"
    → PUT /api/admin/approve/{id}
    → Backend generates SID (e.g. UGR59134)
    → Backend generates pass image (Pillow + QR)
    → Backend sends email via Brevo HTTP API with pass attachment
    → Attendee receives pass with "PRE-REGISTERED" label
```

### F2: On-Spot Registration
```
Staff visits /onspot (basic route guard, not public)
    → Fills same form fields
    → POST /api/onspot
    → Backend validates, inserts with status="approved"
    → Instantly generates SID + pass image
    → Sends email immediately OR staff prints
    → Pass shows "ON-SPOT" label
```

### F3: QR Validation
```
Volunteer opens /scan on phone browser
    → Camera activates (html5-qrcode)
    → Scans attendee QR code (contains SID)
    → POST /api/scan { sid: "UGR59134" }
    → Backend checks: SID exists? Already scanned?
    → If valid: marks attended=true, attended_at=now()
    → Returns: { name, academic_level, category, status }
    → Green checkmark animation, auto-resets 3s
    → If duplicate: shake animation, warning message
```

### F4: Admin Panel
```
Admin visits /admin → login form
    → POST /api/admin/login { email, password }
    → Returns JWT token (stored in localStorage)
    → Dashboard loads:
        ├─ Metric cards (animated count-up)
        ├─ Registrations table (search/filter/approve/reject)
        ├─ Attendance table
        ├─ CSV Export (all / attended only)
        └─ CSV Import (Google Forms migration)
```

## SID Generation Logic

| Academic Level | Prefix | Example    |
|----------------|--------|------------|
| UG             | UGR    | UGR59134   |
| PG             | PGR    | PGR10382   |
| Diploma        | DIP    | DIP76241   |
| ITI            | ITI    | ITI44597   |
| PUC Pass       | PUC    | PUC84712   |
| Graduate       | GRD    | GRD23456   |
| Professional   | PRO    | PRO31827   |

Format: `{PREFIX}{5-digit random}` (10000–99999) — 90,000 unique combinations per prefix.
Safely handles 4–5k+ registrations with zero collision risk. Check DB uniqueness before confirming.
