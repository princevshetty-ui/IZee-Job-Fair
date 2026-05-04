import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: '#020208' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[160px]"
          style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-[8rem] md:text-[12rem] font-heading-art font-bold leading-none mb-4"
            style={{ WebkitTextFillColor: 'transparent', WebkitTextStroke: '1px rgba(99,102,241,0.3)' }}
          >
            404
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}>
            <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(99,102,241,0.5)' }}>
              Page Not Found
            </p>
            <p className="text-xl md:text-2xl font-bold text-white font-heading-art mb-3">
              This page doesn't exist
            </p>
            <p className="text-sm mb-10 max-w-sm mx-auto" style={{ color: '#475569' }}>
              The page you are looking for does not exist or has been moved.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            <Link to="/">
              <div
                className="inline-flex items-center gap-2.5 px-10 py-3.5 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase text-white transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFoundPage
