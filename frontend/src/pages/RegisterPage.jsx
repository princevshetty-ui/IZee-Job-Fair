import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import RegistrationForm from '../components/forms/RegistrationForm'
import Toast from '../components/shared/Toast'
import { apiCall } from '../utils/api'
import collegeLogo from '../assets/images/college-logo.png'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [regOpen, setRegOpen] = useState(true)
  const [regChecked, setRegChecked] = useState(false)

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || ''
    fetch(`${API}/api/admin/registration-status`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.open === false) setRegOpen(false) })
      .catch(() => {})
      .finally(() => setRegChecked(true))
  }, [])

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const response = await apiCall('/api/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response?.ok) {
        const data = await response.json()
        navigate(`/register/confirmation?id=${data.id}&email=${encodeURIComponent(formData.email || '')}`)
      } else {
        const errorData = await response.json()
        setToast({ type: 'error', message: errorData.detail || 'Registration failed' })
      }
    } catch (error) {
      console.error(error)
      setToast({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (!regChecked) {
    return <div className="min-h-screen" style={{ backgroundColor: '#020208' }} />
  }

  if (!regOpen) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center px-4" style={{ backgroundColor: '#020208' }}>
        <img src={collegeLogo} alt="IZEE" style={{ position: 'fixed', top: 16, left: 20, zIndex: 50, height: 40, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.2))' }} />
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute rounded-full blur-[160px]"
            style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <svg className="w-9 h-9" style={{ color: '#818CF8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(99,102,241,0.5)' }}>
            IZee Job Fair 2026
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Registration is Currently Closed
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#64748B' }}>
            Pre-registration for IZEE Job Fair 2026 is currently closed. Please check back later or contact the organizers.
          </p>
          <Link to="/" className="inline-block group">
            <div
              className="px-8 py-3 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase text-white flex items-center gap-2.5 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.3)' }}
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return Home
            </div>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#020208' }}>
      <img src={collegeLogo} alt="IZEE" style={{ position: 'fixed', top: 16, left: 20, zIndex: 50, height: 40, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.2))' }} />
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[150px]"
          style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)' }} />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto" style={{ maxWidth: '100%', padding: '16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(99,102,241,0.5)' }}>
              IZee Job Fair 2026
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-heading-art mb-3">
              Pre-Registration
            </h1>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#475569' }}>
              Register now to secure your spot at the IZEE Job Fair 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto rounded-2xl p-6 md:p-8"
            style={{
              background: '#0D0D1A',
              border: '1px solid #1a1a2e',
              boxShadow: '0 0 60px rgba(99,102,241,0.05)'
            }}
          >
            <RegistrationForm onSubmit={handleSubmit} submitting={submitting} />
          </motion.div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default RegisterPage
