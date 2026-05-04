import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/shared/Navbar'
import FormField from '../components/forms/FormField'
import Toast from '../components/shared/Toast'

const ResultOverlay = ({ result, onDismiss }) => {
  if (!result) return null

  const isValid = result.status === 'valid'
  const isDuplicate = result.status === 'duplicate'

  return (
    <AnimatePresence>
      <motion.div
        key={result.status + (result.attendee?.name || '')}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 cursor-pointer"
        style={{
          background: isValid
            ? 'rgba(2, 10, 8, 0.97)'
            : isDuplicate
            ? 'rgba(10, 2, 2, 0.97)'
            : 'rgba(10, 8, 2, 0.97)'
        }}
        onClick={onDismiss}
      >
        {isValid && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              className="w-28 h-28 rounded-full flex items-center justify-center mb-8"
              style={{ background: 'linear-gradient(135deg, #10B981, #0d9488)', boxShadow: '0 0 60px rgba(16,185,129,0.5)' }}
            >
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
              <p className="text-xs uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: 'rgba(16,185,129,0.7)' }}>Valid Entry</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 font-heading-art">{result.attendee?.name || 'Attendee'}</h2>
              {result.attendee && (
                <div className="space-y-1 mt-4">
                  <p className="text-base" style={{ color: '#94A3B8' }}>{result.attendee.academic_level} · {result.attendee.stream}</p>
                  <p className="text-sm" style={{ color: '#475569' }}>{result.attendee.reg_type === 'pre' ? 'Pre-Registered' : 'On-Spot'}</p>
                </div>
              )}
              <p className="text-xs mt-8 uppercase tracking-[0.15em]" style={{ color: '#334155' }}>Tap anywhere to dismiss</p>
            </motion.div>
          </>
        )}

        {isDuplicate && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, x: [0, -8, 8, -8, 8, 0] }}
              transition={{ scale: { type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }, x: { delay: 0.3, duration: 0.5 } }}
              className="w-28 h-28 rounded-full flex items-center justify-center mb-8"
              style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', boxShadow: '0 0 60px rgba(239,68,68,0.5)' }}
            >
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
              <p className="text-xs uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: 'rgba(239,68,68,0.7)' }}>Already Checked In</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 font-heading-art">{result.attendee?.name || 'Attendee'}</h2>
              <p className="text-base" style={{ color: '#94A3B8' }}>{result.message}</p>
              <p className="text-xs mt-8 uppercase tracking-[0.15em]" style={{ color: '#334155' }}>Tap anywhere to dismiss</p>
            </motion.div>
          </>
        )}

        {!isValid && !isDuplicate && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              className="w-28 h-28 rounded-full flex items-center justify-center mb-8"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 0 60px rgba(245,158,11,0.4)' }}
            >
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
              <p className="text-xs uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: 'rgba(245,158,11,0.7)' }}>Not Found</p>
              <h2 className="text-3xl font-bold text-white mb-3 font-heading-art">Invalid SID</h2>
              <p className="text-base" style={{ color: '#94A3B8' }}>{result.message}</p>
              <p className="text-xs mt-8 uppercase tracking-[0.15em]" style={{ color: '#334155' }}>Tap anywhere to dismiss</p>
            </motion.div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

const VolunteerValidatePage = () => {
  const API_URL = import.meta.env.VITE_API_URL || ''
  const [token, setToken] = useState(localStorage.getItem('volunteer_token'))
  const [rollNumber, setRollNumber] = useState('')
  const [email, setEmail] = useState('')
  const [manualSid, setManualSid] = useState('')
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)
  const qrRef = useRef(null)
  const qrInstanceRef = useRef(null)

  const handleValidate = useCallback(async (sidValue) => {
    if (!sidValue) return
    try {
      const response = await fetch(`${API_URL}/api/volunteer/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sid: sidValue })
      })
      const data = await response.json()
      if (response.ok) {
        if (data.warning) {
          setResult({ status: 'duplicate', message: data.warning, attendee: data.attendee })
        } else {
          setResult({ status: 'valid', message: data.message, attendee: data.attendee })
        }
      } else {
        setResult({ status: 'error', message: data.detail || 'Validation failed' })
      }
    } catch (error) {
      console.error(error)
      setToast({ type: 'error', message: 'Network error. Please try again.' })
    }
  }, [token, API_URL])

  useEffect(() => {
    if (!token || !qrRef.current) return
    const qr = new Html5Qrcode(qrRef.current.id)
    qrInstanceRef.current = qr
    const start = async () => {
      try {
        await qr.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 260 },
          (decodedText) => handleValidate(decodedText),
          () => {}
        )
      } catch (error) {
        console.error(error)
        setToast({ type: 'error', message: 'Unable to start QR scanner' })
      }
    }

    start()
    return () => {
      if (qrInstanceRef.current) {
        qrInstanceRef.current.stop().catch(() => {})
        qrInstanceRef.current.clear().catch(() => {})
      }
    }
  }, [token, handleValidate])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${API_URL}/api/volunteer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roll_number: rollNumber, email })
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('volunteer_token', data.access_token)
        setToken(data.access_token)
      } else {
        setToast({ type: 'error', message: data.detail || 'Login failed' })
      }
    } catch (error) {
      console.error(error)
      setToast({ type: 'error', message: 'Network error. Please try again.' })
    }
  }

  const handleManualSubmit = (event) => {
    event.preventDefault()
    handleValidate(manualSid)
    setManualSid('')
  }

  if (!token) {
    return (
      <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#020208' }}>
        <div className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-4 py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(99,102,241,0.5)' }}>Volunteer Portal</p>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-heading-art mb-3">Volunteer Login</h1>
              <p className="text-sm" style={{ color: '#475569' }}>Sign in to access the validation dashboard</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="max-w-md mx-auto rounded-2xl p-6 md:p-8"
              style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}
            >
              <form onSubmit={handleLogin} className="space-y-4">
                <FormField
                  label="Roll Number"
                  name="roll_number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase text-white transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}
                >
                  Sign In
                </button>
              </form>
            </motion.div>
          </div>
        </div>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#020208' }}>
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(6,182,212,0.5)' }}>Scanner Active</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-heading-art mb-3">Attendance Scanner</h1>
            <p className="text-sm" style={{ color: '#475569' }}>Scan QR code or enter SID manually to validate attendance</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* Scanner Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: '#080810', border: '1px solid #1a1a2e' }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 8px rgba(6,182,212,0.8)' }} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: '#94A3B8' }}>QR Scanner</h2>
              </div>

              {/* Camera frame wrapper */}
              <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid rgba(6,182,212,0.15)' }}>
                <div id="qr-reader" ref={qrRef} className="w-full" />

                {/* Animated corner brackets */}
                <div className="scanner-frame rounded-xl">
                  <div className="scanner-corner tl" />
                  <div className="scanner-corner tr" />
                  <div className="scanner-corner bl" />
                  <div className="scanner-corner br" />
                  {/* Scan line */}
                  <div className="scan-line" />
                </div>
              </div>

              <p className="text-center text-xs mt-4" style={{ color: '#334155' }}>
                Position QR code within the frame
              </p>
            </motion.div>

            {/* Manual Entry Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="rounded-2xl p-6"
              style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <svg className="w-4 h-4" style={{ color: '#6366F1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: '#94A3B8' }}>Manual Entry</h2>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: '#475569' }}>
                    Student ID (SID)
                  </label>
                  <input
                    type="text"
                    value={manualSid}
                    onChange={(e) => setManualSid(e.target.value)}
                    placeholder="Enter SID code…"
                    className="form-input font-mono"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase text-white transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #10B981, #0d9488)', boxShadow: '0 4px 20px rgba(16,185,129,0.25)' }}
                >
                  Validate Entry
                </button>
              </form>

              <div className="mt-8 pt-6" style={{ borderTop: '1px solid #1a1a2e' }}>
                <p className="text-xs uppercase tracking-[0.12em] font-semibold mb-3" style={{ color: '#334155' }}>Quick Guide</p>
                <div className="space-y-2">
                  {[
                    { color: '#10B981', label: 'Green', desc: 'Valid — first check-in' },
                    { color: '#EF4444', label: 'Red', desc: 'Duplicate — already checked in' },
                    { color: '#F59E0B', label: 'Yellow', desc: 'Not found in system' },
                  ].map((g, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs" style={{ color: '#475569' }}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                      <span style={{ color: g.color }} className="font-semibold">{g.label}</span>
                      <span>{g.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Full-screen result overlay */}
      <ResultOverlay result={result} onDismiss={() => setResult(null)} />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default VolunteerValidatePage
