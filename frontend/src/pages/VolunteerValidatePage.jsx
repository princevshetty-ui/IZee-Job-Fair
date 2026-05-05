import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import collegeLogo from '../assets/images/college-logo.png'
import FormField from '../components/forms/FormField'
import Toast from '../components/shared/Toast'

const LogoFixed = () => (
  <img
    src={collegeLogo}
    alt="IZEE"
    style={{
      position: 'fixed', top: 16, left: 20, zIndex: 50,
      height: 40, width: 'auto', objectFit: 'contain',
      filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.2))',
    }}
  />
)

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

  // ── Auth state ──
  const [token, setToken] = useState(() => localStorage.getItem('volunteer_token'))
  const [rollNumber, setRollNumber] = useState('')
  const [loginEmail, setLoginEmail] = useState('')

  // ── Scanner state ──
  const [facingMode, setFacingMode] = useState('environment')
  const [cameraError, setCameraError] = useState(null)
  const [manualSid, setManualSid] = useState('')
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)

  const scannerRef = useRef(null)   // DOM element for Html5Qrcode to mount into
  const qrRef = useRef(null)        // Html5Qrcode instance
  const isRunningRef = useRef(false)

  // ── Validate SID against API ──
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

      // Fix 4: if token is expired/invalid, clear it and force re-login
      if (response.status === 401) {
        localStorage.removeItem('volunteer_token')
        setToken(null)
        setToast({ type: 'error', message: 'Session expired. Please log in again.' })
        return
      }

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

  // ── Camera scanner effect ──
  useEffect(() => {
    if (!token || !scannerRef.current) return

    const startScanner = async () => {
      if (!scannerRef.current) return
      setCameraError(null)
      try {
        const qr = new Html5Qrcode(scannerRef.current.id)
        qrRef.current = qr
        await qr.start(
          { facingMode: facingMode },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => { handleValidate(decodedText) },
          undefined
        )
        isRunningRef.current = true
      } catch (err) {
        const msg = err?.message || String(err)
        if (msg.includes('NotAllowed') || msg.includes('Permission')) {
          setCameraError('Camera access denied. Please allow camera access in your browser settings, or use manual SID entry below.')
        } else {
          setCameraError('Could not start camera: ' + msg)
        }
        isRunningRef.current = false
      }
    }

    startScanner()

    return () => {
      if (isRunningRef.current && qrRef.current) {
        qrRef.current.stop().catch(() => {}).finally(() => {
          qrRef.current = null
          isRunningRef.current = false
        })
      }
    }
  }, [token, handleValidate, facingMode])

  // ── Volunteer login ──
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${API_URL}/api/volunteer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roll_number: rollNumber, email: loginEmail })
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

  const handleLogout = () => {
    localStorage.removeItem('volunteer_token')
    setToken(null)
  }

  // Fix 3: stop current scanner and restart with opposite facing mode
  const flipCamera = useCallback(() => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
  }, [])

  const handleManualSubmit = (event) => {
    event.preventDefault()
    handleValidate(manualSid)
    setManualSid('')
  }

  // ── Fix 4: Auth gate — show login if no token ──
  if (!token) {
    return (
      <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#020208' }}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute rounded-full blur-[150px]"
            style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)' }} />
        </div>
        <div className="relative z-10">
          <LogoFixed />
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
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
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

  // ── Scanner view ──
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#020208' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[150px]"
          style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)' }} />
      </div>
      <div className="relative z-10">
        <LogoFixed />
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
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="mt-4 text-xs uppercase tracking-[0.12em] font-semibold transition-colors duration-200"
              style={{ color: '#334155' }}
              onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#334155'}
            >
              Sign Out
            </button>
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

              {/* Fix 1: Camera permission error message */}
              {cameraError ? (
                <div className="rounded-xl p-5 mb-4" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <p className="text-sm leading-relaxed" style={{ color: '#FCD34D' }}>{cameraError}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Camera frame wrapper */}
                  <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid rgba(6,182,212,0.15)' }}>
                    <div id="qr-reader" ref={scannerRef} className="w-full" />

                    {/* Animated corner brackets */}
                    <div className="scanner-frame rounded-xl">
                      <div className="scanner-corner tl" />
                      <div className="scanner-corner tr" />
                      <div className="scanner-corner bl" />
                      <div className="scanner-corner br" />
                      <div className="scan-line" />
                    </div>
                  </div>

                  {/* Fix 3: Flip camera button */}
                  <button
                    onClick={flipCamera}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-200"
                    style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', color: '#06B6D4' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(6,182,212,0.08)'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Flip Camera ({facingMode === 'environment' ? 'Back' : 'Front'})
                  </button>
                </>
              )}

              <p className="text-center text-xs mt-3" style={{ color: '#334155' }}>
                {cameraError ? 'Use manual entry on the right →' : 'Position QR code within the frame'}
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
