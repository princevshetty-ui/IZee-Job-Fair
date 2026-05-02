# Frontend UI/UX Flaws & Fixes Report
**Date:** 2026-05-02  
**Audited by:** deepseekv4flash  
**Project:** IZEE Job Fair Frontend

---

## FLAW 1 — Tailwind CSS v3/v4 API Incompatibility (CRITICAL)

**Location:** `tailwind.config.js`, `index.css`, `package.json`

**Problem:** The codebase mixes Tailwind CSS v3 and v4 APIs, which are incompatible:
1. `tailwind.config.js` uses v3 `plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]` — v4 uses a different plugin system
2. `index.css` uses `@import "tailwindcss"` (v4 syntax) but also has `tailwind.config.js` (v3 pattern)
3. `@tailwindcss/vite` plugin is v4; `@tailwindcss/forms` and `@tailwindcss/typography` are v3 packages

**Impact:** Build failures, missing styles, or silently broken utility classes. Theme extension values (like `backdropBlur.xl`) may not apply.

**Fix:** Remove `tailwind.config.js` — v4 uses CSS-based config. Remove v3 plugin dependencies. Use CSS `@theme` directive for any custom values. Or use `@layer utilities` for custom utility classes.

---

## FLAW 2 — `useCountUp` Hook Called Inside JSX (CRITICAL)

**Location:** `MetricCards.jsx:14,25,36,47,58,69`

**Problem:** React hooks must be called at the **top level** of a component, but `useCountUp()` is called **inside JSX expressions**:

```jsx
<div className="text-2xl font-bold mt-2">
  {useCountUp(metrics.total_pre_registered)}  {/* Hook inside JSX! */}
</div>
```

React enforces this via the **Rules of Hooks** — it will produce a warning/error and the count-up animation will be broken/unreliable.

**Fix:** Call all `useCountUp` hooks at the top of the component and use the returned values in JSX.

---

## FLAW 3 — LoadingSpinner Template Literal Bug (CRITICAL)

**Location:** `LoadingSpinner.jsx:3`

**Problem:** The JSX uses backslash-escaped backticks and `\${}` which renders as **literal text** instead of template literal syntax:

```jsx
<div className={`inline-block ${className} border-2 ${color} border-t-transparent rounded-full animate-spin`}></div>
```

The `\`` and `\$` escape sequences produce literal backtick and dollar-sign characters in the rendered HTML className instead of actual template interpolation.

**Impact:** The spinner never receives the correct `className` or `color` props, making it invisible or broken when used.

**Fix:** Use proper template literals with actual backticks (no backslash escaping).

---

## FLAW 4 — Hardcoded `/src/assets/` Paths (HIGH)

**Location:** `Navbar.jsx:10`, `LandingPage.jsx:324`, `index.css:5-8,16`

**Problem:** Asset paths use `/src/assets/...` which works during Vite dev but **breaks in production builds**. Vite hashes filenames in `dist/`, so hardcoded paths will 404.

| File | Line | Asset |
|------|------|-------|
| `Navbar.jsx` | 10 | `/src/assets/images/college-logo.png` |
| `LandingPage.jsx` | 324 | `/src/assets/images/college-logo.png` |
| `index.css` | 5-8 | `/src/assets/fonts/Montage.*` |
| `index.css` | 16 | `/src/assets/fonts/Nevarademo-6YXEY.otf` |

**Impact:** In production (Railway deployment), logos and fonts will 404.

**Fix:** Import images in JSX (`import logo from '../assets/images/college-logo.png'`) and use the imported variable. For CSS font-face, place font files in `public/fonts/` or use Vite's `?url` import syntax.

---

## FLAW 5 — Dynamic Tailwind Class in ProfileModal (MEDIUM)

**Location:** `ProfileModal.jsx:15`

**Problem:** Tailwind scans source for complete class strings. Dynamic construction doesn't work:

```jsx
className={`text-${registration.status === 'approved' ? 'green' : 'red'}-500`}
```

Tailwind's JIT compiler sees `text-` + dynamic value, not `text-green-500` / `text-red-500`. The color will never apply.

**Fix:** Use full class strings or a mapping object.

---

## FLAW 6 — CSVImportModal Wrong Content-Type for FormData (MEDIUM)

**Location:** `CSVImportModal.jsx:19-22`

