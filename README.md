# IZEE Job Fair 2026 — Digital Registration & Pass System

A custom-built full-stack registration, QR pass generation, and gate validation
system for the IZEE Business School Job Fair / Placement Drive (8 May 2026).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 6 + Tailwind CSS v3 + Framer Motion |
| Backend | FastAPI (Python 3.11) |
| Database | Supabase (PostgreSQL) |
| Email | Brevo HTTP API v3 |
| Hosting | Railway ($5/mo) |

## Features

- 🏠 **Landing page** — Hero with gradient text, company carousel (80+), animated stats
- 📝 **Pre-registration** — Multi-step form with conditional dropdowns
- ⚡ **On-spot registration** — Public instant registration, auto-approved
- 🎫 **Digital passes** — QR code passes generated with Pillow (zero-storage)
- 📧 **Email delivery** — Automated pass delivery via Brevo API
- 👨‍💼 **Admin dashboard** — 4-tab panel (Pre-Register, On-Spot, Attendance, Import)
- 🔄 **Resend passes** — Individual resend + bulk "Resend All" with confirmation
- 🙋 **Volunteer system** — Register, login, QR scan + manual SID validation
- 📱 **QR scanner** — Browser-based camera scanner (works on any phone)
- 📊 **CSV import/export** — Google Forms migration + report downloads
- 🔒 **JWT authentication** — Role-based (admin + volunteer)

## Project Structure

```
IZee Job Fair/
├── backend/          # FastAPI application
├── frontend/         # React + Vite application
├── 00–12 *.md        # Blueprint & documentation files
├── OPUS-MEMORY.md    # AI context handoff file
└── .gitignore
```

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 22+ / npm 10+
- Supabase project (free tier)
- Brevo API key (free tier: 300 emails/day)

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
# Create .env with required environment variables
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
# Create .env with: VITE_API_URL=http://localhost:8000
npm run dev
```

### Environment Variables
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJhbGci...
JWT_SECRET=<generate with: python -c "import secrets; print(secrets.token_hex(32))">
BREVO_API_KEY=xkeysib-xxxx
BREVO_SENDER_EMAIL=noreply@izeebschool.com
BREVO_SENDER_NAME=IZEE Job Fair 2026
```

## Scale

- 4,000–5,000 registrations
- 1,200–1,500 attendees
- 50+ volunteers
- 80+ recruiting companies

## Documentation

See `09-kilo-code-backup-plan.md` for complete implementation guide with session prompts.
