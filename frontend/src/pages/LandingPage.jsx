import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { COMPANIES } from '../utils/constants'
import collegeLogo from '../assets/images/college-logo.png'

/* ── Data ── */
const WHO_SHOULD_ATTEND = [
  { text: 'Final-year UG & PG students looking for placements', accent: '#6366F1', num: '01' },
  { text: 'MBA graduates seeking leadership roles', accent: '#8B5CF6', num: '02' },
  { text: 'Working professionals exploring better opportunities', accent: '#06B6D4', num: '03' },
  { text: 'Recent graduates aspiring to join top tech firms', accent: '#10B981', num: '04' },
]

const HIGHLIGHTS = [
  { icon: '👥', title: 'Meet Top Recruiters', desc: 'Face-to-face with hiring managers from top firms', accent: '#6366F1', glow: 'rgba(99,102,241,0.22)' },
  { icon: '💼', title: 'Explore Career Paths', desc: 'IT, Finance, Marketing, Operations & more', accent: '#8B5CF6', glow: 'rgba(139,92,246,0.22)' },
  { icon: '⚡', title: 'On-the-Spot Offers', desc: 'Walk in and walk out with an offer letter', accent: '#06B6D4', glow: 'rgba(6,182,212,0.22)' },
  { icon: '🎯', title: 'Career Guidance', desc: 'Expert counselling & skill development sessions', accent: '#F59E0B', glow: 'rgba(245,158,11,0.20)' },
  { icon: '🤝', title: 'Networking Hub', desc: 'Connect with 1000+ professionals & peers', accent: '#10B981', glow: 'rgba(16,185,129,0.20)' },
  { icon: '📋', title: 'Internships & Jobs', desc: 'Full-time roles and internship opportunities', accent: '#EC4899', glow: 'rgba(236,72,153,0.20)' },
]

const EVENT_DETAILS = [
  { icon: '📅', label: 'Date', value: '8th May 2026', accent: '#6366F1', glow: 'rgba(99,102,241,0.25)' },
  { icon: '🕘', label: 'Time', value: '9:00 AM Onwards', accent: '#8B5CF6', glow: 'rgba(139,92,246,0.25)' },
  { icon: '📍', label: 'Venue', value: 'IZEE Business School', accent: '#06B6D4', glow: 'rgba(6,182,212,0.25)' },
  { icon: '🏙️', label: 'City', value: 'Bangalore, Karnataka', accent: '#10B981', glow: 'rgba(16,185,129,0.25)' },
]

/* ── Animation Variants ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const childVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
}

/* ── Helpers ── */
const SR = ({ children, delay = 0, y = 40, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >{children}</motion.div>
)

const FI = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
    className={className}
  >{children}</motion.div>
)

const Divider = () => (
  <FI className="px-4">
    <div className="max-w-5xl mx-auto h-px"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.18), transparent)' }} />
  </FI>
)

