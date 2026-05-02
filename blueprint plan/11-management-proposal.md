# IZEE Job Fair 2026 — Digital Registration System
## Feature Specification & Infrastructure Cost Proposal

**Prepared for:** College Management, IZEE Business School  
**Prepared by:** Technical Team  
**Date:** 29 April 2026  
**Event:** Job Fair / Placement Drive — 8 May 2026  
**Expected Scale:** 4,000–5,000 registrations · 1,200–1,500 attendees

---

## SECTION 1 — WHAT THIS SYSTEM DOES

This system replaces the current Google Form with a purpose-built digital
registration and entry management platform. Here is every feature, explained
in plain terms.

### Feature 1: Online Pre-Registration Form
**Who uses it:** Any candidate (student or professional) from any college.

Candidates visit a website link, fill a multi-step form with their details,
and submit. Their application enters a queue. An admin reviews and approves
or rejects it. On approval, the system automatically generates a personalised
digital entry pass with a QR code and emails it to the candidate.

### Feature 2: Volunteer Registration
**Who uses it:** IZEE students selected as event volunteers.

Volunteers register via a separate private link shared only with IZEE students.
They provide their Name, 12-digit Roll Number, Phone, Email, Course, and Year.
Roll numbers are strictly unique — no duplicate entries allowed.

### Feature 3: Volunteer Login & QR Validation at Entry Gate
**Who uses it:** Registered volunteers at the venue entrance.

On event day, volunteers open a validation page on their phone. They log in
with their Roll Number + Email (no password needed — only pre-registered
IZEE students can log in). Once logged in, they can:
- **Scan QR codes** from candidates' digital passes using the phone camera
- **Manually type the SID code** (e.g., UGR59134) if scanning doesn't work
- The system shows a green confirmation if valid, or a red warning if the
  pass was already scanned — with the exact time it was first scanned (in IST)

### Feature 4: Volunteer On-Spot Registration
**Who uses it:** Volunteers at registration desks on event day.

Walk-in candidates who didn't pre-register can be registered on the spot.
The volunteer fills the same form, and the system instantly generates a pass
and emails it. No admin approval needed for on-spot entries.

### Feature 5: Admin Dashboard
**Who uses it:** IZEE admin staff (1–2 people).

A secured web dashboard showing:
- **Live counters**: Total pre-registered, on-spot, approved, attended, pending, rejected
- **Searchable data table**: Find any candidate by name, phone, or pass ID
- **Filters**: By status, registration type, academic level, stream
- **One-click approve/reject**: Approve pending registrations individually
- **Attendance view**: See who physically arrived (scanned at gate) with timestamps

### Feature 6: Digital Entry Pass with QR Code
**What it is:** A designed image (JPEG) branded with the IZEE Job Fair identity.

Each pass contains the candidate's name, academic category, stream, a unique
Pass ID (e.g., UGR59134), a "PRE-REGISTERED" or "ON-SPOT" badge, and a
scannable QR code. The pass is emailed as an attachment.

### Feature 7: CSV Data Export (Reports)
**Who uses it:** Admin staff for post-event reporting.

One-click download of:
- All registrations (complete dataset)
- Attended-only records (candidates physically present at the event)

Useful for placement cell records and college management reports.

### Feature 8: Google Forms CSV Import (Data Migration)
**What it does:** Migrates existing ~2,500 responses from the current Google Form
into the new system automatically. Maps columns, removes duplicates, and generates
passes for all imported records.

---

## SECTION 2 — HOW IT ALL FLOWS (End-to-End)

```
BEFORE EVENT DAY
────────────────
1. Admin runs SQL schema in database (one-time, 5 minutes)
2. Admin creates their login credentials (one-time)
3. Google Forms CSV is imported → system auto-approves, generates SIDs
4. Passes are emailed to imported candidates in daily batches
5. Registration link goes live → new candidates register online
6. Admin reviews pending registrations and approves/rejects
7. Approved candidates receive their digital pass via email
8. Volunteers register via a separate private link

EVENT DAY (8 May 2026)
──────────────────────
9.  Volunteers open validation page on their phones
10. Volunteer logs in with Roll Number + Email
11. Candidate shows QR code on phone → volunteer scans it
12. System shows ✅ green "Valid" or ❌ red "Already scanned at 3:30 PM IST"
13. If QR scan fails → volunteer types SID manually → same validation
14. Walk-in candidates → volunteer opens on-spot form → instant pass + email

AFTER EVENT
───────────
15. Admin downloads CSV report of all attendees
16. Data remains in database permanently (no ongoing cost)
```

---

## SECTION 3 — WHAT SERVICES ARE NEEDED

The system requires three cloud services. Each is explained below with
why it's needed and whether the free tier is sufficient.

### Service 1: DATABASE (Supabase)

**What it does:** Stores all candidate registrations, volunteer records,
admin credentials, and attendance logs. Every time someone registers,
gets approved, or is scanned — the data goes here.

**Free tier gives us:** 500 MB storage, 5 GB data transfer per month.

**How much will Job Fair use?**

| Data Type | Size | Free Limit | Usage |
|-----------|------|------------|-------|
| 5,000 registration records | ~2.5 MB | 500 MB | **0.5%** |
| 50 volunteer records | ~25 KB | — | negligible |
| Data transfer (all operations combined) | ~41 MB | 5,000 MB | **0.8%** |

**Result: Free tier is more than enough.** We use less than 1% of the limit.

**Why it's free:** The previous event (Culturals) exceeded limits because
pass images (1 MB each) were stored inside the database. This system is
redesigned to never store images in the database — images are created in
memory, emailed to the candidate, and discarded. This eliminates the problem.

> ✅ **No payment required for the database.**

---

### Service 2: WEB HOSTING (Railway)

**What it does:** Runs our application on the internet — both the website
candidates see and the backend server that processes registrations, generates
passes, and sends emails.

**Free tier:** Railway does NOT have a permanent free tier. They offer a
30-day trial with $5 one-time credit, after which all services shut down.

**Why the trial is not acceptable:**

| Risk | Impact |
|------|--------|
| Trial may expire before event day | Entire system goes offline — no registration, no scanning, no emails |
| Credits may run out mid-trial | Same as above — services stop without warning |
| Trial services have lower priority | Slow response times during peak event-day traffic |

**Hobby plan ($5/month ≈ ₹420/month):**
- Keeps the system running 24/7 until the event and beyond
- Includes $5 of monthly compute credits (our actual usage: ~$2–3)
- No cold starts, no priority throttling

> 🔴 **₹420/month is the mandatory minimum spend.** No free alternative exists
> for reliable web hosting. If this is not paid, the system cannot go live.

---

### Service 3: EMAIL DELIVERY (Brevo)

**What it does:** Sends the digital entry pass to each candidate's email
address as an attachment. Triggered automatically when admin approves a
registration or when a volunteer does on-spot registration.

**Free tier gives us:** 300 emails per day (hard daily limit, resets at midnight).

**Can the free tier handle our volume?**

| Scenario | Emails Needed | Free Tier (300/day) | Works? |
|----------|--------------|---------------------|--------|
| Import 2,500 Google Form records | 2,500 | 280/day × 9 days = 2,520 | ✅ If started by 28 April |
| New online registrations (drip) | ~500 over 10 days | ~50/day | ✅ Easily |
| Event-day on-spot registrations | 100–200 | 300/day limit | ✅ Fits |
| ALL 2,500 in one day | 2,500 | 300/day | ❌ Only 300 sent, 2,200 delayed |

**When does free fail?**
- If admin wants to approve and email ALL candidates in 1–2 days (not 9 days)
- If Google Forms CSV is imported late (after May 3) — not enough days to email all

**Paid plan: Starter ($9/month ≈ ₹756/month):**
- 5,000 emails per month with NO daily cap
- All 2,500 passes can be sent in a single afternoon
- No calendar pressure on when to start approvals

> **Free works if we plan ahead.** Paid required only if all emails must go out fast.

---

## SECTION 4 — COST OPTIONS

### OPTION A — Budget Plan: ₹420/month

| Service | Plan | Cost | What Works | What Needs Planning |
|---------|------|------|------------|---------------------|
| Database (Supabase) | Free | ₹0 | All features fully supported | — |
| Hosting (Railway) | Hobby | ₹420 | 24/7 hosting, reliable | — |
| Email (Brevo) | Free | ₹0 | 300 emails/day | Must start approvals by April 28 (9 days before event) |
| **TOTAL** | | **₹420/month** | | |

**What management must commit to:**
- Begin CSV import and approvals by **April 28** (9 days before event)
- Accept that emails go out in batches of 280 per day
- Accept small Brevo watermark on emails

---

### OPTION B — Recommended: ₹1,176/month

| Service | Plan | Cost | Advantage |
|---------|------|------|-----------|
| Database (Supabase) | Free | ₹0 | Fully sufficient |
| Hosting (Railway) | Hobby | ₹420 | Reliable hosting |
| Email (Brevo) | Starter | ₹756 | Send ALL emails anytime, no daily limit |
| **TOTAL** | | **₹1,176/month** | |

**What management gets:**
- Approve all registrations on any day — passes email instantly
- Import CSV on any date — no calendar dependency
- No anxiety on event day about email limits
- No Brevo branding (optional add-on, not included in base price)

---

### Cost for Full Event (2 months: April + May)

| Option | Monthly | 2-Month Total | After Event |
|--------|---------|--------------|-------------|
| **A (Budget)** | ₹420 | **₹840** | Cancel Railway → ₹0/month ongoing |
| **B (Recommended)** | ₹1,176 | **₹2,352** | Cancel Railway + Brevo → ₹0/month |

All data remains in the free database permanently. CSV reports can be
downloaded anytime in the future at no cost.

---

## SECTION 5 — FEATURES vs PAID REQUIREMENT

| # | Feature | Requires Paid? | Which Service? | Why? |
|---|---------|---------------|----------------|------|
| 1 | Online registration form | ✅ | Railway ₹420 | Needs a server to run the website |
| 2 | Volunteer registration | ✅ | Railway ₹420 | Same server hosts this |
| 3 | QR code scanning + SID validation | ✅ | Railway ₹420 | Scanner needs the backend to verify |
| 4 | On-spot registration | ✅ | Railway ₹420 | Creates records + generates passes |
| 5 | Admin dashboard | ✅ | Railway ₹420 | Runs on the same hosted server |
| 6 | Digital pass generation | ❌ | Free | Generated in server memory, no extra cost |
| 7 | Pass email delivery | ⚠️ Optional | Brevo ₹756 | Free works if emails sent in 9-day batches |
| 8 | CSV export | ❌ | Free | Data already in free database |
| 9 | Google Forms CSV import | ❌ | Free | Runs on existing server |
| 10 | Attendance tracking | ❌ | Free | Stored in free database |

**Summary:** Railway hosting (₹420) is the only mandatory cost.
Brevo Starter (₹756) is recommended for convenience but not essential.
The database is free.

---

## SECTION 6 — RECOMMENDATION

For a **one-time college event** with 4,000–5,000 registrations:

**Our recommendation: Option B at ₹1,176/month (₹2,352 total for 2 months)**

This removes all operational constraints. Admin can work at their own pace,
volunteers can register attendees without worrying about email quotas, and
every candidate receives their pass on time.

After the event, all subscriptions are cancelled. Ongoing cost: **₹0**.
