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
    return <div className="min-h-screen lp2-grain" style={{ backgroundColor: '#15120f' }} />
  }

  if (!onspotOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 lp2-grain" style={{ backgroundColor: '#15120f' }}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute rounded-full blur-[180px]"
            style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(161,31,38,0.07) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-sm"
        >
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(161,31,38,0.1)', border: '1px solid rgba(161,31,38,0.3)' }}>
            <svg className="w-8 h-8" style={{ color: '#a11f26' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(208,176,112,0.6)' }}>
            Walk-In Registration
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.75rem,5vw,2.5rem)', color: '#f5f1ed', lineHeight: 1.1 }} className="font-medium mb-3">
            On-Spot Registration<br /><span style={{ color: '#d0b070', fontStyle: 'italic' }}>Closed</span>
          </h1>
          <p className="text-sm" style={{ color: '#8d7f76' }}>
            On-spot registration is currently unavailable. Please contact the event team for assistance.
          </p>
        </motion.div>
      </div>
    )
  }

  if (passImage) {
    return (
      <div className="min-h-screen overflow-x-hidden lp2-grain" style={{ backgroundColor: '#15120f' }}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute rounded-full blur-[180px]"
            style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(161,31,38,0.07) 0%, transparent 70%)', top: '30%', left: '50%', transform: 'translateX(-50%)' }} />
        </div>
        <div className="relative z-10 pt-16 pb-16">
          <div className="container mx-auto px-4" style={{ maxWidth: '540px' }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.1 }}
                className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                style={{ background: '#a11f26', border: '1px solid rgba(208,176,112,0.3)' }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <p className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2" style={{ color: 'rgba(208,176,112,0.7)' }}>Registration Complete</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem,6vw,3rem)', color: '#f5f1ed', fontWeight: 400, lineHeight: 1.05 }} className="mb-3">
                You're <span style={{ fontStyle: 'italic', color: '#d0b070' }}>All Set!</span>
              </h1>
              <p className="text-sm mb-8" style={{ color: '#8d7f76' }}>Your pass has been generated and emailed to you.</p>

              {sid && (
                <div className="mb-5 p-6"
                  style={{ background: 'rgba(21,18,15,0.8)', border: '1px solid rgba(208,176,112,0.2)' }}>
                  <p className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-2" style={{ color: '#8d7f76' }}>Your SID</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', color: '#d0b070', letterSpacing: '0.1em' }}>{sid}</p>
                </div>
              )}

              <div className="p-4 mb-5" style={{ background: 'rgba(21,18,15,0.8)', border: '1px solid rgba(208,176,112,0.15)' }}>
                <img src={`data:image/jpeg;base64,${passImage}`} alt="Your Event Pass" className="w-full" />
              </div>

              <p className="text-xs" style={{ color: '#5a4f48' }}>A copy has been sent to your email address.</p>
            </motion.div>
          </div>
        </div>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden lp2-grain" style={{ backgroundColor: '#15120f' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[200px]"
          style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(161,31,38,0.06) 0%, transparent 70%)', top: '25%', left: '50%', transform: 'translateX(-50%)' }} />
        <div className="absolute rounded-full blur-[150px]"
          style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(208,176,112,0.04) 0%, transparent 70%)', bottom: '20%', right: '10%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(208,176,112,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(208,176,112,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 10%, transparent 100%)' }} />
      </div>

      <div className="relative z-10 pt-16 pb-16">
        <div className="container mx-auto px-4" style={{ maxWidth: '680px' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <p className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.28em] font-semibold mb-4" style={{ color: '#d0b070' }}>
              <span className="h-px w-8 bg-current" />
              Walk-In Registration
              <span className="h-px w-8 bg-current" />
            </p>
            <h1
              className="mb-4"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem,8vw,4.5rem)', color: '#f5f1ed', lineHeight: 1.05, fontWeight: 400 }}
            >
              On-Spot <span style={{ fontStyle: 'italic', color: '#d0b070' }}>Registration</span>
            </h1>
            <p className="text-sm max-w-sm mx-auto" style={{ color: '#8d7f76' }}>
              Register immediately for the IZEE Job Fair 2027
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
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default OnSpotRegisterPage
