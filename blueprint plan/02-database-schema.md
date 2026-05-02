# Job Fair 2026 — Database Schema (Copy-Paste Ready SQL)

## Complete Schema

```sql
-- ============================================================
-- JOB FAIR 2026 — COMPLETE DATABASE SCHEMA
-- Run in Supabase SQL Editor (in order)
-- ============================================================

-- 1. ENABLE UUID EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. VOLUNTEERS TABLE (must be created BEFORE attendees — FK dependency)
CREATE TABLE IF NOT EXISTS volunteers (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name    TEXT NOT NULL,
    roll_number  TEXT NOT NULL UNIQUE,  -- 12-digit alphanumeric, strictly unique
    phone        TEXT NOT NULL,
    email        TEXT NOT NULL,
    course       TEXT NOT NULL,         -- e.g. BCA, BBA, MBA
    year         TEXT NOT NULL,         -- e.g. "1st Year", "2nd Year", "3rd Year"
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ATTENDEES TABLE
CREATE TABLE IF NOT EXISTS attendees (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- ─── MANDATORY FIELDS ───
    full_name       TEXT NOT NULL,
    phone           TEXT NOT NULL UNIQUE,
    email           TEXT NOT NULL UNIQUE,
    college_name    TEXT NOT NULL,
    academic_level  TEXT NOT NULL CHECK (
                        academic_level IN ('UG', 'PG', 'Diploma', 'ITI', 'PUC', 'Graduate', 'Professional')
                    ),
    stream          TEXT NOT NULL,
    
    -- ─── OPTIONAL FIELDS (all nullable) ───
    principal_name      TEXT,
    principal_email     TEXT,
    coordinator_name    TEXT,
    coordinator_phone   TEXT,
    coordinator_email   TEXT,
    
    -- ─── ATTENDEE TYPE FIELDS ───
    attendee_type   TEXT NOT NULL DEFAULT 'student' CHECK (
                        attendee_type IN ('student', 'professional')
                    ),
    
    -- ─── STUDENT-SPECIFIC (optional) ───
    mba_specialization  TEXT,          -- only if stream = MBA
    stream_other        TEXT,          -- only if stream = Others
    
    -- ─── PROFESSIONAL-SPECIFIC (optional, used when attendee_type='professional') ───
    company_name        TEXT,
    designation         TEXT,
    experience_years    NUMERIC,
    graduation_college  TEXT,
    graduation_stream   TEXT,
    graduation_year     INTEGER,
    
    -- ─── SYSTEM FIELDS ───
    sid             TEXT UNIQUE,       -- generated on approval (e.g. UGR59134)
    reg_type        TEXT NOT NULL DEFAULT 'pre' CHECK (
                        reg_type IN ('pre', 'onspot')
                    ),
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (
                        status IN ('pending', 'approved', 'rejected')
                    ),
    attended        BOOLEAN NOT NULL DEFAULT FALSE,
    attended_at     TIMESTAMPTZ,
    validated_by    UUID REFERENCES volunteers(id),  -- which volunteer scanned this person
    
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_attendees_phone ON attendees(phone);
CREATE INDEX IF NOT EXISTS idx_attendees_email ON attendees(email);
CREATE INDEX IF NOT EXISTS idx_attendees_sid ON attendees(sid);
CREATE INDEX IF NOT EXISTS idx_attendees_status ON attendees(status);
CREATE INDEX IF NOT EXISTS idx_attendees_attended ON attendees(attended);
CREATE INDEX IF NOT EXISTS idx_attendees_reg_type ON attendees(reg_type);
CREATE INDEX IF NOT EXISTS idx_attendees_attendee_type ON attendees(attendee_type);
CREATE INDEX IF NOT EXISTS idx_attendees_academic_level ON attendees(academic_level);

-- Volunteer indexes
CREATE INDEX IF NOT EXISTS idx_volunteers_roll_number ON volunteers(roll_number);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);

-- 5. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON attendees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. ROW LEVEL SECURITY POLICIES
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Public: can INSERT only (pre-registration form)
CREATE POLICY "Allow public insert on attendees"
    ON attendees
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Public: can read own row by phone (for status check, optional)
CREATE POLICY "Allow public read own row"
    ON attendees
    FOR SELECT
    TO anon
    USING (false);  -- disabled by default; enable if you add a status-check page

-- Service role: full access (used by FastAPI backend)
-- Note: service_role key bypasses RLS entirely.
-- The backend uses SUPABASE_SERVICE_KEY for all admin/scan operations.

-- Authenticated admin: full access
CREATE POLICY "Admin full access on attendees"
    ON attendees
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access on admin_users"
    ON admin_users
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Volunteers: public INSERT (self-registration)
CREATE POLICY "Allow public insert on volunteers"
    ON volunteers
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Volunteers: public SELECT for login check
CREATE POLICY "Allow public select on volunteers"
    ON volunteers
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Admin full access on volunteers"
    ON volunteers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. ADMIN USER SETUP
-- ⚠️ DO NOT seed admin via SQL with a hardcoded hash.
-- The hash below is a PLACEHOLDER and will NOT verify with passlib.
-- Instead, use one of these approaches AFTER deploying the backend:
--
--   Option A: Run the create_admin.py script (see backend folder):
--     python create_admin.py admin@izeebschool.com YourSecurePassword
--
--   Option B: Hit the one-time setup endpoint:
--     POST /api/admin/setup
--     { "email": "admin@izeebschool.com", "password": "YourSecurePassword" }
--     (This route auto-disables after the first admin is created.)
```

