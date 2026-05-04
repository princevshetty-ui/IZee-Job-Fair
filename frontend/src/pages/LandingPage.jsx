import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { COMPANIES } from '../utils/constants'
import collegeLogo from '../assets/images/college-logo.png'

const WHO_SHOULD_ATTEND = [
  'Final-year UG & PG students looking for placements',
  'MBA graduates seeking leadership roles',
  'Working professionals exploring better opportunities',
  'Recent graduates aspiring to join top tech firms'
]

const WHAT_TO_EXPECT = [
  { title: '100+ Hiring Companies', desc: 'Direct recruitment drives from India\'s leading corporations across IT, finance, marketing, and operations.' },
  { title: 'Direct Access to Hiring Managers', desc: 'Interview decision-makers face-to-face and make a lasting impression that no resume can convey.' },
  { title: 'Networking Opportunities', desc: 'Connect with HR leaders, recruiters, and fellow high-potential candidates from across the country.' }
]

const STATS = [
  { value: '80+', label: 'Companies Hiring' },
  { value: '2500+', label: 'Candidates' },
  { value: '1', label: 'Day Event' },
  { value: '8th May', label: '2026' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
}

const childVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }
}

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
    <div className="max-w-5xl mx-auto h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)' }} />
  </FI>
)

const LandingPage = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -60])

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: 'transparent' }}>
      <div className="relative z-10 w-full">

        {/* ── Minimal Navbar ── */}
        <nav className="absolute top-0 w-full z-50 pt-4 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end h-16">
              <Link to="/register" className="group">
                <div className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300"
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.35)',
                    color: '#a5b4fc',
                    boxShadow: '0 0 16px rgba(99,102,241,0.15)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.2)'
                    e.currentTarget.style.boxShadow = '0 0 28px rgba(99,102,241,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(99,102,241,0.15)'
                  }}
                >
                  Register Now
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 pb-24 overflow-hidden">
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="text-center w-full max-w-5xl mx-auto relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Logo */}
            <motion.div variants={childVariants} className="mb-10">
              <img
                src={collegeLogo}
                alt="IZEE"
                className="h-20 md:h-28 w-auto mx-auto object-contain"
                style={{ filter: 'drop-shadow(0 0 24px rgba(99,102,241,0.25))' }}
              />
            </motion.div>

            {/* Live badge */}
            <motion.div variants={childVariants} className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-[11px] tracking-[0.22em] font-semibold uppercase" style={{ color: '#94a3b8' }}>Registration Open</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={childVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-5 leading-[1.05] tracking-tight font-heading-art"
            >
              <span className="text-gradient-hero">IZee Job Fair</span>
              <br />
              <span className="text-gradient-hero">2026</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={childVariants}
              className="text-lg md:text-xl mb-10 font-light"
              style={{ color: '#64748B' }}
            >
              8th May 2026&nbsp;&nbsp;·&nbsp;&nbsp;Placement Drive&nbsp;&nbsp;·&nbsp;&nbsp;IZEE Business School, Bangalore
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={childVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/register" className="group w-full sm:w-auto">
                <div className="relative overflow-hidden px-10 py-4 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase text-white flex items-center justify-center gap-2.5 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 40px rgba(99,102,241,0.55)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.4)'
                  }}
                >
                  Secure Your Pass
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              </Link>

              <Link to="/volunteer/register" className="group w-full sm:w-auto">
                <div className="px-10 py-4 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase flex items-center justify-center gap-2.5 transition-all duration-300"
                  style={{
                    background: 'rgba(13,13,26,0.8)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    color: '#94A3B8',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
                    e.currentTarget.style.color = '#c4b5fd'
                    e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'
                    e.currentTarget.style.color = '#94A3B8'
                    e.currentTarget.style.background = 'rgba(13,13,26,0.8)'
                  }}
                >
                  Volunteer Register
                </div>
              </Link>
            </motion.div>

            {/* Stats Strip */}
            <motion.div
              variants={childVariants}
              className="flex flex-wrap items-center justify-center gap-0 mx-auto max-w-2xl rounded-2xl overflow-hidden"
              style={{ background: 'rgba(13,13,26,0.9)', border: '1px solid #1a1a2e' }}
            >
              {STATS.map((stat, i) => (
                <div key={i} className={`flex-1 min-w-[120px] py-4 px-6 text-center ${i < STATS.length - 1 ? 'border-r' : ''}`}
                  style={{ borderColor: '#1a1a2e' }}>
                  <div className="text-xl md:text-2xl font-bold text-gradient-hero leading-tight">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] mt-1" style={{ color: '#475569' }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ color: '#334155' }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
            </motion.div>
          </motion.div>
        </section>

        <Divider />

        {/* ── Company Marquee ── */}
        <section className="py-20 md:py-28 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <FI>
              <p className="text-center font-light tracking-[0.22em] uppercase text-[10px] mb-10" style={{ color: '#334155' }}>
                Trusted by industry leaders
              </p>
            </FI>
            <div className="marquee-container">
              <div className="overflow-hidden whitespace-nowrap" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
                <div className="animate-marquee inline-flex gap-14 md:gap-20 items-center">
                  {COMPANIES.concat(COMPANIES).map((c, i) => (
                    <span key={`m-${i}`} className="text-sm md:text-base font-heading-art font-medium cursor-default transition-colors duration-500"
                      style={{ color: '#334155' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                      onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                    >{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Who Should Attend ── */}
        <section className="py-24 md:py-32 px-4 relative">
          <div className="max-w-5xl mx-auto relative z-10">
            <SR className="text-center mb-16 md:mb-20">
              <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-4" style={{ color: 'rgba(99,102,241,0.5)' }}>Who should attend</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-heading-art">Perfect For</h2>
            </SR>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {WHO_SHOULD_ATTEND.map((item, i) => (
                <SR key={i} delay={i * 0.08} y={25}>
                  <div className="p-7 rounded-2xl transition-all duration-500 group cursor-default"
                    style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                      e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.1), 0 8px 32px rgba(0,0,0,0.3)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#1a1a2e'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white/60 text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.15)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <p className="text-[0.95rem] leading-relaxed mt-0.5" style={{ color: '#64748B' }}>{item}</p>
                    </div>
                  </div>
                </SR>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── What to Expect ── */}
        <section className="py-24 md:py-32 px-4 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <SR className="text-center mb-16 md:mb-20">
              <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-4" style={{ color: 'rgba(6,182,212,0.5)' }}>The experience</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-heading-art">What Awaits You</h2>
            </SR>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {WHAT_TO_EXPECT.map((item, i) => (
                <SR key={i} delay={i * 0.1}>
                  <div className="p-8 rounded-2xl transition-all duration-500 h-full flex flex-col group"
                    style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                      e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.08), 0 16px 40px rgba(0,0,0,0.4)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#1a1a2e'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="w-8 h-[2px] mb-7 rounded-full transition-all duration-700 group-hover:w-14"
                      style={{ background: 'linear-gradient(90deg, #6366F1, #06B6D4)' }} />
                    <h3 className="text-lg font-bold text-white mb-3 font-heading-art tracking-tight">{item.title}</h3>
                    <p className="leading-relaxed text-[0.9rem] flex-1" style={{ color: '#475569' }}>{item.desc}</p>
                  </div>
                </SR>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-24 md:py-32 px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-80 pointer-events-none rounded-full"
            style={{ background: 'rgba(99,102,241,0.08)', filter: 'blur(100px)' }} />
          <div className="max-w-4xl mx-auto relative z-10">
            <SR y={30}>
              <div className="p-10 sm:p-14 md:p-16 text-center rounded-3xl"
                style={{ background: '#0D0D1A', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 0 60px rgba(99,102,241,0.08)' }}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-white tracking-tight font-heading-art">
                  Ready to{' '}
                  <span className="text-gradient-hero">Transform</span>
                  {' '}Your Career?
                </h2>
                <p className="text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#475569' }}>
                  Your next opportunity is one registration away.
                </p>
                <Link to="/register" className="group inline-block">
                  <div className="relative overflow-hidden px-12 py-4 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase text-white inline-flex items-center gap-2.5 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(99,102,241,0.55)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.4)'
                    }}
                  >
                    Claim Your Spot
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </div>
                </Link>
              </div>
            </SR>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="pt-12 md:pt-16 pb-8 px-4 relative">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center justify-center gap-8">
            <FI>
              <img src={collegeLogo} alt="IZEE College Logo" className="h-14 md:h-16 object-contain opacity-50 hover:opacity-80 transition-opacity duration-500" />
            </FI>
            <div className="w-full max-w-3xl h-px" style={{ background: 'linear-gradient(90deg, transparent, #1a1a2e, transparent)' }} />
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl text-xs font-light tracking-wide gap-3 text-center md:text-left"
              style={{ color: '#334155' }}>
              <p>&copy; {new Date().getFullYear()} IZEE Job Fair. All rights reserved.</p>
              <span>IZEE Business School, Bangalore</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
