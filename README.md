# IZEE Job Fair 2026 — Digital Registration & Pass System

A custom-built full-stack registration, QR pass generation, and gate validation
system for the IZEE Business School Job Fair / Placement Drive (8 May 2026).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 + Framer Motion |
| Backend | FastAPI (Python) |
| Database | Supabase (PostgreSQL) |
| Email | Brevo HTTP API v3 |
| Hosting | Railway |

## Features

- 📝 Online pre-registration form (multi-step, conditional dropdowns)
- 🎫 Auto-generated digital passes with QR codes (Pillow + qrcode)
- 📧 Automated email delivery via Brevo API
- 👨‍💼 Admin dashboard (approve/reject, metrics, search, filters)
- 🙋 Volunteer system (register, login with roll number, on-spot registration)
- 📱 QR scanner + manual SID validation (browser-based, any phone)
- 📊 CSV import (Google Forms migration) + export (reports)
- 🔒 JWT authentication (admin + volunteer roles)

## Project Structure

```
IZee Job Fair/
├── backend/          # FastAPI application
├── frontend/         # React + Vite application
├── 00–12 *.md        # Blueprint & documentation files
├── OPUS-MEMORY.md    # AI context handoff file
└── .gitignore
```

## Setup

See `09-kilo-code-backup-plan.md` for complete setup instructions.

## Scale

- 4,000–5,000 registrations
- 1,200–1,500 attendees
- 50+ volunteers
