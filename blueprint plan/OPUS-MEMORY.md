# 🧠 OPUS MEMORY — Job Fair 2026 Blueprint State
## Last Updated: 29 April 2026 · 6:50 PM IST

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
| Scale | 4,000–5,000 registrations · 1,500 attendees · 80+ companies |
| Developer | Solo BCA student, 1-week deadline |
| Stack | React 19 + Vite 6 + Tailwind CSS v3 + Framer Motion (frontend) · FastAPI + Supabase + Brevo HTTP API (backend) |
| Hosting | Railway (Hobby $5/mo) |
| GitHub | `https://github.com/princevshetty-ui/IZee-Job-Fair` |
| Files Location | `C:\Users\hp\Desktop\IZee Job Fair\` |
| AI Models | `deepseek-ai/deepseek-v4-pro` (primary) · `deepseek-ai/deepseek-v4-flash` (fast) · Gemini 2.5 Pro (AI Studio) |

---

## BLUEPRINT FILES (13 files — ALL COMPLETE & SYNCED)

| # | File | Purpose | Status |
|---|------|---------|--------|
| 00 | `00-master-blueprint.md` | Master index + checklist | ✅ Complete |
| 01 | `01-architecture-overview.md` | ASCII diagrams, feature flows | ✅ Updated — volunteers, /onspot public, resend routes |
| 02 | `02-database-schema.md` | SQL schema, RLS, volunteers table | ✅ Complete — 3 tables (attendees, admin_users, volunteers) |
| 03 | `03-api-routes.md` | All API endpoints with JSON specs | ✅ Updated — resend/{id}, resend-all, public /onspot |
| 04 | `04-project-structure.md` | File tree + component hierarchy | ✅ Rewritten — LandingPage, OnSpotTable, ResendConfirmModal |
| 05 | `05-railway-config.md` | railway.toml, Dockerfile, env vars | ✅ Complete |
| 06 | `06-pass-generator.md` | Pillow code with coordinates | ✅ Complete |
| 07 | `07-risks-and-plan.md` | Risk points + backend code samples | ✅ Complete |
| 08 | `08-animations-spec.md` | Framer Motion specs | ✅ Updated — hero entrance, carousel, floating orbs, stats |
| 09 | `09-kilo-code-backup-plan.md` | 5-session implementation guide | ✅ Rewritten — DeepSeek V4 models, manual tests, repo URL |
| 10 | `10-budget-and-usage-analysis.md` | Supabase usage analysis | ✅ Complete |
| 11 | `11-management-proposal.md` | Cost proposal for management | ✅ Complete |
| 12 | `12-project-cost-estimate.md` | Detailed cost breakdown | ✅ Complete |
|    | `README.md` | GitHub repo README | ✅ Rewritten — setup instructions, env vars |
|    | `OPUS-MEMORY.md` | This file | ✅ Current |

---

## KEY ARCHITECTURAL DECISIONS

1. **NEVER store base64 pass images in Supabase DB** — this caused 11 GB egress in Culturals project. Generate in-memory, email, discard.
2. **academic_level enum** includes `'Professional'`. Backend auto-sets for professional attendees.
3. **SID format**: `{PREFIX}{5-digit random}` — 90,000 combos per prefix, handles 5k+ registrations.
4. **Admin auth**: No SQL seed hash. Use `create_admin.py` or `POST /api/admin/setup` (one-time).
5. **Frontend deploy**: `vite preview` not `npx serve` — no extra dependency.
6. **Email**: Brevo HTTP API v3 via `httpx` — NOT SMTP, NOT SDK.
7. **Volunteer system**: Volunteers register, login with roll_no + email, validate via QR/SID.
8. **On-spot registration**: FULLY PUBLIC — no auth, anyone with `/onspot` link can register. Auto-approved, instant pass.
9. **Company carousel**: Text pills (glassmorphism), NOT logos — no CDN needed, consistent aesthetic.
10. **Landing page**: Dark theme #0a0e1a, Inter + Outfit fonts, floating orb background, CSS marquee.

---

## FEATURE SUMMARY

### Registration Modes
- **Pre-Registration** (`/register`): Public → status=pending → admin approves → pass emailed
- **On-Spot** (`/onspot`): Public, NO auth → status=approved instantly → SID + pass + email all in one shot

### Admin Dashboard (4 Tabs)
- **Pre-Register**: Shows reg_type='pre', approve/reject pending, resend approved
- **On-Spot**: Shows reg_type='onspot', auto-approved (no buttons needed)
- **Attendance**: Validated records with IST timestamps, volunteer name
- **Import**: CSV upload with Google Forms column mapping

### Resend Feature
- Per-row "Resend" button on approved entries → `POST /api/admin/resend/{id}`
- "Resend All Passes" bulk button → confirmation modal → `POST /api/admin/resend-all`

### Volunteer System
- Register → Login (roll_no + email) → JWT → QR scan OR manual SID input
- Validation is INSTANT — response comes back immediately
- Duplicate scan shows IST time: "Already validated at 3:30 PM IST"

### Landing Page (Premium $100k Design)
- Hero: Staggered entrance animation, gradient text (Outfit font), floating orbs background
- Badge: "80+ Companies Hiring" with infinite pulse glow
- CTA: "Register Now" (gradient) + "On-Spot Registration" (outline)
- Stats: Scroll-triggered count-up (4,000+ | 80+ | 1,500+)
- Carousel: 2-row CSS marquee with glassmorphism company name pills (80+)
- Navbar: Transparent → solid on scroll (backdrop-blur glass)

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
- **Added**: `POST /api/admin/setup` route spec
- **Files changed**: 02, 03, 04, 05, 06, 07, 01, 00

### Session 3 — 28 April 2026 (Evening)
- **Created**: `09-kilo-code-backup-plan.md` — NVIDIA NIM + Kilo Code backup
- **Created**: `10-budget-and-usage-analysis.md` — Supabase usage root cause
- **Created**: `11-management-proposal.md` — Cost proposal for management

### Session 4 — 29 April 2026 (Full Day) — FINAL
- **Added**: Volunteer system — DB table, register, login, validate routes
- **Added**: On-spot registration FULLY PUBLIC (no auth, /onspot link)
- **Added**: Admin dashboard 4 tabs: Pre-Register | On-Spot | Attendance | Import
- **Added**: Resend pass per row + "Resend All Passes" bulk with confirmation modal
- **Added**: Landing page — hero entrance, company carousel, floating orbs, stats counter
- **Added**: Session 6 — full 17-test QA prompt for end-to-end verification
- **Added**: Manual test checklists after every session prompt
- **Added**: Local prerequisites (Python venv + Node.js setup)
- **Fixed**: Architecture diagram — correct routes, pages, tables
- **Fixed**: Removed legacy scan.py, VolunteerOnSpotPage, STAFF_PASSWORD
- **Updated**: Models from qwen2.5-coder-32b → DeepSeek V4 Pro/Flash + Mistral Small 4
- **Updated**: Repo URL → https://github.com/princevshetty-ui/IZee-Job-Fair
- **Updated**: README.md — complete rewrite with setup instructions
- **Files changed**: 01, 03, 04, 08, 09, README.md, OPUS-MEMORY.md

---

## GOOGLE FORMS CSV FIELD MAPPING

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

```python
PG_STREAMS = {"MCA", "MCom", "MBA", "MSc", "MA"}

