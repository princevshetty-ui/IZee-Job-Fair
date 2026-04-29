# 💰 Job Fair 2026 — Usage Analysis & Budget Plan (₹4,000 Cap)

---

## 🔴 PART 1: Why Your Supabase Free Tier Exploded

### Current Usage (from your screenshots)

| Metric | Used | Free Limit | Status |
|--------|------|------------|--------|
| **Egress** | 11.324 GB | 5 GB | 🔴 226% — EXCEEDED |
| **Database Size** | 0.608 GB | 0.5 GB | 🔴 122% — EXCEEDED |
| Cached Egress | 0 GB | 5 GB | ✅ OK |
| Monthly Active Users | 0 | 50,000 | ✅ OK |
| Storage Size | 0 GB | 1 GB | ✅ OK |
| Realtime Messages | 0 | 2,000,000 | ✅ OK |
| Edge Functions | 0 | 500,000 | ✅ OK |
| Peak Connections | 0 | 200 | ✅ OK |

### Root Cause: Base64 Pass Images Stored in Database

Your **Izee Culturals** project stored pass images as base64 strings
in the `pass_image_url` column of the `attendees` table. Here's the math:

```
Each pass image ≈ 1 MB (base64 encoded JPEG)

Database writes (INSERT/UPDATE with base64):
  300 approvals × 1 MB = 300 MB written to DB → inflates DB size

Database reads (admin panel loading all rows with base64):
  Admin opens dashboard → SELECT * → fetches ALL columns including base64
  300 rows × 1 MB = 300 MB per full table load
  If admin refreshed 10× per day for a week: 300 MB × 70 = 21 GB egress
  
  But you also had the approval flow reading rows:
  Each approval: read attendee (1MB) + update + read again = ~3 MB
  300 approvals: 300 × 3 MB = 900 MB

  Total realistic estimate: ~11 GB egress ✓ (matches your 11.32 GB)
```

**Database size: 0.608 GB** — This is exactly 300 × 1 MB base64 images
+ ~100 MB of actual row data + PostgreSQL overhead. Checks out.

### The Fix for Job Fair 2026

> [!CAUTION]
> **NEVER store base64 pass images in the Supabase database.**
> This is already reflected in the updated blueprint. The pass image is:
> 1. Generated in-memory by Pillow on the backend
> 2. Sent via Brevo email as an attachment
> 3. Discarded — NOT saved to DB
> 4. If needed again → regenerated on-the-fly

---

## 🟢 PART 2: Job Fair 2026 — Real-Time Usage Projection

### Assumptions
- **5,000 total registrations** (pre-reg + on-spot)
- **2,500 pre-registrations** (approved in batches)
- **1,500 on-spot** registrations on event day
- **1,500 QR scans** at the gate
- Admin panel used by 1-2 people for ~7 days

### Per-Operation Data Size (WITHOUT storing images in DB)

| Operation | Supabase Data | Count | Total |
|-----------|--------------|-------|-------|
| Registration INSERT | ~500 bytes/row | 5,000 | 2.5 MB |
| Admin read (list page, 25 rows) | ~12 KB | 200 loads | 2.4 MB |
| Admin read (stats) | ~200 bytes | 500 | 100 KB |
| Approval UPDATE | ~200 bytes | 2,500 | 500 KB |
| Scan UPDATE | ~200 bytes | 1,500 | 300 KB |
| CSV export (all rows) | ~2.5 MB | 10 | 25 MB |
| CSV import (bulk read+insert) | ~2.5 MB | 3 | 7.5 MB |
| Search queries | ~5 KB each | 500 | 2.5 MB |

### Totals (Job Fair Only)

| Metric | Projected Usage | Free Limit | % Used | Safe? |
|--------|----------------|------------|--------|-------|
| **Egress** | ~41 MB | 5 GB (5,120 MB) | 0.8% | ✅ VERY safe |
| **Database Size** | ~5 MB (rows only) | 500 MB | 1% | ✅ VERY safe |
| **MAU** | 0 (no Supabase Auth) | 50,000 | 0% | ✅ |
| **Storage** | 0 (no file storage) | 1 GB | 0% | ✅ |
| **Connections** | ~5 concurrent | 200 | 2.5% | ✅ |

### Verdict: Free Tier is FINE for Job Fair

**IF you don't store images in the database**, the Job Fair project
will use less than 1% of the free egress limit. The issue was entirely
caused by storing 1 MB base64 strings in the DB.

---

## 🟡 PART 3: The Culturals-Fest Problem

Your free tier is already **exceeded** (grace period until May 26).
You have two options:

### Option A: Create a NEW Supabase project for Job Fair (FREE)

Supabase free tier allows **2 active projects**. If you only have
"Culturals-fest" right now:

1. Create a new project specifically for Job Fair
2. The new project gets its **own** 5 GB egress and 500 MB DB limits
3. The old Culturals-fest project can be paused (or deleted if no longer needed)

> [!IMPORTANT]
> If your Culturals-fest event is over and you don't need it running,
> **pause or delete it**. This frees up your org-level quota.
> But check: org-level egress is shared across projects.

### Option B: Upgrade to Supabase Pro ($25/month = ~₹2,100/month)

