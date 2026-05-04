import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
const ConfirmationPage = () => {
  const [searchParams] = useSearchParams()
  const requestId = searchParams.get('id') || 'N/A'

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#020208' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[160px]"
          style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div className="absolute rounded-full blur-[120px]"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', top: '20%', right: '15%' }} />
      </div>

      <div className="relative z-10 w-full">
        <section className="min-h-[100dvh] flex items-center justify-center px-4 pt-16 pb-20">
          <div className="w-full max-w-xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 240, damping: 16 }}
                className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #0d9488)',
                  boxShadow: '0 0 50px rgba(16,185,129,0.4), 0 0 100px rgba(16,185,129,0.1)'
                }}
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}>
                <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(16,185,129,0.6)' }}>
                  Submission Received
                </p>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading-art tracking-tight">
                  Registration Submitted
                </h1>
                <p className="text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed" style={{ color: '#475569' }}>
                  Thank you for registering for the IZEE Job Fair 2026. Your request has been received and is under review.
                </p>
              </motion.div>

              {/* Request ID */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="rounded-2xl p-7 mb-5 max-w-sm mx-auto"
                style={{ background: '#0D0D1A', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 0 40px rgba(99,102,241,0.06)' }}
              >
                <p className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-3" style={{ color: '#475569' }}>
                  Request ID
                </p>
                <p className="text-2xl md:text-3xl font-mono font-bold tracking-wider text-gradient-hero">
                  {requestId}
                </p>
              </motion.div>

              {/* Next steps */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="rounded-2xl p-6 mb-10 max-w-lg mx-auto text-left"
                style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    <svg className="w-4 h-4" style={{ color: '#06B6D4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1.5">What Happens Next?</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                      If approved, your event pass will be sent to your registered email. Check both your{' '}
                      <strong style={{ color: '#94A3B8' }}>Inbox</strong> and{' '}
                      <strong style={{ color: '#94A3B8' }}>Spam</strong> folders. Keep your pass ready for entry on event day.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
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
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ConfirmationPage
