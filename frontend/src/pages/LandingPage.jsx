import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'
import { COMPANIES } from '../utils/constants'

const WHO_SHOULD_ATTEND = [
  'Final-year UG & PG students looking for placements',
  'MBA graduates seeking leadership roles',
  'Working professionals exploring better opportunities',
  'Recent graduates aspiring to join top tech firms'
]

const WHAT_TO_EXPECT = [
  { title: '100+ Hiring Companies', desc: 'Direct recruitment drives from India\'s leading corporations across IT, finance, marketing, and operations.' },
  { title: 'On-Spot Offers', desc: 'Shortlisted candidates receive instant offer letters — no waiting for weeks or months.' },
  { title: 'Networking Opportunities', desc: 'Connect with HR leaders, recruiters, and fellow high-potential candidates.' }
]

const Orb = ({ size, initialX, initialY, colors, duration, delay }) => (
  <motion.div
    className="absolute rounded-full blur-[100px] pointer-events-none will-change-transform"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle at 50% 50%, ${colors[0]} 0%, ${colors[1]} 50%, transparent 100%)`,
      left: initialX,
      top: initialY
    }}
    animate={{
      x: [0, 80, -60, 100, 0],
      y: [0, -70, 60, -40, 0],
      scale: [1, 1.15, 0.9, 1.1, 1]
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay
    }}
  />
)

const Particles = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.2
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-gradient-to-b from-cyan-400 to-indigo-600 rounded-full"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity, filter: 'blur(0.5px)' }}
          animate={{ y: [0, -500], opacity: [0, p.opacity, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  )
}

const ScrollReveal = ({ children, delay = 0, y = 40, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

const LandingPage = () => {
  return (
    <div className="min-h-screen text-white selection:bg-indigo-500/20 font-light overflow-x-hidden" style={{ backgroundColor: '#0a0e1a' }}>
      
      {/* Dark Gradient Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 40%, #0f1628 100%)'
        }}
      />

      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Orb size={600} initialX="80%" initialY="-10%" colors={['rgba(99,102,241,0.15)', 'rgba(99,102,241,0.03)']} duration={25} delay={0} />
        <Orb size={500} initialX="-5%" initialY="70%" colors={['rgba(34,211,238,0.15)', 'rgba(34,211,238,0.03)']} duration={30} delay={2} />
        <Orb size={700} initialX="50%" initialY="50%" colors={['rgba(79,70,229,0.1)', 'rgba(14,165,233,0.05)']} duration={28} delay={4} />
      </div>

      {/* Particle Animation */}
      <Particles />

      <div className="relative z-10 w-full">
        <Navbar transparent={false} />

        {/* Hero Section */}
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 pt-32 pb-20 overflow-hidden">
          <div className="text-center w-full max-w-6xl mx-auto relative z-10">
            {/* Badge */}
            <ScrollReveal delay={0} y={20}>
              <div className="inline-flex items-center gap-3 bg-white/[0.08] border border-indigo-500/30 backdrop-blur-xl rounded-full px-4 md:px-6 py-2.5 mb-8 md:mb-12 relative overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-all">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <span className="text-slate-200 text-xs tracking-[0.15em] font-semibold">
                  TRUSTED BY 80+ GLOBAL COMPANIES
                </span>
              </div>
            </ScrollReveal>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light mb-6 md:mb-8 leading-[1.1] font-heading-art tracking-tight"
            >
              <span className="text-slate-900">
                Redefine Your
              </span>
              <br className="hidden sm:block" />
              <span
                className="font-nevara font-normal italic"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Career Moment
              </span>
            </motion.h1>

            {/* Subheading */}
            <ScrollReveal delay={0.25} y={20}>
              <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
                Connect directly with 80+ top-tier companies. Skip the resume pile, interview with hiring managers, and secure your dream role on the spot.
              </p>
            </ScrollReveal>

            {/* Event Info */}
            <ScrollReveal delay={0.3} y={20}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-slate-300 mb-10 md:mb-16 text-sm md:text-base font-medium">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>8th May 2026</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-indigo-500/30" />
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>IZEE Business School</span>
                </div>
              </div>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal delay={0.35} y={20} className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 px-4">
              <Link to="/register" className="w-full sm:w-auto group">
                <div className="px-8 md:px-12 py-3.5 md:py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm md:text-base tracking-[0.05em] uppercase transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 flex items-center justify-center gap-2 group-hover:from-indigo-700 group-hover:to-cyan-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Secure Your Pass
                </div>
              </Link>
              <Link to="/onspot" className="w-full sm:w-auto group">
                <div className="px-8 md:px-12 py-3.5 md:py-4 rounded-lg border-2 border-cyan-500/50 text-slate-200 hover:text-white font-semibold text-sm md:text-base tracking-[0.05em] uppercase transition-all hover:border-cyan-400 hover:bg-cyan-500/10 flex justify-center items-center gap-2 bg-white/[0.05] backdrop-blur-sm shadow-lg shadow-cyan-500/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  On-Spot Registration
                </div>
              </Link>
            </ScrollReveal>
          </div>
          
          
          <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[#f8f9fa] to-transparent pointer-events-none" />
        </section>

        {/* Companies Marquee */}
        <section className="py-20 md:py-28 px-4 bg-white/[0.03] border-y border-indigo-500/20 relative overflow-hidden backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-slate-400 font-light tracking-[0.15em] uppercase text-xs md:text-sm mb-14">Trusted by industry leaders</p>
            <div className="space-y-12 marquee-container">
              <div className="overflow-hidden whitespace-nowrap" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                <div className="animate-marquee inline-flex gap-16 md:gap-24 items-center">
                  {COMPANIES.concat(COMPANIES).map((c, i) => (
                    <span key={`r1-${i}`} className="text-slate-500 text-base md:text-lg font-heading-art hover:text-cyan-400 transition-colors duration-300 cursor-default font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Highlights */}
        <section className="py-24 md:py-32 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art mb-4">Event Highlights</h2>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">Everything you need to know about your career-changing day</p>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: '📅', title: 'Date', desc: '8th May 2026', color: 'indigo' },
                { icon: '📍', title: 'Venue', desc: 'IZEE Business School, Bangalore', color: 'cyan' },
                { icon: '⏰', title: 'Time', desc: '9:00 AM – 5:00 PM', color: 'purple' }
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="p-8 rounded-2xl bg-white/[0.08] border border-indigo-500/30 shadow-lg hover:shadow-indigo-500/20 transition-all hover:-translate-y-1 group backdrop-blur-xl">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2 font-heading-art">{item.title}</h3>
                    <p className="text-slate-400 font-light text-base group-hover:text-slate-300 transition-colors">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Who Should Attend */}
        <section className="py-24 md:py-32 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art mb-4">Perfect For</h2>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">Whether you're a student, fresh graduate, or seasoned professional</p>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {WHO_SHOULD_ATTEND.map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1} y={20}>
                  <div className="p-8 rounded-xl bg-white/[0.08] border border-cyan-500/30 hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-500/20 transition-all hover:-translate-y-1 flex items-start gap-4 group backdrop-blur-xl">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-base">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 text-base leading-relaxed font-light group-hover:text-slate-200 transition-colors">{item}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-24 md:py-32 px-4 bg-white/[0.03] backdrop-blur-xl">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art mb-4">What Awaits You</h2>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">A world-class career event designed for your success</p>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {WHAT_TO_EXPECT.map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-cyan-600/10 border border-indigo-500/30 shadow-lg hover:shadow-indigo-500/20 transition-all hover:-translate-y-1 h-full flex flex-col backdrop-blur-xl group">
                    <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-cyan-500 mb-6 rounded-full group-hover:w-16 transition-all duration-500" />
                    <h3 className="text-xl font-semibold text-white mb-3 font-heading-art group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-light flex-1 group-hover:text-slate-300 transition-colors">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 md:py-32 px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-indigo-600/20 blur-[150px] pointer-events-none rounded-full" />
          <div className="max-w-5xl mx-auto relative z-10">
            <ScrollReveal y={40}>
              <div className="p-8 sm:p-12 md:p-16 text-center border border-indigo-500/30 rounded-3xl bg-white/[0.08] backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-6 md:mb-8 text-white tracking-tight font-heading-art">
                  Ready to <span
                    className="font-nevara font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600"
                  >Transform</span> Your Career?
                </h2>
                <p className="text-slate-300 text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                  Join thousands of ambitious candidates connecting with industry leaders. Your next opportunity is just one registration away.
                </p>
                
                <Link to="/register" className="inline-block group">
                  <div className="px-8 sm:px-16 py-4 sm:py-5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm sm:text-base tracking-[0.05em] uppercase transition-all shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105 group-hover:from-indigo-700 group-hover:to-cyan-600 inline-flex items-center gap-2">
                    Claim Your Spot
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-indigo-500/20 pt-12 md:pt-16 pb-8 px-4 bg-white/[0.02] backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-8 md:gap-10">
            <div className="flex flex-col items-center">
              <img src="/src/assets/images/college-logo.png" alt="College Logo" className="h-16 md:h-20 object-contain opacity-90 hover:opacity-100 transition-opacity drop-shadow-2xl" />
            </div>
            
            <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl text-slate-500 text-xs md:text-sm font-light tracking-wide gap-4 md:gap-6 text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} IZEE Job Fair. All rights reserved.</p>
              <span className="hidden md:block">IZEE Business School, Bangalore</span>
              <span className="md:hidden">IZEE Business School</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage