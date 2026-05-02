# IZee Job Fair 2026 - System Requirements & User Flows

*Please provide an estimated development cost and timeline for building the following full-stack web application. The system handles digital registrations, automated ticketing, and day-of-event check-ins for an event expecting 1,500+ attendees.*

## 1. Technical Stack Constraints
- **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion (for premium UI animations)
- **Backend:** Python FastAPI (Uvicorn)
- **Database & Auth:** Supabase (PostgreSQL), JWT authentication
- **Image Processing:** Python Pillow (PIL) + `qrcode` library
- **Email Service:** Brevo API (HTTPx)

---

## 2. Core Features Breakdown

### A. Landing & Registration Interfaces
1. **Animated Landing Page:** High-end UI with hero sections, scrolling company logos marquee, and animated statistic counters (e.g., "4,000+ Registered").
2. **Multi-Step Registration Form (Pre-Registration):**
   - Step 1: Personal Info (Name, Phone, Email, College).
   - Step 2: Conditional Logic Branching. 
     - *If Student:* Shows Academic Level (UG/PG/Diploma) -> cascades to Stream dropdown (BCA, BBA, etc.).
     - *If Professional:* Bypasses academic dropdowns and asks for Company, Designation, and Experience.
   - Step 3: Optional Coordinator/Principal Details.
3. **On-Spot Registration Portal:** A duplicate of the registration form hosted on a different route (`/onspot`) used for walk-ins on the day of the event. Bypasses the approval workflow.

### B. Custom Digital Pass Generation (Backend)
1. **Dynamic Image Compositing:** A Python script using Pillow to open a blank `.png` pass template provided by the design team.
2. **Text Overlay:** Dynamically writing the attendee's Name, College, and a unique System ID (SID) onto exact pixel coordinates on the image using custom fonts (e.g., Inter-Bold).
3. **QR Code Generation:** Generating a unique QR code containing the attendee's SID.
4. **Final Assembly:** Pasting the generated QR code onto the designated box on the pass template and saving it to an in-memory buffer.

### C. Automated Email Delivery
1. **Email Integration:** Connecting to Brevo's transactional email API.
2. **Attachment Handling:** Attaching the dynamically generated digital pass PNG to a formatted HTML email template.
3. **Trigger Logic:** Emails are sent automatically when an Admin clicks "Approve", or instantly when an attendee uses the "On-Spot" registration route.

### D. Admin Dashboard (Role: Admin)
1. **Secure Login:** JWT-protected admin route.
2. **Analytics Overview:** 6 real-time animated metric cards (Total Registered, Total Approved, Pending, Attended, etc.).
3. **Pre-Registration Data Table:** Paginated table to view incoming applications. Includes "Approve" and "Reject" action buttons per row.
4. **On-Spot Data Table:** Read-only table of walk-in attendees.
5. **Attendance Table:** Real-time log of who has checked in with IST timestamps.
6. **Bulk Operations:** 
   - Upload Google Forms CSV to migrate old data.
   - Export all data to CSV.
   - "Resend All Passes" button to blast emails to all approved users.

### E. Volunteer Check-In Portal (Role: Volunteer)
1. **Mobile-First UI:** A separate login for student volunteers at the venue gates.
2. **In-Browser QR Scanner:** Uses the device camera (`html5-qrcode`) to scan digital passes directly from attendees' phone screens.
3. **Manual Fallback:** Text input to manually type the SID if a screen is cracked or the camera fails.
4. **Validation Logic:** 
   - Checks if SID exists and is approved.
   - Checks if attendee has *already* been checked in (prevents duplicate entry).
   - Returns a giant green ✅ success screen or a red ❌ error screen with the attendee's details.

---

## 3. User Flows

### Flow 1: Pre-Registration Attendee
`Landing Page` -> `Fills Multi-step form` -> `Hits Submit` -> *Status is "Pending". Wait for Admin.* -> `Receives Email with Custom Pass Attached`.

### Flow 2: On-Spot Attendee (Day of Event)
`Scans QR at Venue` -> `Fills On-Spot Form` -> `Hits Submit` -> *Status is auto "Approved". Backend instantly generates pass* -> `Receives Email with Custom Pass immediately`.

### Flow 3: Event Organizer (Admin)
`Logs in` -> `Sees 50 Pending applications` -> `Reviews profiles` -> `Clicks 'Approve'` -> *Backend triggers pass generation & sends email* -> `Admin exports CSV at the end of the day`.

### Flow 4: Gate Volunteer (Event Day)
`Logs into volunteer portal on mobile` -> `Attendee walks up showing digital pass` -> `Volunteer scans QR with camera` -> *System marks 'attended=true'* -> `Volunteer sees Green ✅ screen` -> `Lets attendee inside`.
