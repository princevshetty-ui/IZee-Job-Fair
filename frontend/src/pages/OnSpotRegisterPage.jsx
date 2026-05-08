import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import RegistrationForm from '../components/forms/RegistrationForm'
import Toast from '../components/shared/Toast'
import { apiCall } from '../utils/api'

const OnSpotRegisterPage = () => {
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [passImage, setPassImage] = useState(null)
  const [sid, setSid] = useState(null)
  const [onspotOpen, setOnspotOpen] = useState(true)
  const [statusChecked, setStatusChecked] = useState(false)

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || ''
    fetch(`${API}/api/admin/registration-status`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.onspot_open === false) setOnspotOpen(false) })
      .catch(() => {})
      .finally(() => setStatusChecked(true))
  }, [])

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const response = await apiCall('/api/onspot', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response?.ok) {
        const data = await response.json()
        if (data.pass_image) {
          setPassImage(data.pass_image)
          setSid(data.sid)
        }
        setToast({ type: 'success', message: 'Registration successful! Your pass has been emailed.' })
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

  if (!statusChecked) {
    return <div className="min-h-screen" style={{ backgroundColor: '#020208' }} />
  }

  if (!onspotOpen) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center px-4" style={{ backgroundColor: '#020208' }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <svg className="w-8 h-8" style={{ color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">On-Spot Registration Closed</h1>
          <p className="text-sm" style={{ color: '#475569' }}>On-spot registration is currently unavailable. Please contact the event team for assistance.</p>
        </div>
      </div>
    )
  }

  if (passImage) {
    return (
      <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#020208' }}>
        <div className="relative z-10">
          <div className="container mx-auto" style={{ maxWidth: '100%', padding: '16px' }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-lg mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.1 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #10B981, #0d9488)', boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <p className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2" style={{ color: 'rgba(16,185,129,0.6)' }}>Registration Complete</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading-art mb-3">You're All Set!</h1>
              <p className="text-sm mb-8" style={{ color: '#475569' }}>Your pass has been generated and emailed to you.</p>

              {sid && (
                <div className="rounded-2xl p-6 mb-5"
                  style={{ background: '#0D0D1A', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <p className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-2" style={{ color: '#475569' }}>Your SID</p>
                  <p className="text-2xl font-mono font-bold tracking-wider text-gradient-hero">{sid}</p>
                </div>
              )}

              <div className="rounded-2xl p-4 mb-5" style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}>
                <img src={`data:image/jpeg;base64,${passImage}`} alt="Your Event Pass" className="w-full rounded-xl" />
              </div>

              <p className="text-xs" style={{ color: '#334155' }}>A copy has been sent to your email address.</p>
            </motion.div>
          </div>
        </div>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#020208' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[150px]"
          style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', top: '25%', left: '50%', transform: 'translateX(-50%)' }} />
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
            <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(6,182,212,0.5)' }}>
              Walk-In Registration
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-heading-art mb-3 text-gradient-hero">
              On-Spot Registration
            </h1>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#475569' }}>
              Register immediately for the IZEE Job Fair 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-xl mx-auto rounded-2xl p-6 md:p-8"
            style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}
          >
            <RegistrationForm onSubmit={handleSubmit} submitting={submitting} />
          </motion.div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default OnSpotRegisterPage
