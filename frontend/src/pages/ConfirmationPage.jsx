import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import collegeLogo from '../assets/images/college-logo.png'

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  return (
    <div className="min-h-screen overflow-x-hidden lp2-grain" style={{ backgroundColor: '#15120f' }}>
      {/* Fixed header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 24px', borderBottom: '1px solid rgba(208,176,112,0.12)', background: 'rgba(21,18,15,0.95)', backdropFilter: 'blur(12px)' }}>
        <Link to="/" className="flex items-center gap-3 w-fit">
          <img src={collegeLogo} alt="IZEE" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
          <span style={{ borderLeft: '1px solid rgba(208,176,112,0.3)', paddingLeft: '12px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#d0b070', lineHeight: 1.4 }}>
            Job Fair<br />2027
          </span>
        </Link>
      </header>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[200px]"
          style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(161,31,38,0.07) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div className="absolute rounded-full blur-[140px]"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(208,176,112,0.05) 0%, transparent 70%)', top: '20%', right: '15%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(208,176,112,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(208,176,112,0.025) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)' }} />
      </div>

      <div className="relative z-10 w-full">
        <section className="min-h-[100dvh] flex items-center justify-center px-4 pt-24 pb-20">
          <div className="w-full max-w-xl mx-auto">

            {/* Success icon */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                className="w-24 h-24 mx-auto flex items-center justify-center"
                style={{
                  background: '#a11f26',
                  border: '1px solid rgba(208,176,112,0.35)',
                  boxShadow: '0 0 60px rgba(161,31,38,0.2), 0 0 120px rgba(161,31,38,0.08)'
                }}
              >
                <motion.svg
                  className="w-12 h-12 text-white"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                >
                  <motion.path
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                  />
                </motion.svg>
              </motion.div>
            </div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="text-center mb-6"
            >
              <p className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.28em] font-semibold mb-4" style={{ color: 'rgba(208,176,112,0.7)' }}>
                <span className="h-px w-8 bg-current" />
                Submission Received
                <span className="h-px w-8 bg-current" />
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem,6vw,3.25rem)', color: '#f5f1ed', lineHeight: 1.1, fontWeight: 400 }} className="mb-4">
                Registration<br /><span style={{ fontStyle: 'italic', color: '#d0b070' }}>Submitted Successfully!</span>
              </h1>
              <p className="text-base leading-relaxed" style={{ color: '#8d7f76' }}>
                Your application is under review.{' '}
                {email
                  ? <>Your QR pass will be sent to <strong style={{ color: '#f5f1ed' }}>{email}</strong> once approved.</>
                  : 'Your QR pass will be sent to your registered email once approved.'
                }
              </p>
            </motion.div>

            {/* Spam warning */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="p-4 mb-5"
              style={{ background: 'rgba(208,176,112,0.06)', border: '1px solid rgba(208,176,112,0.35)' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
                <p className="text-sm leading-relaxed" style={{ color: '#d0b070' }}>
                  <strong>Please check your spam/junk folder.</strong> Add our email to your contacts to ensure your pass reaches your inbox.
                </p>
              </div>
            </motion.div>

            {/* Event details card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="p-5 mb-5"
              style={{ background: 'rgba(21,18,15,0.8)', border: '1px solid rgba(208,176,112,0.18)' }}
            >
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-4" style={{ color: 'rgba(208,176,112,0.7)' }}>
                Event Details
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(161,31,38,0.1)', border: '1px solid rgba(161,31,38,0.25)' }}>
                    <svg className="w-4 h-4" style={{ color: '#a11f26' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#5a4f48' }}>Date</p>
                    <p className="text-sm font-semibold" style={{ color: '#f5f1ed' }}>8th May 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(161,31,38,0.1)', border: '1px solid rgba(161,31,38,0.25)' }}>
                    <svg className="w-4 h-4" style={{ color: '#a11f26' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#5a4f48' }}>Venue</p>
                    <p className="text-sm font-semibold" style={{ color: '#f5f1ed' }}>IZee Business School, Jigani, Bangalore</p>
                    <a href="https://maps.app.goo.gl/DfyZRwqNwGZ6vSd28" target="_blank" rel="noopener noreferrer"
                      className="text-xs" style={{ color: '#d0b070', textDecoration: 'underline' }}>
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* What to bring */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="p-5 mb-8"
              style={{ background: 'rgba(21,18,15,0.8)', border: '1px solid rgba(208,176,112,0.15)' }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: '#f5f1ed' }}>What to bring on event day:</p>
              <ul className="space-y-2">
                {[
                  'Updated resume (10 copies recommended)',
                  'Passport-sized photographs',
                  'Aadhar card/Valid ID proof',
                  'Academic Certification Copies',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <div className="h-3 w-3 rotate-45 border flex-shrink-0 mt-1" style={{ borderColor: '#a11f26' }} />
                    <span className="text-sm leading-relaxed" style={{ color: '#8d7f76' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Return home */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.72 }}
              className="text-center"
            >
              <Link to="/" className="inline-block group">
                <div
                  className="px-10 py-3.5 font-semibold text-sm tracking-[0.12em] uppercase flex items-center gap-2.5 transition-all duration-300"
                  style={{ background: '#a11f26', color: '#f5f1ed', border: '1px solid rgba(208,176,112,0.3)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#d0b070'; e.currentTarget.style.color = '#15120f' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#a11f26'; e.currentTarget.style.color = '#f5f1ed' }}
                >
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Return Home
                </div>
              </Link>
            </motion.div>

          </div>
        </section>
      </div>
    </div>
  )
}

export default ConfirmationPage
