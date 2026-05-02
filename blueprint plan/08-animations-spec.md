# Job Fair 2026 — Animations & Framer Motion Specs

## Registration Form — Multi-Step Transitions

```jsx
// RegistrationForm.jsx — step transition wrapper
import { AnimatePresence, motion } from 'framer-motion';

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const goNext = () => { setDirection(1); setStep(s => s + 1); };
  const goBack = () => { setDirection(-1); setStep(s => s - 1); };

  return (
    <div className="relative overflow-hidden min-h-[400px]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {step === 1 && <PersonalInfoStep onNext={goNext} />}
          {step === 2 && <AcademicDetailsStep onNext={goNext} onBack={goBack} />}
          {step === 3 && <CollegeInfoStep onBack={goBack} onSubmit={handleSubmit} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

## Conditional Dropdown — AnimatePresence

```jsx
// AcademicDetailsStep.jsx — conditional stream dropdown
<AnimatePresence mode="wait">
  {showStreamDropdown && (
    <motion.div
      key="stream-dropdown"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
    >
      <FormField
        label="Stream *"
        type="select"
        options={getStreamsForLevel(academicLevel)}
        value={stream}
        onChange={setStream}
      />
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence mode="wait">
  {stream === 'MBA' && (
    <motion.div
      key="mba-spec"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <FormField
        label="MBA Specialization"
        type="select"
        options={MBA_SPECIALIZATIONS}
        value={mbaSpec}
        onChange={setMbaSpec}
      />
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence mode="wait">
  {stream === 'Others' && (
    <motion.div
      key="stream-other"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <FormField
        label="Specify your course"
        type="text"
        value={streamOther}
        onChange={setStreamOther}
      />
    </motion.div>
  )}
</AnimatePresence>
```

## Submit Button — Loading State

```jsx
<motion.button
  type="submit"
  disabled={isSubmitting}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl 
             font-semibold disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors hover:bg-indigo-700"
>
  {isSubmitting ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="inline-block w-5 h-5 border-2 border-white 
                 border-t-transparent rounded-full"
    />
  ) : (
    "Submit Registration"
  )}
</motion.button>
```

## Scanner — Success Screen

```jsx
// ScanSuccess.jsx
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 260, damping: 20 }}
  className="bg-green-900/30 border border-green-500/50 rounded-2xl p-8 text-center"
>
  {/* Checkmark icon */}
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
  >
    <svg className="w-20 h-20 mx-auto text-green-400" /* checkmark SVG */ />
  </motion.div>

  {/* Attendee name */}
  <motion.h2
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="text-2xl font-bold text-white mt-4"
  >
    {attendee.full_name}
  </motion.h2>

  {/* Category badge */}
  <motion.p
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="text-green-300 mt-2"
  >
    {attendee.academic_level} · {attendee.stream}
  </motion.p>

  {/* Auto-reset countdown */}
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="text-gray-400 text-sm mt-4"
  >
    Resetting in {countdown}s...
  </motion.p>
</motion.div>
```

## Scanner — Error/Duplicate Screen

```jsx
// ScanError.jsx
<motion.div
  initial={{ x: 0 }}
  animate={{ x: [0, -10, 10, -10, 10, 0] }}  // shake
  transition={{ duration: 0.4 }}
  className="bg-red-900/30 border border-red-500/50 rounded-2xl p-8 text-center"
>
  <svg className="w-16 h-16 mx-auto text-red-400" /* warning icon */ />
  <h2 className="text-xl font-bold text-red-300 mt-4">
    {isDuplicate ? "Already Scanned" : "Invalid QR"}
  </h2>
  {isDuplicate && (
    <p className="text-red-200 mt-2">
      {attendee.full_name} — checked in at {formatTime(attendee.attended_at)}
    </p>
  )}
</motion.div>
```

## Admin — Metric Cards Count-Up

```jsx
// hooks/useCountUp.js
import { useState, useEffect, useRef } from 'react';

export function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(target);
    };
    
    requestAnimationFrame(animate);
    return () => { startTime.current = null; };
  }, [target, duration]);

  return count;
}