**Problem:** Setting `Content-Type: application/json` while sending `FormData` is incorrect. For multipart uploads, the browser must auto-set the `Content-Type` with the correct `boundary` parameter. Setting a manual `Content-Type` causes the server to fail parsing the file.

**Fix:** Remove the manual `Content-Type` header when sending FormData. The browser will set the correct `multipart/form-data` with boundary.

---

## FLAW 7 — Missing Loading State in AdminDashboard (MEDIUM)

**Location:** `AdminDashboard.jsx:27-63`

**Problem:** The dashboard fetches 4 API endpoints with no **loading indicator**. Users see empty tables/cards until data arrives. On slow networks, this looks broken.

**Fix:** Add a `loading` state and show loading skeletons or spinners while fetching.

---

## FLAW 8 — No Auth Guard on AdminDashboard (MEDIUM)

**Location:** `AdminDashboard.jsx`

**Problem:** If the token expires (401), there's no redirect to login. The `api.js` utility handles 401 for `apiCall`, but AdminDashboard uses raw `fetch()` which has no such guard. User sees a blank/broken dashboard with no feedback.

**Fix:** Add token expiration check on mount, redirect to `/admin` if invalid. Or add a 401 interceptor.

---

## FLAW 9 — No 404 Catch-All Route (MEDIUM)

**Location:** `App.jsx:16-24`

**Problem:** Unknown paths like `/random` will render a blank white page — no user feedback.

**Fix:** Add a `<Route path="*" element={<NotFound />} />` at the end of the Routes.

---

## FLAW 10 — HTML Title Says "frontend" (LOW)

**Location:** `index.html:10`

**Problem:** `<title>frontend</title>` is the default Vite template title. Should be descriptive.

**Fix:** Change to `<title>IZEE Job Fair 2026 | Register Now</title>` or similar.

---

## FLAW 11 — Montserrat Font Not in Tailwind Config (LOW)

**Location:** `tailwind.config.js`, `index.css:23-31`

**Problem:** The CSS declares `font-family: 'Montserrat', sans-serif` on body, but the Tailwind config doesn't include Montserrat in the `fontFamily` theme. Utility classes like `font-sans` resolve to `Inter` instead.

**Fix:** Add `Montserrat` as the primary font in Tailwind config.

---

## FLAW 12 — Admin Tabs Not Mobile-Friendly (MEDIUM)

**Location:** `AdminDashboard.jsx:81-107`

**Problem:** Tab buttons use `flex space-x-4` with no wrapping. On small screens, buttons overflow the viewport horizontally.

**Fix:** Use `flex-wrap` or stack vertically on small screens.

---

## FLAW 13 — Tables Lack Horizontal Scroll Hint (LOW)

**Location:** `RegistrationsTable.jsx`, `OnSpotTable.jsx`, `AttendanceTable.jsx`

**Problem:** Tables are wrapped in `overflow-x-auto` but there's no visual indicator that more columns exist off-screen. Users may miss columns like "Actions" on mobile.

**Fix:** Add a subtle gradient fade or shadow on the right edge to indicate scrollable content. Or stack rows as cards on mobile.

---

## FLAW 14 — VolunteerValidatePage QR Cleanup Risk (LOW)

**Location:** `VolunteerValidatePage.jsx:33-36`

**Problem:** The cleanup function calls `qr.stop()` and `qr.clear()` with empty catch handlers. If the scanner hasn't fully initialized, this can throw unhandled rejections.

**Fix:** Use a ref to track initialization state, and add more robust error handling.

---

## FLAW 15 — Missing `type="button"` on Some Buttons (LOW)

**Location:** Various admin components

**Problem:** Buttons inside forms (like Approve/Reject in `RegistrationsTable.jsx`) lack `type="button"`, causing unintended form submission when clicked inside a table context.

**Fix:** Add `type="button"` to all non-submit buttons.

---

## Summary

| Severity | Count | Issues |
|----------|-------|--------|
| CRITICAL | 3 | Tailwind v3/v4 mix, useCountUp hook violation, LoadingSpinner literal bug |
| HIGH | 1 | Hardcoded asset paths break in production |
| MEDIUM | 6 | Dynamic classes, FormData header, loading state, auth guard, 404, mobile tabs |
| LOW | 5 | Title, font config, table scroll hint, QR cleanup, button types |

**Total: 15 flaws identified**