Only needed if:
- You want to keep Culturals-fest AND Job Fair running simultaneously
- Or if the org-level egress is already burned this billing cycle

---

## 💸 PART 4: Budget Breakdown (₹4,000 Total Cap)

### Scenario 1: Maximum Free (₹420 total)

| Service | Plan | Cost (USD) | Cost (INR) | Notes |
|---------|------|-----------|------------|-------|
| Supabase | **Free** (new project) | $0 | ₹0 | Pause old Culturals project first |
| Railway (backend) | **Hobby** | $5/mo | ₹420 | Includes $5 credits — enough for event |
| Railway (frontend) | Same account | $0 | ₹0 | Hobby plan covers both services |
| Brevo | **Free** | $0 | ₹0 | 300 emails/day — send in batches |
| NVIDIA NIM | **Free** | $0 | ₹0 | Dev credits for Kilo Code backup |
| **TOTAL** | | **$5** | **~₹420** | |

> [!TIP]
> This is the recommended path. Railway Hobby at $5/month is the **only**
> mandatory paid service. Everything else can stay free.

### Scenario 2: If Supabase Org Quota is Burned (₹2,520 total)

If the org-level egress is burned and you can't create a clean project:

| Service | Plan | Cost (USD) | Cost (INR) | Notes |
|---------|------|-----------|------------|-------|
| Supabase | **Pro** | $25/mo | ₹2,100 | 250 GB egress, 8 GB DB |
| Railway | **Hobby** | $5/mo | ₹420 | Backend + frontend |
| Brevo | **Free** | $0 | ₹0 | 300/day sufficient |
| **TOTAL** | | **$30** | **~₹2,520** | |

### Scenario 3: Full Safety Net (₹3,780 total)

If you want zero risk of hitting any limits:

| Service | Plan | Cost (USD) | Cost (INR) | Notes |
|---------|------|-----------|------------|-------|
| Supabase | **Pro** | $25/mo | ₹2,100 | Covers everything |
| Railway | **Hobby** | $5/mo | ₹420 | Backend + frontend |
| Brevo | **Starter** | $9/mo | ₹756 | 5,000 emails/month, no daily cap |
| Custom Domain | Optional | $6/yr | ₹504 | Professional look (Namecheap .in) |
| **TOTAL** | | **$45** | **~₹3,780** | ✅ Under ₹4,000 |

---

## 🎯 PART 5: Recommended Action Plan

### Immediate (Tonight)

1. **Check if you can create a new Supabase project**
   - Go to Supabase Dashboard → New Project
   - If it lets you → create "Job Fair 2026" project
   - If it blocks you (org quota exceeded) → you need Pro plan

2. **Verify Brevo API key works**
   - Go to Brevo → SMTP & API → API Keys
   - Generate a new API key if needed
   - Test: `curl -X POST https://api.brevo.com/v3/smtp/email ...`

### Before Development Starts

3. **Set up Railway Hobby plan**
   - Sign up at [railway.app](https://railway.app)
   - Add payment method ($5/month)
   - Create a new project with 2 services: "backend" + "frontend"

### Pass Image Optimization (CRITICAL)

4. **Compress pass images to ~150-200 KB instead of 1 MB**
   ```python
   # In pass_generator.py, change quality:
   final.save(buffer, format='JPEG', quality=75)  # was 92
   
   # Also resize template if it's huge:
   # Ideal template size: 1200×800 pixels (not 3000×2000)
   ```
   
   This means:
   - 5,000 emails × 200 KB = 1 GB total Brevo data (fits free tier easily)
   - Zero DB impact (images never touch Supabase)

---

## ⚠️ Where Upgrades Are Genuinely Needed

| Service | Free Works? | Upgrade Needed? | Reason |
|---------|-------------|-----------------|--------|
| **Supabase** | ✅ YES (new project) | Only if org-level quota is burned | Without images in DB, free tier is 98% headroom |
| **Railway** | ❌ No free tier | ✅ YES — Hobby $5/mo mandatory | Trial is only 30 days, need persistent hosting |
| **Brevo** | ✅ YES (300/day) | Optional — Starter $9/mo | Only if you need to send 2,500+ emails in 1 day (unlikely) |
| **Domain** | ✅ Railway provides URL | Optional | Professional look only |

### Final Verdict

> **Minimum spend: ₹420/month (Railway Hobby only)**
> Everything else can stay free if you:
> 1. Create a new Supabase project (or pause old one)
> 2. NEVER store images in the database
> 3. Compress pass images to ~200 KB
> 4. Send emails in batches of 280/day via Brevo free

---

## 📊 Brevo Email Batching Math

```
Total emails to send: 5,000 (worst case, all get approved)
Brevo free limit: 300/day (use 280 for safety margin)

Day 1: 280 emails  (CSV import batch 1)
Day 2: 280 emails  (CSV import batch 2)  
Day 3: 280 emails  (CSV import batch 3)
...
Day 18: last batch

For the event (May 8), start CSV import by April 20 to finish all emails.
On-spot registrations (event day): ~100-200 emails — fits in single day's quota.
```

> [!WARNING]
> If you need ALL 2,500 pre-registrations emailed in 1-2 days,
> you MUST upgrade Brevo to Starter ($9/mo = ₹756).
> Starter plan: 5,000 emails/month with NO daily cap.