/* ── Countdown ── */
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  useEffect(() => {
    const target = new Date('2026-05-08T09:00:00+05:30')
    const tick = () => {
      const diff = target - new Date()
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 }); return }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  const blocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.mins },
    { label: 'Secs', value: timeLeft.secs },
  ]
  return (
    <div className="flex items-end gap-2 md:gap-3 justify-center">
      {blocks.map(({ label, value }, i) => (
        <div key={label} className="flex items-end gap-2 md:gap-3">
          <div className="flex flex-col items-center">
            <div style={{
              width: '4rem', height: '4rem',
              background: 'linear-gradient(135deg, rgba(13,13,26,0.92), rgba(19,19,31,0.92))',
              border: '1px solid rgba(99,102,241,0.38)',
              boxShadow: '0 0 22px rgba(99,102,241,0.14), inset 0 1px 0 rgba(255,255,255,0.06)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.375rem', fontWeight: 800, color: 'white', fontFamily: 'Montserrat, Inter, sans-serif',
            }}>
              {String(value ?? 0).padStart(2, '0')}
            </div>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '6px', color: '#475569' }}>
              {label}
            </span>
          </div>
          {i < 3 && <span style={{ color: 'rgba(99,102,241,0.7)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>:</span>}
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════
   FULL PAGE ORB LAYER
   Key insight: pixel-based top values so orbs
   are truly spread across the whole document.
   We use a tall absolute div (min-height set
   via JS after mount to match document height).
════════════════════════════════════════ */
const FullPageOrbs = () => {
  const ref = useRef(null)

  // Make the orb container exactly as tall as the document
  useEffect(() => {
    const resize = () => {
      if (ref.current) {
        ref.current.style.height = document.documentElement.scrollHeight + 'px'
      }
    }
    resize()
    window.addEventListener('resize', resize)
    // Also resize after images/fonts load
    window.addEventListener('load', resize)
    const t = setInterval(resize, 500)
    setTimeout(() => clearInterval(t), 4000)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('load', resize)
      clearInterval(t)
    }
  }, [])

  // 20 vivid orbs spread across the full page.
  // Blur 40–55px (was 80–108) + opacity 0.55–0.70 (was 0.20–0.32) = actually visible.
  // Positions use percentages so nothing gets clipped.
  const orbs = [
    // ── Hero (0–800px) ──
    { cls: 'orb-1', top: 40, left: '2%', w: 520, h: 520, bg: 'radial-gradient(circle, rgba(99,102,241,0.65) 0%, rgba(99,102,241,0.18) 45%, transparent 70%)', blur: 48 },
    { cls: 'orb-2', top: 20, left: '68%', w: 500, h: 500, bg: 'radial-gradient(circle, rgba(139,92,246,0.60) 0%, rgba(139,92,246,0.16) 45%, transparent 70%)', blur: 50 },
    { cls: 'orb-3', top: 300, left: '28%', w: 580, h: 360, bg: 'radial-gradient(ellipse, rgba(99,102,241,0.50) 0%, rgba(6,182,212,0.14) 50%, transparent 70%)', blur: 55 },
    { cls: 'orb-1', top: 550, left: '5%', w: 420, h: 400, bg: 'radial-gradient(circle, rgba(6,182,212,0.55) 0%, rgba(6,182,212,0.12) 45%, transparent 70%)', blur: 45 },
    { cls: 'orb-2', top: 580, left: '72%', w: 440, h: 420, bg: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(139,92,246,0.12) 45%, transparent 70%)', blur: 48 },

    // ── Event details / Marquee (800–1600px) ──
    { cls: 'orb-3', top: 820, left: '3%', w: 480, h: 460, bg: 'radial-gradient(circle, rgba(99,102,241,0.58) 0%, rgba(99,102,241,0.14) 45%, transparent 70%)', blur: 50 },
    { cls: 'orb-1', top: 860, left: '70%', w: 460, h: 440, bg: 'radial-gradient(circle, rgba(6,182,212,0.55) 0%, rgba(6,182,212,0.12) 45%, transparent 70%)', blur: 46 },
    { cls: 'orb-2', top: 1150, left: '22%', w: 560, h: 340, bg: 'radial-gradient(ellipse, rgba(139,92,246,0.52) 0%, transparent 65%)', blur: 52 },
    { cls: 'orb-3', top: 1380, left: '6%', w: 440, h: 420, bg: 'radial-gradient(circle, rgba(6,182,212,0.55) 0%, rgba(6,182,212,0.12) 45%, transparent 70%)', blur: 44 },
    { cls: 'orb-1', top: 1420, left: '66%', w: 460, h: 440, bg: 'radial-gradient(circle, rgba(99,102,241,0.56) 0%, rgba(99,102,241,0.12) 45%, transparent 70%)', blur: 48 },

    // ── Highlights (1600–2400px) ──
    { cls: 'orb-2', top: 1620, left: '4%', w: 500, h: 480, bg: 'radial-gradient(circle, rgba(139,92,246,0.60) 0%, rgba(139,92,246,0.15) 45%, transparent 70%)', blur: 52 },
    { cls: 'orb-3', top: 1660, left: '68%', w: 480, h: 460, bg: 'radial-gradient(circle, rgba(6,182,212,0.58) 0%, rgba(6,182,212,0.14) 45%, transparent 70%)', blur: 50 },
    { cls: 'orb-1', top: 1940, left: '25%', w: 600, h: 360, bg: 'radial-gradient(ellipse, rgba(99,102,241,0.50) 0%, rgba(139,92,246,0.14) 50%, transparent 70%)', blur: 55 },
    { cls: 'orb-2', top: 2180, left: '5%', w: 460, h: 440, bg: 'radial-gradient(circle, rgba(99,102,241,0.56) 0%, rgba(99,102,241,0.12) 45%, transparent 70%)', blur: 46 },
    { cls: 'orb-3', top: 2220, left: '67%', w: 480, h: 460, bg: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(139,92,246,0.12) 45%, transparent 70%)', blur: 50 },

    // ── Who should attend (2400–3200px) ──
    { cls: 'orb-1', top: 2420, left: '3%', w: 500, h: 480, bg: 'radial-gradient(circle, rgba(6,182,212,0.58) 0%, rgba(6,182,212,0.14) 45%, transparent 70%)', blur: 52 },
    { cls: 'orb-2', top: 2460, left: '69%', w: 520, h: 500, bg: 'radial-gradient(circle, rgba(99,102,241,0.60) 0%, rgba(99,102,241,0.15) 45%, transparent 70%)', blur: 54 },
    { cls: 'orb-3', top: 2720, left: '26%', w: 580, h: 360, bg: 'radial-gradient(ellipse, rgba(139,92,246,0.50) 0%, rgba(6,182,212,0.12) 50%, transparent 70%)', blur: 55 },

    // ── CTA / Footer (3200–4200px) ──
    { cls: 'orb-1', top: 3200, left: '4%', w: 480, h: 460, bg: 'radial-gradient(circle, rgba(99,102,241,0.58) 0%, rgba(99,102,241,0.14) 45%, transparent 70%)', blur: 50 },
    { cls: 'orb-2', top: 3240, left: '67%', w: 500, h: 480, bg: 'radial-gradient(circle, rgba(139,92,246,0.56) 0%, rgba(139,92,246,0.13) 45%, transparent 70%)', blur: 52 },
    { cls: 'orb-3', top: 3500, left: '28%', w: 560, h: 340, bg: 'radial-gradient(ellipse, rgba(6,182,212,0.52) 0%, transparent 65%)', blur: 50 },
  ]

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        minHeight: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'visible',
      }}
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          className={o.cls}
          style={{
            position: 'absolute',
            top: o.top,
            left: o.left,
            right: o.right,
            width: o.w,
            height: o.h,
            borderRadius: '50%',
            background: o.bg,
            filter: `blur(${o.blur}px)`,
          }}
        />
      ))}
    </div>
  )
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const LandingPage = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -60])

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: '#020208', position: 'relative' }}
    >
      {/* ════ FIXED base layer (grid + colour wash, always visible) ════ */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 18% 12%, rgba(99,102,241,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 62% 50% at 82% 14%, rgba(139,92,246,0.14) 0%, transparent 58%),
            radial-gradient(ellipse 80% 50% at 50% 92%, rgba(6,182,212,0.10) 0%, transparent 68%),
            #020208
          `,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 18%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 18%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '980px', height: '760px',
          background: 'conic-gradient(from 254deg at 50% 0%, transparent 0deg, rgba(99,102,241,0.16) 28deg, transparent 56deg, transparent 124deg, rgba(139,92,246,0.13) 152deg, transparent 180deg)',
          filter: 'blur(28px)',
        }} />
      </div>

      {/* ════ SCROLLING orb layer — spans full document height ════ */}
      <FullPageOrbs />

      {/* ════ PAGE CONTENT ════ */}
      <div className="relative" style={{ zIndex: 2 }}>

        {/* Navbar */}
        <nav className="absolute top-0 w-full z-50 pt-4 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end h-16">
              <Link to="/register">
                <div
                  className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300"
                  style={{
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.40)',
                    color: '#a5b4fc',
                    boxShadow: '0 0 20px rgba(99,102,241,0.18)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.25)'
                    e.currentTarget.style.boxShadow = '0 0 34px rgba(99,102,241,0.45)'
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.70)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.12)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.18)'
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.40)'
                  }}
                >
                  Register Now
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <section ref={heroRef} className="relative flex flex-col items-center justify-center px-4 pt-28 pb-12 overflow-hidden">
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="text-center w-full max-w-5xl mx-auto relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={childVariants} className="mb-7">
              <img src={collegeLogo} alt="IZEE" className="logo-shimmer h-20 md:h-24 w-auto mx-auto object-contain" />
            </motion.div>

            <motion.div variants={childVariants}
              className="inline-flex items-center gap-2.5 mb-6 px-4 py-2 rounded-full"
              style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.25)' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-[11px] tracking-[0.22em] font-semibold uppercase" style={{ color: '#94a3b8' }}>
                Registration Open
              </span>
            </motion.div>

            <motion.h1 variants={childVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-[1.05] tracking-tight font-heading-art"
            >
              <span className="text-shimmer">IZee Job Fair 2026</span>
            </motion.h1>

            <motion.p variants={childVariants} className="text-base md:text-lg mb-8 font-light" style={{ color: '#64748b' }}>
              8th May 2026 · Placement Drive · IZEE Business School, Bangalore
            </motion.p>

            <motion.div variants={childVariants} className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: '#475569' }}>Event starts in</p>
              <CountdownTimer />
            </motion.div>

            <motion.div variants={childVariants} className="flex items-center justify-center mb-10">
              <Link to="/register" className="group">
                <div
                  className="relative overflow-hidden px-12 py-4 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase text-white flex items-center gap-2.5 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #6146b3, #2177da)', boxShadow: '0 4px 30px rgba(99,102,241,0.50)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 10px 44px rgba(99,102,241,0.70)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 30px rgba(99,102,241,0.50)'
                  }}
                >
                  Register Now
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={childVariants}
              className="stats-shimmer inline-flex items-center gap-3 mx-auto px-8 py-4"
              style={{ background: 'rgba(13,13,26,0.80)' }}
            >
              <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>45+ Companies</span>
              <span style={{ color: '#334155' }}>·</span>
              <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>8th May 2026</span>
              <span style={{ color: '#334155' }}>·</span>
              <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>IZEE Business School</span>
            </motion.div>
          </motion.div>
        </section>

        {/* ══ EVENT DETAILS ══ */}
        <section className="px-4 pt-8 pb-14">
          <div className="max-w-5xl mx-auto">
            <SR>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {EVENT_DETAILS.map((item, i) => (
                  <div key={i}
                    className="flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-300 cursor-default"
                    style={{
                      background: 'linear-gradient(135deg, rgba(13,13,26,0.88) 0%, rgba(19,19,31,0.88) 100%)',
                      border: `1px solid ${item.accent}30`,
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = item.accent + '70'
                      e.currentTarget.style.boxShadow = `0 10px 34px ${item.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
                      e.currentTarget.style.transform = 'translateY(-3px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = item.accent + '30'
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.05)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3"
                      style={{ background: `radial-gradient(circle, ${item.glow} 0%, rgba(0,0,0,0) 70%)`, border: `1px solid ${item.accent}30` }}>
                      {item.icon}
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.18em] mb-1 font-semibold" style={{ color: item.accent + 'cc' }}>
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-white leading-tight">{item.value}</span>
                  </div>
                ))}
              </div>
            </SR>
          </div>
        </section>

        <Divider />

        {/* ══ COMPANY MARQUEE ══ */}
        <section className="py-16 md:py-20 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <FI>
              <p className="text-center font-light tracking-[0.22em] uppercase text-[10px] mb-10" style={{ color: '#4a5568' }}>
                Hiring companies include
              </p>
            </FI>
            <div className="marquee-container">
              <div className="overflow-hidden whitespace-nowrap"
                style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
                <div className="animate-marquee inline-flex gap-14 md:gap-20 items-center">
                  {COMPANIES.concat(COMPANIES).map((c, i) => (
                    <span key={`m-${i}`}
                      className="text-sm md:text-base font-heading-art font-medium cursor-default transition-colors duration-500"
                      style={{ color: '#4a5568' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#4a5568')}
                    >{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ HIGHLIGHTS ══ */}
        <section className="py-20 md:py-28 px-4">
          <div className="max-w-6xl mx-auto">
            <SR className="text-center mb-14 md:mb-16">
              <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-4" style={{ color: 'rgba(6,182,212,0.7)' }}>
                What's in store
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-heading-art">
                <span className="text-shimmer">Everything You Need</span>
              </h2>
              <p className="mt-4 text-sm md:text-base max-w-xl mx-auto" style={{ color: '#64748b' }}>
                One day. One venue. Thousands of opportunities.
              </p>
            </SR>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {HIGHLIGHTS.map((item, i) => (
                <SR key={i} delay={i * 0.07} y={20}>
                  <div
                    className="relative p-6 rounded-2xl transition-all duration-300 cursor-default h-full overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(13,13,26,0.92) 0%, rgba(19,19,31,0.88) 100%)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = item.accent + '50'
                      e.currentTarget.style.boxShadow = `0 12px 40px ${item.glow}, 0 4px 16px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.07)`
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 rounded-t-2xl"
                      style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }} />
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${item.glow.replace('0.22', '0.18')}, rgba(0,0,0,0))`,
                        border: `1px solid ${item.accent}30`,
                        boxShadow: `0 0 20px ${item.glow}`,
                      }}>
                      {item.icon}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 font-heading-art">{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{item.desc}</p>
                    <div className="absolute bottom-0 right-0 rounded-full pointer-events-none"
                      style={{ width: 96, height: 96, background: `radial-gradient(circle, ${item.glow} 0%, transparent 70%)`, filter: 'blur(16px)', transform: 'translate(30%, 30%)' }} />
                  </div>
                </SR>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ WHO SHOULD ATTEND ══ */}
        <section className="py-20 md:py-28 px-4">
          <div className="max-w-5xl mx-auto">
            <SR className="text-center mb-14 md:mb-16">
              <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-4" style={{ color: 'rgba(99,102,241,0.6)' }}>
                Who should attend
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-heading-art">
                <span className="text-shimmer">Perfect For</span>
              </h2>
            </SR>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {WHO_SHOULD_ATTEND.map((item, i) => (
                <SR key={i} delay={i * 0.08} y={25}>
                  <div
                    className="relative p-6 rounded-2xl transition-all duration-300 cursor-default overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(13,13,26,0.92) 0%, rgba(19,19,31,0.88) 100%)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = item.accent + '45'
                      e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.40), 0 0 0 1px ${item.accent}25, inset 0 1px 0 rgba(255,255,255,0.07)`
                      e.currentTarget.style.transform = 'translateY(-3px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div className="absolute left-0 top-4 bottom-4 rounded-full"
                      style={{ width: '3px', background: `linear-gradient(to bottom, ${item.accent}, ${item.accent}40)` }} />
                    <div className="flex items-center gap-4 pl-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${item.accent}22, ${item.accent}08)`,
                          border: `1px solid ${item.accent}35`,
                          color: item.accent,
                          boxShadow: `0 0 16px ${item.accent}20`,
                        }}>
                        {item.num}
                      </div>
                      <p className="text-[0.95rem] leading-relaxed font-medium" style={{ color: '#cbd5e1' }}>
                        {item.text}
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 rounded-full pointer-events-none"
                      style={{ width: 80, height: 80, background: `radial-gradient(circle, ${item.accent}18 0%, transparent 70%)`, filter: 'blur(12px)', transform: 'translate(30%, -30%)' }} />
                  </div>
                </SR>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ FINAL CTA ══ */}
        <section className="py-24 md:py-32 px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-80 pointer-events-none rounded-full"
            style={{ background: 'rgba(99,102,241,0.10)', filter: 'blur(110px)' }} />
          <div className="max-w-4xl mx-auto relative z-10">
            <SR y={30}>
              <div
                className="p-10 sm:p-14 md:p-16 text-center rounded-3xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,13,26,0.92) 0%, rgba(19,19,31,0.88) 100%)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  boxShadow: '0 0 90px rgba(99,102,241,0.10), inset 0 1px 0 rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 rounded-t-3xl"
                  style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #6366F1 30%, #8B5CF6 50%, #06B6D4 70%, transparent)' }} />
                <div className="absolute top-0 left-0 w-40 h-40 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(20px)', transform: 'translate(-30%, -30%)' }} />
                <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)', filter: 'blur(20px)', transform: 'translate(30%, 30%)' }} />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 tracking-tight font-heading-art relative z-10">
                  <span className="text-shimmer">Ready to Transform Your Career?</span>
                </h2>
                <p className="text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed relative z-10" style={{ color: '#94a3b8' }}>
                  Your next opportunity is one registration away. Seats are limited.
                </p>
                <Link to="/register" className="group inline-block relative z-10">
                  <div
                    className="relative overflow-hidden px-12 py-4 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase text-white inline-flex items-center gap-2.5 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #6146b3, #2177da)', boxShadow: '0 4px 30px rgba(99,102,241,0.50)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(99,102,241,0.65)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 30px rgba(99,102,241,0.50)'
                    }}
                  >
                    Claim Your Spot
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              </div>
            </SR>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="pt-12 md:pt-16 pb-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-8">
            <FI>
              <img src={collegeLogo} alt="IZEE" className="h-14 md:h-16 object-contain opacity-50 hover:opacity-80 transition-opacity duration-500" />
            </FI>
            <div className="w-full max-w-3xl h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)' }} />
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl text-xs font-light tracking-wide gap-3" style={{ color: '#334155' }}>
              <p>&copy; {new Date().getFullYear()} IZEE Job Fair. All rights reserved.</p>
              <a href="https://izeeinstitutions.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors duration-200">
                izeeinstitutions.com
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default LandingPage