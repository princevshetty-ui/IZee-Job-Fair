# 🧠 OPUS MEMORY — Job Fair 2026 Blueprint State
## Last Updated: 29 April 2026 · 10:35 AM IST

> This file is the persistent context handoff. If you switch accounts,
> models, or tools — the new instance reads THIS file first to know
> exactly what was built, what changed, and what's left.

---

## PROJECT IDENTITY

| Field | Value |
|-------|-------|
| Project | Job Fair 2026 — Digital Registration & Pass System |
| Organiser | IZEE Business School, Bangalore |
| Event Date | 8 May 2026 |
| Scale | 4,000–5,000 registrations · 1,500 attendees |
| Developer | Solo BCA student, 1-week deadline |
| Stack | React 18 + Vite + Tailwind CSS v3 + Framer Motion (frontend) · FastAPI + Supabase + Brevo HTTP API (backend) |
| Hosting | Railway (Hobby $5/mo) |
| Files Location | `C:\Users\hp\Desktop\IZee Job Fair\` |
| Artifacts Mirror | `C:\Users\hp\.gemini\antigravity\brain\584b14df-78d8-4e64-86b7-3d11d88d3318\` |

---

## BLUEPRINT FILES CREATED (11 files)

| # | File | Purpose | Status |
|---|------|---------|--------|
| 00 | `00-master-blueprint.md` | Master index + checklist | ✅ Done — needs update for volunteer system |
| 01 | `01-architecture-overview.md` | ASCII diagrams, feature flows | ✅ Done — needs volunteer flow added |
| 02 | `02-database-schema.md` | SQL schema, RLS, create_admin.py | ✅ Done — needs volunteers table added |
| 03 | `03-api-routes.md` | All API endpoints with JSON specs | ✅ Done — needs volunteer routes added |
| 04 | `04-project-structure.md` | File tree + component hierarchy | ✅ Done — needs volunteer components |
| 05 | `05-railway-config.md` | railway.toml, Dockerfile, env vars | ✅ Done |
| 06 | `06-pass-generator.md` | Pillow code with coordinates | ✅ Done |
| 07 | `07-risks-and-plan.md` | Risk points + backend code samples | ✅ Done |
| 08 | `08-animations-spec.md` | Framer Motion specs | ✅ Done |
| 09 | `09-kilo-code-backup-plan.md` | NVIDIA NIM + Kilo Code setup | ✅ Done — needs rewrite with volunteer system |
| 10 | `10-budget-and-usage-analysis.md` | Supabase usage analysis | ✅ Done |
| 11 | `11-management-proposal.md` | Cost proposal for management | ✅ Done — needs rewrite with new features |

---

## KEY ARCHITECTURAL DECISIONS

1. **NEVER store base64 pass images in Supabase DB** — this caused 11 GB egress in Culturals project. Generate in-memory, email, discard.
2. **academic_level enum** includes `'Professional'`. Backend auto-sets for professional attendees.
3. **SID format**: `{PREFIX}{5-digit random}` — 90,000 combos per prefix, handles 5k+ registrations.
4. **Admin auth**: No SQL seed hash. Use `create_admin.py` or `POST /api/admin/setup` (one-time).
5. **Frontend deploy**: `vite preview` not `npx serve` — no extra dependency.
6. **Email**: Brevo HTTP API v3 via `httpx` — NOT SMTP, NOT SDK.
7. **Volunteer system**: NEW — volunteers register, login with roll_no + email, handle on-spot registration and QR/SID validation.

---

## CHANGES LOG (Chronological)

### Session 1 — 28 April 2026 (Morning)
- **Created**: All 9 blueprint files (00 through 08)
- **Key decisions**: 6 mandatory fields, 5-digit SID, Brevo HTTP API

### Session 2 — 28 April 2026 (Afternoon)
- **Fixed**: `academic_level` CHECK constraint → added `'Professional'`
- **Fixed**: Removed fake admin SQL hash → added `create_admin.py` script
- **Fixed**: Railway frontend `npx serve` → `npx vite preview`
- **Fixed**: SID_PREFIXES `'professional'` (lowercase) → `'Professional'` (matches enum)
- **Fixed**: `generate_sid()` — removed attendee_type branching, uses academic_level directly
- **Added**: `POST /api/admin/setup` route spec
- **Added**: `ACADEMIC_DISPLAY['Professional'] = 'WORKING PROFESSIONAL'`
- **Files changed**: 02, 03, 04, 05, 06, 07, 01, 00 (all synced)

### Session 3 — 28 April 2026 (Evening)
- **Created**: `09-kilo-code-backup-plan.md` — NVIDIA NIM + Kilo Code backup
- **Created**: `10-budget-and-usage-analysis.md` — Supabase usage root cause
- **Created**: `11-management-proposal.md` — Cost proposal for management
- **Analysis**: Supabase egress spike caused by 1MB images stored in DB
- **Projection**: Job Fair without images = 41MB egress (0.8% of free tier)

### Session 4 — 29 April 2026 (Morning) — CURRENT
- **Pending**: Add volunteer system (registration, auth, QR/SID validation)
- **Pending**: Fix CSV import mapping for Google Forms fields
- **Pending**: Rewrite implementation guide (start-to-finish)
- **Pending**: Rewrite management proposal with new features
- **Pending**: Create this OPUS-MEMORY.md file

---

## GOOGLE FORMS CSV FIELD MAPPING

The existing Google Form has different field names than our DB schema.
Import logic must handle these mappings:

```
Google Form Column                                      → DB Column            → Special Handling
────────────────────────────────────────────────────────────────────────────────────────────────
"Name"                                                  → full_name            → Direct map
"Contact No"                                            → phone                → Strip spaces, add +91 if needed
"Email"                                                 → email                → Lowercase, trim
"College Name"                                          → college_name         → Direct map
"Principal Name"                                        → principal_name       → Direct map
"Principal email id"                                    → principal_email      → Direct map
"Name - College Co-ordinator/Placement Head"            → coordinator_name     → Direct map
"Contact no - College Coordinator/Placement Head"       → coordinator_phone    → Strip spaces
"Email - College Coordinator/Placement Head"            → coordinator_email    → Direct map
"Academic Details"                                      → academic_level       → SEE MAPPING BELOW
"Graduation Stream"                                     → stream               → Direct map
"MBA Specialization"                                    → mba_specialization   → Direct map
```

### Academic Details → academic_level Mapping

```python
ACADEMIC_LEVEL_MAP = {
    "PUC pass": "PUC",
    "PUC Pass": "PUC",
    "puc pass": "PUC",
    "Graduate": "Graduate",
    "graduate": "Graduate",
    "Undergraduate": "UG",
    "undergraduate": "UG",
    "Under Graduate": "UG",
    "Post Graduate": "PG",
    "Postgraduate": "PG",
}
```

### Stream → academic_level Auto-Correction

If academic_level is "Undergraduate" but stream is MCA/MCom/MBA → override to "PG".

```python
PG_STREAMS = {"MCA", "MCom", "MBA", "MSc", "MA"}

