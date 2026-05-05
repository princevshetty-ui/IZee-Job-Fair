import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import collegeLogo from '../assets/images/college-logo.png'

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#020208' }}>
      <img src={collegeLogo} alt="IZEE" style={{ position: 'fixed', top: 16, left: 20, zIndex: 50, height: 40, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.2))' }} />
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[160px]"
          style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div className="absolute rounded-full blur-[120px]"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', top: '20%', right: '15%' }} />
      </div>

      <div className="relative z-10 w-full">
        <section className="min-h-[100dvh] flex items-center justify-center px-4 pt-16 pb-20">
          <div className="w-full max-w-xl mx-auto">

            {/* Success icon */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #0d9488)',
                  boxShadow: '0 0 50px rgba(16,185,129,0.4), 0 0 100px rgba(16,185,129,0.1)'
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
              <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(16,185,129,0.7)' }}>
                Submission Received
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Registration Submitted Successfully!
              </h1>
              <p className="text-base md:text-lg leading-relaxed" style={{ color: '#94a3b8' }}>
                Your application is under review.{' '}
                {email
                  ? <>Your QR pass will be sent to <strong className="text-white">{email}</strong> once approved.</>
                  : 'Your QR pass will be sent to your registered email once approved.'
                }
              </p>
            </motion.div>

            {/* Spam warning — amber box */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="rounded-xl p-4 mb-5"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.4)' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
                <p className="text-sm leading-relaxed" style={{ color: '#fbbf24' }}>
                  <strong>Please check your spam/junk folder.</strong> Add our email to your contacts to ensure your pass reaches your inbox.
                </p>
              </div>
            </motion.div>

            {/* Event details card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="rounded-2xl p-5 mb-5"
              style={{ background: '#0D0D1A', border: '1px solid rgba(0,207,255,0.15)' }}
            >
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-4" style={{ color: 'rgba(0,207,255,0.6)' }}>
                Event Details
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.2)' }}>
                    <svg className="w-4 h-4" style={{ color: '#00CFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#475569' }}>Date</p>
                    <p className="text-sm font-semibold text-white">8th May 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.2)' }}>
                    <svg className="w-4 h-4" style={{ color: '#00CFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#475569' }}>Venue</p>
                    <p className="text-sm font-semibold text-white">IZee Business School, Jigani, Bangalore</p>
                    <a href="https://maps.app.goo.gl/DfyZRwqNwGZ6vSd28" target="_blank" rel="noopener noreferrer"
                      className="text-xs" style={{ color: '#00CFFF', textDecoration: 'underline' }}>
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
              className="rounded-2xl p-5 mb-8"
              style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}
            >
              <p className="text-sm font-semibold text-white mb-3">What to bring on event day:</p>
              <ul className="space-y-2">
                {[
                  '10 sets of updated CVs',
                  '10 passport-size photographs',
                  'Valid government-issued ID (Aadhaar / PAN / Passport)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#10B981' }} />
                    <span className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{item}</span>
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
                  className="px-10 py-3.5 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase text-white flex items-center gap-2.5 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
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
