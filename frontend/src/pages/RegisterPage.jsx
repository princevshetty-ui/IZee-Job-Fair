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
    return <div className="min-h-screen lp2-grain" style={{ backgroundColor: '#15120f' }} />
  }

  if (!regOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 lp2-grain" style={{ backgroundColor: '#15120f' }}>
        {/* Header logo */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '20px 24px', borderBottom: '1px solid rgba(208,176,112,0.12)', background: 'rgba(21,18,15,0.95)', backdropFilter: 'blur(12px)' }}>
          <img src={collegeLogo} alt="IZEE" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
        </div>

        {/* Ambient orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute rounded-full blur-[180px]"
            style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(161,31,38,0.07) 0%, transparent 70%)', top: '40%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          <div className="absolute rounded-full blur-[120px]"
            style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(208,176,112,0.05) 0%, transparent 70%)', top: '20%', right: '20%' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(161,31,38,0.1)', border: '1px solid rgba(161,31,38,0.35)' }}>
            <svg className="w-9 h-9" style={{ color: '#a11f26' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(208,176,112,0.6)' }}>
            IZee Job Fair 2027
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem,6vw,2.75rem)', color: '#f5f1ed', lineHeight: 1.1 }} className="font-medium mb-4">
            Registration is<br /><span style={{ color: '#d0b070', fontStyle: 'italic' }}>Currently Closed</span>
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#8d7f76' }}>
            Pre-registration for IZEE Job Fair 2027 is currently closed. Please check back later or contact the organizers.
          </p>
          <Link to="/" className="inline-block group">
            <div
              className="px-8 py-3 font-semibold text-sm tracking-[0.12em] uppercase flex items-center gap-2.5 transition-all duration-300"
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
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden lp2-grain" style={{ backgroundColor: '#15120f' }}>
      {/* Fixed header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 24px', borderBottom: '1px solid rgba(208,176,112,0.12)', background: 'rgba(21,18,15,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src={collegeLogo} alt="IZEE" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
            <span style={{ borderLeft: '1px solid rgba(208,176,112,0.3)', paddingLeft: '12px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#d0b070', lineHeight: 1.4 }}>
              Job Fair<br />2027
            </span>
          </Link>
          <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#8d7f76' }}>
            Pre-Registration
          </span>
        </div>
      </header>

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[200px]"
          style={{ width: 800, height: 800, background: 'radial-gradient(circle, rgba(161,31,38,0.06) 0%, transparent 70%)', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
        <div className="absolute rounded-full blur-[150px]"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(208,176,112,0.04) 0%, transparent 70%)', top: '60%', right: '10%' }} />
        {/* Subtle grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(208,176,112,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(208,176,112,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 10%, transparent 100%)' }} />
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4" style={{ maxWidth: '680px' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <p className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.28em] font-semibold mb-4" style={{ color: '#d0b070' }}>
              <span className="h-px w-8 bg-current" />
              IZee Job Fair 2027
              <span className="h-px w-8 bg-current" />
            </p>
            <h1
              className="mb-4"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem,8vw,4.5rem)', color: '#f5f1ed', lineHeight: 1.05, fontWeight: 400 }}
            >
              Pre-<span style={{ fontStyle: 'italic', color: '#d0b070' }}>Registration</span>
            </h1>
            <p className="text-sm max-w-sm mx-auto" style={{ color: '#8d7f76' }}>
              Secure your place at IZEE Job Fair 2027 — connect with 80+ top recruiters
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(21,18,15,0.85)',
              border: '1px solid rgba(208,176,112,0.18)',
              boxShadow: '0 0 80px rgba(161,31,38,0.06), 0 1px 0 rgba(208,176,112,0.08) inset',
              backdropFilter: 'blur(12px)',
              padding: '32px',
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