### create_admin.py (run once on server or locally)
```python
"""
One-time script to create the first admin user with a real bcrypt hash.
Usage: python create_admin.py admin@izeebschool.com YourSecurePassword
"""
import sys
import os
from pathlib import Path
from dotenv import load_dotenv
from passlib.context import CryptContext
from supabase import create_client

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def main():
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <email> <password>")
        sys.exit(1)

    email = sys.argv[1]
    password = sys.argv[2]
    hashed = pwd_context.hash(password)

    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_KEY")
    )

    # Check if admin already exists
    existing = supabase.table("admin_users").select("id").eq("email", email).execute()
    if existing.data:
        print(f"Admin {email} already exists. Skipping.")
        return

    result = supabase.table("admin_users").insert({
        "email": email,
        "hashed_password": hashed
    }).execute()

    if result.data:
        print(f"✅ Admin created: {email}")
    else:
        print(f"❌ Failed to create admin")

if __name__ == "__main__":
    main()
```

## Schema Notes

### Mandatory vs Optional Fields Table

| Field | Required? | Notes |
|-------|-----------|-------|
| `full_name` | ✅ YES | Always required |
| `phone` | ✅ YES | Unique constraint |
| `email` | ✅ YES | Unique constraint |
| `college_name` | ✅ YES | Always required |
| `academic_level` | ✅ YES | Enum: UG, PG, Diploma, ITI, PUC, Graduate, Professional |
| `stream` | ✅ YES | Conditional dropdown based on academic_level |
| `principal_name` | ❌ Optional | |
| `principal_email` | ❌ Optional | |
| `coordinator_name` | ❌ Optional | |
| `coordinator_phone` | ❌ Optional | |
| `coordinator_email` | ❌ Optional | |
| `mba_specialization` | ❌ Optional | Only shown if stream = MBA |
| `stream_other` | ❌ Optional | Only shown if stream = Others |
| `company_name` | ❌ Optional | Only if attendee_type = professional |
| `designation` | ❌ Optional | Only if attendee_type = professional |
| `experience_years` | ❌ Optional | Only if attendee_type = professional |

