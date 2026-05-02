import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'

const GlobalParticles = () => {
  const [particles] = useState(() => Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1.5,
    duration: Math.random() * 30 + 25,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.4 + 0.1
  })))

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-gradient-to-b from-cyan-400/30 to-indigo-600/30 rounded-full"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity, filter: 'blur(0.5px)' }}
          animate={{ y: [0, -600], opacity: [0, p.opacity, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  )
}

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams()
  const requestId = searchParams.get('id') || 'N/A'

  return (
    <div className="min-h-screen text-white selection:bg-indigo-500/20 font-light overflow-x-hidden" style={{ backgroundColor: '#0a0e1a' }}>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 40%, #0f1628 100%)'
        }}
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
        <motion.div
          className="absolute rounded-full blur-[100px] pointer-events-none"
          style={{
            width: 500,
            height: 500,
            background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.02) 50%, transparent 100%)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <GlobalParticles />

      <div className="relative z-10 w-full">
        <Navbar transparent={false} />

        <section className="min-h-[100dvh] flex items-center justify-center px-4 pt-32 pb-20">
          <div className="w-full max-w-2xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <h1 className="text-3xl md:text-5xl font-light text-white mb-4 font-heading-art tracking-tight">
                Registration Submitted
              </h1>
              <p className="text-slate-300 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Thank you for registering for the IZEE Job Fair 2026. Your request has been received and is being reviewed.
              </p>

              <div className="glass-card rounded-2xl p-8 mb-8 max-w-md mx-auto">
                <p className="text-slate-400 text-xs tracking-[0.15em] uppercase mb-3 font-semibold">Request ID</p>
                <p className="text-2xl md:text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 tracking-wider">
                  {requestId}
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 mb-10 max-w-lg mx-auto text-left">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-slate-200 text-sm font-medium mb-1">What Happens Next?</p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      If approved, your event pass will be sent to your registered email address. Please check both your <strong className="text-slate-300">Inbox</strong> and <strong className="text-slate-300">Spam</strong> folders. Keep your pass handy for entry on the day of the event.
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/" className="inline-block group">
                <div className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm tracking-[0.05em] uppercase transition-all shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105 group-hover:from-indigo-700 group-hover:to-cyan-600">
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