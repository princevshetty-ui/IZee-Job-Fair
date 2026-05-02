import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'
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
    <div className="max-w-5xl mx-auto h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  </FI>
)

const LandingPage = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -60])

  return (
    <div className="min-h-screen text-white selection:bg-indigo-500/20 font-light overflow-x-hidden" style={{ backgroundColor: 'transparent' }}>
      <div className="relative z-10 w-full">
        <Navbar />

        {/* Hero */}
        <section ref={heroRef} className="relative min-h-[100dvh] flex items-center justify-center px-4 pt-32 pb-20 overflow-hidden">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="text-center w-full max-w-6xl mx-auto relative z-10">

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 bg-white/[0.05] border border-indigo-500/20 backdrop-blur-xl rounded-full px-5 md:px-6 py-2.5 mb-10 md:mb-14">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-slate-300 text-[11px] tracking-[0.2em] font-semibold uppercase">80+ Companies Hiring</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light mb-6 md:mb-8 leading-[1.08] font-heading-art tracking-tight">
              <span className="text-white">Redefine Your</span>
              <br className="hidden sm:block" />
              <span className="font-nevara font-normal italic" style={{ backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Career Moment
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg md:text-xl text-slate-400 font-light mb-10 md:mb-14 max-w-3xl mx-auto leading-relaxed">
              Connect directly with top-tier companies. Meet hiring managers face-to-face and take the next definitive step in your career.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2.5 bg-cyan-950/25 border border-cyan-500/30 backdrop-blur-md rounded-full px-5 py-2.5 text-cyan-300 text-sm font-medium tracking-wide">
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                8th May 2026
              </div>
              <div className="inline-flex items-center gap-2.5 bg-indigo-950/25 border border-indigo-500/30 backdrop-blur-md rounded-full px-5 py-2.5 text-indigo-300 text-sm font-medium tracking-wide">
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                IZEE Business School, Bangalore
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}>
              <Link to="/register" className="group inline-block">
                <div className="px-10 md:px-14 py-4 md:py-[1.1rem] rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm md:text-[0.9rem] tracking-[0.08em] uppercase transition-all duration-300 shadow-[0_4px_25px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_40px_rgba(99,102,241,0.55)] hover:scale-[1.04] flex items-center justify-center gap-2.5">
                  Secure Your Pass
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <Divider />

        {/* Marquee */}
        <section className="py-20 md:py-28 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <FI><p className="text-center text-slate-500 font-light tracking-[0.2em] uppercase text-[11px] md:text-xs mb-12">Trusted by industry leaders</p></FI>
            <div className="marquee-container">
              <div className="overflow-hidden whitespace-nowrap" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
                <div className="animate-marquee inline-flex gap-14 md:gap-20 items-center">
                  {COMPANIES.concat(COMPANIES).map((c, i) => (
                    <span key={`m-${i}`} className="text-slate-600 text-sm md:text-base font-heading-art hover:text-slate-400 transition-colors duration-500 cursor-default font-medium">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Who Should Attend */}
        <section className="py-24 md:py-32 px-4 relative">
          <div className="max-w-5xl mx-auto relative z-10">
            <SR className="text-center mb-16 md:mb-20">
              <p className="text-[11px] uppercase tracking-[0.25em] text-indigo-400/60 font-semibold mb-4">Who should attend</p>
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art">Perfect For</h2>
            </SR>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {WHO_SHOULD_ATTEND.map((item, i) => (
                <SR key={i} delay={i * 0.08} y={25}>
                  <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-500 group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600/40 to-cyan-500/40 border border-white/[0.08] flex items-center justify-center text-white/60 text-sm font-semibold group-hover:border-cyan-400/30 transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <p className="text-slate-400 text-[0.95rem] leading-relaxed font-light mt-0.5 group-hover:text-slate-300 transition-colors duration-500">{item}</p>
                    </div>
                  </div>
                </SR>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* What to Expect */}
        <section className="py-24 md:py-32 px-4 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <SR className="text-center mb-16 md:mb-20">
              <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-400/50 font-semibold mb-4">The experience</p>
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art">What Awaits You</h2>
            </SR>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {WHAT_TO_EXPECT.map((item, i) => (
                <SR key={i} delay={i * 0.1}>
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-500 h-full flex flex-col group">
                    <div className="w-10 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 mb-7 rounded-full group-hover:w-16 transition-all duration-700" />
                    <h3 className="text-xl font-medium text-white mb-4 font-heading-art tracking-tight group-hover:text-cyan-300 transition-colors duration-500">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed font-light text-[0.9rem] flex-1 group-hover:text-slate-400 transition-colors duration-500">{item.desc}</p>
                  </div>
                </SR>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 md:py-32 px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-80 bg-indigo-600/15 blur-[150px] pointer-events-none rounded-full" />
          <div className="max-w-4xl mx-auto relative z-10">
            <SR y={30}>
              <div className="p-10 sm:p-14 md:p-16 text-center glass-card rounded-3xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-5 md:mb-6 text-white tracking-tight font-heading-art">
                  Ready to <span className="font-nevara font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Transform</span> Your Career?
                </h2>
                <p className="text-slate-400 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed font-light">
                  Your next opportunity is one registration away.
                </p>
                <Link to="/register" className="group inline-block">
                  <div className="px-10 sm:px-14 py-4 sm:py-[1.1rem] rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm tracking-[0.08em] uppercase transition-all duration-300 shadow-[0_4px_25px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_40px_rgba(99,102,241,0.55)] hover:scale-[1.04] inline-flex items-center gap-2.5">
                    Claim Your Spot
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </div>
                </Link>
              </div>
            </SR>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 md:pt-16 pb-8 px-4 relative">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center justify-center gap-8">
            <FI><img src={collegeLogo} alt="IZEE College Logo" className="h-14 md:h-18 object-contain opacity-80 hover:opacity-100 transition-opacity duration-500" /></FI>
            <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl text-slate-600 text-xs font-light tracking-wide gap-3 text-center md:text-left">
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