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
