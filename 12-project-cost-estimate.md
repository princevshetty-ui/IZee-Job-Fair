# IZEE Job Fair 2026 — Project Cost Estimate
## Digital Registration & Pass Management System

**Prepared by:** [Your Name], Full-Stack Developer  
**Date:** 29 April 2026  
**Client:** IZEE Business School, Bangalore  
**Delivery:** 8 May 2026 (10-day turnaround)

---

## SECTION 1 — DEVELOPMENT COST BREAKDOWN

### What Is Being Built

A custom full-stack web application — not a template, not a plugin,
not a Google Form. This is purpose-built software designed specifically
for IZEE's event with 4,000–5,000 registrations.

### Module-Wise Effort & Cost

| # | Module | What It Includes | Hours | Rate (₹/hr) | Cost (₹) |
|---|--------|-----------------|-------|-------------|----------|
| 1 | **Database Architecture** | 3 tables, 10 indexes, RLS policies, triggers, schema design | 4 | 500 | 2,000 |
| 2 | **Backend API (FastAPI)** | 15+ REST endpoints, JWT auth (admin + volunteer), input validation, error handling | 16 | 500 | 8,000 |
| 3 | **Registration System** | Multi-step form, conditional dropdowns, student/professional logic, phone/email uniqueness | 8 | 500 | 4,000 |
| 4 | **Digital Pass Generator** | Pillow image generation, QR code overlay, template design, text positioning, base64 encoding | 6 | 500 | 3,000 |
| 5 | **Email Service** | Brevo HTTP API integration, pass attachment, async sending, batch queue for bulk import | 4 | 500 | 2,000 |
| 6 | **Admin Dashboard** | Login, JWT auth, 6 metric cards, paginated table, search, filters, approve/reject workflow | 12 | 500 | 6,000 |
| 7 | **Volunteer System** | Registration, roll number auth, on-spot form, QR scanner, manual SID validation, IST timestamps | 10 | 500 | 5,000 |
| 8 | **QR Code Scanner** | Browser-based camera scanner (html5-qrcode), success/error/duplicate states, auto-reset | 4 | 500 | 2,000 |
| 9 | **CSV Import/Export** | Google Forms column mapping, academic level auto-correction, deduplication, CSV download | 5 | 500 | 2,500 |
| 10 | **UI/UX Design** | Dark theme, Framer Motion animations, mobile-responsive, multi-step transitions, glassmorphism | 6 | 500 | 3,000 |
| 11 | **Deployment & DevOps** | Railway config, CORS setup, env management, production build, domain routing | 3 | 500 | 1,500 |
| 12 | **Testing & Bug Fixes** | End-to-end flow testing, edge cases, duplicate handling, mobile testing | 4 | 500 | 2,000 |
| | **SUBTOTAL (Development)** | | **82 hrs** | | **₹41,000** |

> **Note:** ₹500/hour is a conservative student/freelancer rate.
> The market rate for a mid-level full-stack developer in Bangalore
> is ₹800–1,500/hour. An agency would charge ₹1,500–3,000/hour
> for the same scope.

---

## SECTION 2 — INFRASTRUCTURE COSTS (Monthly)

| # | Service | Plan | Base Cost | Service Fee (+₹100) | Total (₹) |
|---|---------|------|----------|-------------------|----------|
| 1 | Supabase (Database) | Free | ₹0 | +₹100 | **₹100** |
| 2 | Railway (Web Hosting) | Hobby ($5/mo) | ₹420 | +₹100 | **₹520** |
| 3 | Brevo (Email Delivery) | Starter ($9/mo) | ₹756 | +₹100 | **₹856** |
| | **Monthly Infrastructure** | | ₹1,176 | +₹300 | **₹1,476** |

**Infrastructure for 2 months (April + May):** ₹1,476 × 2 = **₹2,952**

After the event, all subscriptions are cancelled. Ongoing cost: ₹0.

---

## SECTION 3 — TOTAL PROJECT COST

| Item | Amount (₹) |
|------|-----------|
| Development (82 hours × ₹500) | ₹41,000 |
| Infrastructure (2 months) | ₹2,952 |
| **GRAND TOTAL** | **₹43,952** |

---

## SECTION 4 — WHAT THE COLLEGE IS GETTING

For context, here's what similar solutions cost in the market:

| Alternative | Cost | Limitations |
|-------------|------|-------------|
| **Hiring a freelancer** (Upwork/Fiverr) | ₹40,000–80,000 | 2–4 week delivery, communication delays |
| **Software agency** (Bangalore) | ₹1,50,000–3,00,000 | 4–6 week delivery, corporate overhead |
| **SaaS event platform** (Eventbrite/Townscript) | ₹15,000–50,000 | No custom pass, no QR gate scan, per-ticket fees |
| **Google Forms + manual work** | Free | No passes, no QR validation, no dashboard, manual email |
| **This custom-built system** | **₹43,952** | Fully custom, delivered in 10 days, tailored to IZEE |

### What ₹43,952 delivers:

- ✅ Custom registration portal (replaces Google Form)
- ✅ Auto-generated branded digital passes with QR codes
- ✅ Automated email delivery of passes
- ✅ Volunteer management system with roll-number authentication
- ✅ Real-time QR scanner for gate entry (works on any phone)
- ✅ Manual SID validation backup (if camera fails)
- ✅ Admin dashboard with live metrics, search, filters
- ✅ One-click approve/reject workflow
- ✅ Google Forms data migration (2,500 existing records)
- ✅ CSV export for post-event reporting
- ✅ On-spot registration for walk-ins
- ✅ Mobile-responsive design
- ✅ Duplicate detection and IST timestamps
- ✅ 2 months of hosting included
- ✅ All source code delivered to college (they own it)

---

## SECTION 5 — DISCOUNTED OPTIONS

Since this is for your own college, you may choose to offer a discount.
Here are some options:

### Option A — Full Rate (No Discount)
| Item | ₹ |
|------|---|
| Development | 41,000 |
| Infrastructure (2 months) | 2,952 |
| **Total** | **₹43,952** |

### Option B — Student Discount (40% off development)
| Item | ₹ |
|------|---|
| Development (discounted) | 24,600 |
| Infrastructure (2 months) | 2,952 |
| **Total** | **₹27,552** |

### Option C — College-Only Rate (60% off development)
| Item | ₹ |
|------|---|
| Development (heavily discounted) | 16,400 |
| Infrastructure (2 months) | 2,952 |
| **Total** | **₹19,352** |

### Option D — Infrastructure Only (Free labor, charge hosting)
| Item | ₹ |
|------|---|
| Development | Free (contributed to college) |
| Infrastructure (2 months) | 2,952 |
| **Total** | **₹2,952** |

---

## SECTION 6 — PAYMENT TERMS (Suggested)

| Milestone | When | Amount |
|-----------|------|--------|
| Advance (project start) | Day 1 | 40% of total |
| Backend + Database complete | Day 4 | 30% of total |
| Full delivery + deployment | Day 8 | 30% of total |

Infrastructure costs are paid separately (monthly subscriptions).

---

> **Your teacher is right.** Even if you choose Option C or D, putting
> a price on your work establishes its value. A system that handles
> 5,000 registrations, generates passes, scans QR codes, and manages
> volunteers is not a "college project" — it's production software.