def correct_academic_level(academic_level, stream):
    mapped = ACADEMIC_LEVEL_MAP.get(academic_level, academic_level)
    if mapped == "UG" and stream in PG_STREAMS:
        return "PG"  # auto-correct
    return mapped
```

---

## VOLUNTEER SYSTEM (NEW — Session 4)

### New DB Table: `volunteers`
```sql
CREATE TABLE IF NOT EXISTS volunteers (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name    TEXT NOT NULL,
    roll_number  TEXT NOT NULL UNIQUE,  -- 12-digit alphanumeric
    phone        TEXT NOT NULL,
    email        TEXT NOT NULL,
    course       TEXT NOT NULL,
    year         TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### New Routes
- `POST /api/volunteer/register` — public, volunteer self-registers
- `POST /api/volunteer/login` — roll_number + email → JWT
- `POST /api/volunteer/onspot` — authenticated volunteer creates on-spot registration
- `POST /api/volunteer/validate` — authenticated volunteer validates SID (QR or manual input)

### New Frontend Pages
- `/volunteer/register` — volunteer registration form
- `/volunteer/validate` — login → QR scanner + manual SID input

### Auth Flow
1. Volunteer registers at `/volunteer/register` (Name, Roll No, Phone, Email, Course, Year)
2. On event day, volunteer opens `/volunteer/validate`
3. Enters Roll No + Email → gets JWT token
4. Can now scan QR or type SID manually to validate attendees
5. Same volunteer can access `/volunteer/onspot` to do on-spot registrations

---

## WHAT'S LEFT TO BUILD (Implementation — no code written yet)

All files above are **blueprints only**. Zero code has been written.
The developer needs to:

1. Create Supabase project + run SQL schema
2. Build backend (FastAPI) from blueprint specs
3. Build frontend (React) from component specs
4. Deploy to Railway
5. Import Google Forms CSV
6. Test end-to-end

---

## CONTACT / REFERENCE

- Previous working project: Izee-Culturals at `C:\Users\hp\Desktop\IZee Got Talent\Izee-Culturals\cultural-fest`
- Conversation ID: `584b14df-78d8-4e64-86b7-3d11d88d3318`
- Kilo Code backup: NVIDIA NIM API with `qwen/qwen2.5-coder-32b-instruct`