def correct_academic_level(academic_level, stream):
    mapped = ACADEMIC_LEVEL_MAP.get(academic_level, academic_level)
    if mapped == "UG" and stream in PG_STREAMS:
        return "PG"  # auto-correct
    return mapped
```

---

## VOLUNTEER SYSTEM

### DB Table: `volunteers`
```sql
CREATE TABLE IF NOT EXISTS volunteers (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name    TEXT NOT NULL,
    roll_number  TEXT NOT NULL UNIQUE,  -- 12 alphanumeric chars
    phone        TEXT NOT NULL,
    email        TEXT NOT NULL,
    course       TEXT NOT NULL,
    year         TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Routes
- `POST /api/volunteer/register` — public, volunteer self-registers
- `POST /api/volunteer/login` — roll_number + email → JWT
- `POST /api/volunteer/validate` — JWT required, validates attendee by SID (instant response)

### Frontend Pages
- `/volunteer/register` — volunteer registration form
- `/volunteer/validate` — login → QR scanner + manual SID input (instant result display)

---

## IMPLEMENTATION PLAN

All blueprints are complete. Zero code written yet. Follow `09-kilo-code-backup-plan.md`:

| Session | What | Model | Time |
|---------|------|-------|------|
| 1 | Backend Foundation (FastAPI, routes, auth, DB client) | `deepseek-v4-pro` | 45 min |
| 2 | Pass Generator + Email Service + CSV utilities | `deepseek-v4-flash` | 30 min |
| 3 | Frontend (Landing page, forms, volunteer pages) | `deepseek-v4-pro` | 60 min |
| 4 | Admin Dashboard (4 tabs, resend, metrics, import) | `deepseek-v4-pro` | 45 min |
| 5 | Deploy to Railway + manual testing | Manual | 30 min |
| 6 | Full 17-test QA suite | Any model | 30 min |

**Total estimated build time: ~4 hours**

---

## CONTACT / REFERENCE

- GitHub: `https://github.com/princevshetty-ui/IZee-Job-Fair`
- Previous working project: Izee-Culturals at `C:\Users\hp\Desktop\IZee Got Talent\Izee-Culturals\cultural-fest`
- Conversation ID: `584b14df-78d8-4e64-86b7-3d11d88d3318`
- AI Models: DeepSeek V4 Pro/Flash (NVIDIA NIM) · Gemini 2.5 Pro (AI Studio)
