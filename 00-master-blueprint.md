# 🎯 Job Fair 2026 — Master Blueprint Index

## Blueprint Documents

| # | Section | File |
|---|---------|------|
| 1 | Architecture Overview | [01-architecture-overview.md](file:///C:/Users/hp/.gemini/antigravity/brain/584b14df-78d8-4e64-86b7-3d11d88d3318/01-architecture-overview.md) |
| 2 | Database Schema (SQL) | [02-database-schema.md](file:///C:/Users/hp/.gemini/antigravity/brain/584b14df-78d8-4e64-86b7-3d11d88d3318/02-database-schema.md) |
| 3 | API Route Specifications | [03-api-routes.md](file:///C:/Users/hp/.gemini/antigravity/brain/584b14df-78d8-4e64-86b7-3d11d88d3318/03-api-routes.md) |
| 4 | Project Structure & Components | [04-project-structure.md](file:///C:/Users/hp/.gemini/antigravity/brain/584b14df-78d8-4e64-86b7-3d11d88d3318/04-project-structure.md) |
| 5 | Railway Config & Env Vars | [05-railway-config.md](file:///C:/Users/hp/.gemini/antigravity/brain/584b14df-78d8-4e64-86b7-3d11d88d3318/05-railway-config.md) |
| 6 | Pillow Pass Generator Code | [06-pass-generator.md](file:///C:/Users/hp/.gemini/antigravity/brain/584b14df-78d8-4e64-86b7-3d11d88d3318/06-pass-generator.md) |
| 7 | Risk Points & Day-by-Day Plan | [07-risks-and-plan.md](file:///C:/Users/hp/.gemini/antigravity/brain/584b14df-78d8-4e64-86b7-3d11d88d3318/07-risks-and-plan.md) |
| 8 | Framer Motion Animations | [08-animations-spec.md](file:///C:/Users/hp/.gemini/antigravity/brain/584b14df-78d8-4e64-86b7-3d11d88d3318/08-animations-spec.md) |

---

## ⚡ Quick Reference: Mandatory Fields

> [!IMPORTANT]
> Only these 6 fields are **mandatory**. Everything else is optional.

| Field | Type | Validation |
|-------|------|------------|
| `full_name` | text | Required, not empty |
| `phone` | text | Required, unique in DB |
| `email` | text | Required, unique in DB, valid format |
| `college_name` | text | Required, not empty |
| `academic_level` | enum | Required for students: UG \| PG \| Diploma \| ITI \| PUC \| Graduate. Backend auto-sets `'Professional'` for professionals. |
| `stream` | text/enum | Required for students (conditional dropdown). Backend auto-sets `'N/A'` for professionals. |

### Optional fields that still appear in the form:
- Principal info (name, email)
- Coordinator info (name, phone, email)
- MBA Specialization (only if stream = MBA)
- Stream Other (free text, only if stream = Others)
- Professional fields (company, designation, experience, graduation details)

---

## 📋 Google Forms CSV Column Mapping

```
Google Form Header                                    → DB Column
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
"Academic Details"                                    → academic_level*
"Graduation Stream"                                   → stream
"MBA Specialization"                                  → mba_specialization
```

*Map "Academic Details" values to enum: "Undergraduate" → "UG", "Postgraduate" → "PG", etc.

---

## 🔧 Tech Stack (from working Izee Culturals project)

Based on analysis of the existing [Izee-Culturals](file:///c:/Users/hp/Desktop/IZee%20Got%20Talent/Izee-Culturals/cultural-fest) project, these **proven** patterns are used:

| Component | Proven Version | File Reference |
|-----------|---------------|----------------|
| FastAPI + Uvicorn | `fastapi==0.136.0`, `uvicorn==0.44.0` | requirements.txt |
| Supabase Python | `supabase==2.28.3` | requirements.txt |
| Pillow | `12.2.0` | requirements.txt |
| qrcode | `8.2` | requirements.txt |
| JWT | `python-jose[cryptography]==3.5.0` | requirements.txt |
| bcrypt | `bcrypt==5.0.0`, `passlib[bcrypt]==1.7.4` | requirements.txt |
| React | `^19.2.4` | package.json |
| Framer Motion | `^12.38.0` | package.json |
| html5-qrcode | `^2.3.8` | package.json |
| Tailwind CSS | `^3.4.19` | package.json |
| Vite | `^6.2.0` | package.json |
| Node.js | `>=22.12.0` | package.json engines |

---

## ✅ Implementation Checklist

### Day 1: Foundation
- [ ] Run SQL schema in Supabase
- [ ] Verify tables, indexes, RLS in dashboard
- [ ] Create backend: `db.py`, `auth.py`, `sid_generator.py`, `create_admin.py`
- [ ] Run `python create_admin.py admin@izeebschool.com YourPassword` (do NOT use SQL seed hash)
- [ ] Implement `/api/admin/login` + `/api/admin/setup`
- [ ] Deploy skeleton to Railway

### Day 2: Registration
- [ ] Scaffold React frontend with Vite
- [ ] Build multi-step RegistrationForm with animations
- [ ] Build conditional dropdown logic
- [ ] Implement `POST /api/register`
- [ ] Test form → API → Supabase flow

### Day 3: Pass & Email
- [ ] Place template PNG in assets
- [ ] Implement `pass_generator.py` with coordinate tuning
- [ ] Implement `email_service.py` with Brevo HTTP API (httpx)
- [ ] Implement `POST /api/onspot`
- [ ] Test end-to-end: register → pass → email

### Day 4: Admin Panel
- [ ] Build admin login + dashboard
- [ ] Build metric cards, registrations table
- [ ] Implement stats, registrations list, approve/reject APIs
- [ ] Implement CSV export
- [ ] Test full admin workflow

### Day 5: Scanner & Polish
- [ ] Build QR scanner page with html5-qrcode
- [ ] Implement `POST /api/scan` with duplicate detection
- [ ] Build CSV import for Google Forms migration
- [ ] End-to-end testing on mobile
- [ ] Final production deploy