// MetricCards.jsx
function MetricCard({ label, value, color }) {
  const displayValue = useCountUp(value);
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6`}
    >
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>
        {displayValue.toLocaleString()}
      </p>
    </motion.div>
  );
}
```

## Admin — Table Row Fade on Approve/Reject

```jsx
// RegistrationsTable.jsx
<AnimatePresence>
  {filteredRows.map((row) => (
    <motion.tr
      key={row.id}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
      transition={{ duration: 0.3 }}
    >
      {/* ... table cells ... */}
    </motion.tr>
  ))}
</AnimatePresence>
```

## Page Wrapper — AnimatedPage

```jsx
// shared/AnimatedPage.jsx
import { motion } from 'framer-motion';

export default function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

## Landing Page — Hero Entrance Animation

```jsx
// LandingPage.jsx — Hero Section
// The hero uses staggered entrance animations for a cinematic reveal

const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const heroItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } // custom ease-out
  }
};

<motion.div variants={heroContainer} initial="hidden" animate="visible">
  {/* Heading — gradient text */}
  <motion.h1 variants={heroItem}
    className="text-6xl md:text-8xl font-black tracking-tight"
    style={{
      fontFamily: "'Outfit', sans-serif",
      background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    IZEE JOB FAIR 2026
  </motion.h1>

  {/* Subtitle */}
  <motion.p variants={heroItem}
    className="text-xl md:text-2xl text-gray-400 mt-4"
  >
    8th May 2026 · IZEE Business School, Bangalore
  </motion.p>

  {/* Glowing badge */}
  <motion.div variants={heroItem}
    className="inline-flex items-center gap-2 mt-6 px-5 py-2.5
               bg-blue-500/10 border border-blue-500/30 rounded-full"
    animate={{
      boxShadow: [
        '0 0 15px rgba(59,130,246,0.2)',
        '0 0 30px rgba(59,130,246,0.4)',
        '0 0 15px rgba(59,130,246,0.2)',
      ]
    }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
    <span className="text-blue-300 font-semibold">80+ Companies Hiring</span>
  </motion.div>

  {/* CTA Buttons */}
  <motion.div variants={heroItem} className="flex gap-4 mt-8">
    <motion.a href="/register"
      whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(59,130,246,0.5)' }}
      whileTap={{ scale: 0.95 }}
      className="px-8 py-3.5 rounded-xl font-semibold text-white
                 bg-gradient-to-r from-blue-500 to-purple-500
                 hover:from-blue-400 hover:to-purple-400 transition-all"
    >
      Register Now
    </motion.a>
    <motion.a href="/onspot"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-8 py-3.5 rounded-xl font-semibold text-white
                 border border-white/20 hover:bg-white/5 transition-all"
    >
      On-Spot Registration
    </motion.a>
  </motion.div>
</motion.div>
```

## Landing Page — Floating Background Shapes

```jsx
// Animated floating orbs behind the hero (CSS + Framer Motion)
// These create a subtle, alive background

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blue orb — top left */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full
                   bg-blue-500/10 blur-[120px]"
        style={{ top: '-10%', left: '-10%' }}
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Purple orb — bottom right */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full
                   bg-purple-500/10 blur-[100px]"
        style={{ bottom: '-5%', right: '-5%' }}
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Pink orb — center */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full
                   bg-pink-500/5 blur-[80px]"
        style={{ top: '40%', left: '50%' }}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
```

## Landing Page — Company Carousel (Infinite Marquee)

```css
/* index.css — Marquee animation for company carousel */
/* Uses pure CSS for buttery smooth 60fps scrolling */

@keyframes marquee-left {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes marquee-right {
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.marquee-left {
  animation: marquee-left 40s linear infinite;
}

.marquee-right {
  animation: marquee-right 40s linear infinite;
}

.marquee-container:hover .marquee-left,
.marquee-container:hover .marquee-right {
  animation-play-state: paused;
}
```

```jsx
// CompanyCarousel.jsx — Infinite auto-scroll marquee
// Company names displayed as glassmorphism pills, NOT logos
// (logos require hosting/CDN — text pills look more premium and consistent)

const COMPANIES = [
  "TCS", "Infosys", "Wipro", "HCL", "Accenture", "Cognizant",
  "Tech Mahindra", "L&T Infotech", "Mindtree", "Mphasis",
  "Capgemini", "Deloitte", "EY", "KPMG", "PwC",
  "Amazon", "Flipkart", "Swiggy", "Zomato", "PhonePe",
  "Razorpay", "CRED", "Zerodha", "Byju's", "Unacademy",
  "IBM", "Microsoft", "Google", "Oracle", "SAP",
  "Tata Steel", "Reliance", "Adani", "Mahindra", "Godrej",
  "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak", "SBI",
  // ... fill to 80+ names
];

function CompanyCarousel() {
  const row1 = COMPANIES.slice(0, 40);
  const row2 = COMPANIES.slice(40);

  return (
    <section className="py-16 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-center text-white mb-12"
      >
        Companies <span className="text-blue-400">Recruiting</span>
      </motion.h2>

      <div className="marquee-container space-y-4">
        {/* Row 1: scrolls left */}
        <div className="flex marquee-left" style={{ width: 'max-content' }}>
          {[...row1, ...row1].map((name, i) => (
            <span key={i} className="mx-2 px-5 py-2.5 rounded-full text-sm font-medium
                                     bg-white/5 border border-white/10 text-gray-300
                                     backdrop-blur-sm whitespace-nowrap
                                     hover:bg-white/10 hover:text-white transition-all">
              {name}
            </span>
          ))}
        </div>

        {/* Row 2: scrolls right */}
        <div className="flex marquee-right" style={{ width: 'max-content' }}>
          {[...row2, ...row2].map((name, i) => (
            <span key={i} className="mx-2 px-5 py-2.5 rounded-full text-sm font-medium
                                     bg-white/5 border border-white/10 text-gray-300
                                     backdrop-blur-sm whitespace-nowrap
                                     hover:bg-white/10 hover:text-white transition-all">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Landing Page — Scroll-Triggered Stats Counter

```jsx
// StatsCounter.jsx — Numbers animate when scrolled into view
import { useInView } from 'framer-motion';

function StatCard({ label, value, suffix = "+" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const displayValue = useCountUp(isInView ? value : 0, 2000);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10
                 rounded-2xl p-8 text-center"
    >
      <p className="text-4xl md:text-5xl font-bold text-white">
        {displayValue.toLocaleString()}{suffix}
      </p>
      <p className="text-gray-400 mt-2 text-lg">{label}</p>
    </motion.div>
  );
}

// Usage:
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
  <StatCard label="Registrations" value={4000} />
  <StatCard label="Companies" value={80} />
  <StatCard label="Expected Attendees" value={1500} />
</div>
```

## Glassmorphism Card — Hover Lift Effect

```jsx
// Reusable glassmorphism card with hover lift (used everywhere)
<motion.div
  whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
  transition={{ duration: 0.2 }}
  className="bg-white/5 backdrop-blur-xl border border-white/10
             rounded-2xl p-6 cursor-pointer"
>
  {children}
</motion.div>
```

## Navbar — Scroll-Aware Transparency

```jsx
// Navbar.jsx — transparent on landing hero, solid on scroll
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 50);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

<motion.nav
  className={`fixed top-0 w-full z-50 transition-all duration-300 ${
    scrolled
      ? 'bg-gray-900/80 backdrop-blur-xl border-b border-white/10'
      : 'bg-transparent'
  }`}
>
```