### Professional Attendee Handling
When `attendee_type = 'professional'`:
- Backend **auto-sets** `academic_level = 'Professional'` before DB insert
- The frontend form does NOT show an academic_level dropdown for professionals
- `stream` is auto-set to `'N/A'` (professionals don't pick a stream)
- `company_name`, `designation`, `experience_years` become relevant but remain optional
- SID prefix will be `PRO`

> [!IMPORTANT]
> The backend must set `academic_level` and `stream` for professionals **before insert**.
> Never rely on the frontend to send these values for professional attendees.
> ```python
> # In register.py / onspot.py route handler:
> if data.attendee_type == 'professional':
>     data.academic_level = 'Professional'
>     data.stream = 'N/A'
> ```

### Supabase Keys Usage

| Key | Used By | Purpose |
|-----|---------|---------|
| `SUPABASE_ANON_KEY` | Frontend (Vite) | Public form submissions only |
| `SUPABASE_SERVICE_KEY` | Backend (FastAPI) | All operations (bypasses RLS) |

---

## CSV Import — Google Forms Field Mapping

The existing Google Form uses different column names than our database.
The import endpoint must handle these mappings:

### Column Name Mapping
```
Google Form Column                                    → DB Column
─────────────────────────────────────────────────────────────────
"Name"                                                → full_name
"Contact No"                                          → phone
"Email"                                               → email
"College Name"                                        → college_name
"Principal Name"                                      → principal_name
"Principal email id"                                  → principal_email
"Name - College Co-ordinator/Placement Head"          → coordinator_name
"Contact no - College Coordinator/Placement Head"     → coordinator_phone
"Email - College Coordinator/Placement Head"          → coordinator_email
"Academic Details"                                    → academic_level (REQUIRES VALUE MAPPING)
"Graduation Stream"                                   → stream
"MBA Specialization"                                  → mba_specialization
```

### Academic Details → academic_level Value Mapping

The Google Form has 3 options: "PUC pass", "Graduate", "Undergraduate".
Our DB enum has 7 values. The import must convert:

```python
ACADEMIC_LEVEL_MAP = {
    # Exact matches from Google Form
    "PUC pass": "PUC",
    "PUC Pass": "PUC",
    "puc pass": "PUC",
    "Graduate": "Graduate",
    "graduate": "Graduate",
    "Undergraduate": "UG",
    "undergraduate": "UG",
    "Under Graduate": "UG",
    # Edge cases (manual entries)
    "Post Graduate": "PG",
    "Postgraduate": "PG",
    "postgraduate": "PG",
    "Diploma": "Diploma",
    "ITI": "ITI",
}
```

### Stream → academic_level Auto-Correction

The Google Form mixes UG and PG streams in one dropdown.
If someone selected "Undergraduate" but picked a PG stream like MCA,
we must auto-correct `academic_level` to `"PG"`:

```python
PG_STREAMS = {"MCA", "MCom", "MBA", "MSc", "MA"}
UG_STREAMS = {"BBA", "BCA", "BCOM", "BCom", "BSc", "BA"}

def correct_academic_level(raw_academic: str, stream: str) -> str:
    """Map GForms academic value to DB enum and auto-correct UG/PG mismatch."""
    mapped = ACADEMIC_LEVEL_MAP.get(raw_academic, raw_academic)
    
    # Auto-correct: if academic says UG but stream is PG
    if mapped == "UG" and stream in PG_STREAMS:
        return "PG"
    # Auto-correct: if academic says Graduate but stream is UG/PG
    if mapped == "Graduate" and stream in UG_STREAMS:
        return "UG"
    if mapped == "Graduate" and stream in PG_STREAMS:
        return "PG"
    
    return mapped
```

### Auto-Set Fields During Import

All CSV imports set these values automatically:
```python
row["attendee_type"] = "student"    # GForms had no professional option
row["reg_type"] = "pre"             # all imported = pre-registered
row["status"] = "approved"          # auto-approved (already vetted via GForm)
```

> [!IMPORTANT]
> The import endpoint must handle:
> 1. Case-insensitive matching for column names (GForms may export with slight variations)
> 2. Phone number cleaning: strip spaces, dashes, leading zeros
> 3. Email: lowercase + trim whitespace
> 4. Skip rows where phone OR email already exist in DB (deduplication)
> 5. Generate SID for each imported row
> 6. Queue pass emails in batches (280/day Brevo limit)
