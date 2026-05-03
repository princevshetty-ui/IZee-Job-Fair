import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/shared/Navbar'
import Toast from '../components/shared/Toast'

const RESET_DELAY = 5000
const CIRCUMFERENCE = 2 * Math.PI * 18

const VolunteerValidatePage = () => {
  const API_URL = import.meta.env.VITE_API_URL || ''
  const [token, setToken] = useState(localStorage.getItem('volunteer_token'))
  const [rollNumber, setRollNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [manualSid, setManualSid] = useState('')
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)
  const [scannerError, setScannerError] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const qrRef = useRef(null)
  const qrInstanceRef = useRef(null)
  const resetTimerRef = useRef(null)
  const countdownRef = useRef(null)
  const processingRef = useRef(false)

  const doReset = useCallback(() => {
    processingRef.current = false
    setResult(null)
    setCountdown(0)
    clearTimeout(resetTimerRef.current)
    clearInterval(countdownRef.current)
  }, [])

  const scheduleReset = useCallback(() => {
    clearTimeout(resetTimerRef.current)
    clearInterval(countdownRef.current)
    const secs = RESET_DELAY / 1000
    setCountdown(secs)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
    resetTimerRef.current = setTimeout(doReset, RESET_DELAY)
  }, [doReset])

  const handleValidate = useCallback(async (sidValue) => {
    const clean = sidValue?.trim()
    if (!clean || processingRef.current) return
    processingRef.current = true
    try {
      const response = await fetch(`${API_URL}/api/volunteer/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sid: clean })
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
    } catch {
      setToast({ type: 'error', message: 'Network error. Please try again.' })
      processingRef.current = false
      return
    }
    scheduleReset()
  }, [token, API_URL, scheduleReset])

  useEffect(() => {
    if (!token || !qrRef.current) return
    const qr = new Html5Qrcode('vol-qr-reader')
    qrInstanceRef.current = qr
    const start = async () => {
      try {
        await qr.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decoded) => { if (!processingRef.current) handleValidate(decoded) },
          () => {}
        )
      } catch {
        setScannerError(true)
      }
    }
    start()
    return () => {
      qrInstanceRef.current?.stop().catch(() => {})
      qrInstanceRef.current?.clear().catch(() => {})
      clearTimeout(resetTimerRef.current)
      clearInterval(countdownRef.current)
    }
  }, [token, handleValidate])

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginLoading(true)
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
    } catch {
      setToast({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setLoginLoading(false)
    }
  }

  const handleManualSubmit = (event) => {
    event.preventDefault()
    handleValidate(manualSid)
    setManualSid('')
  }

  const resultColor = result?.status === 'valid' ? '#10B981' : result?.status === 'duplicate' ? '#EF4444' : '#F59E0B'
  const ringProgress = countdown > 0 ? countdown / (RESET_DELAY / 1000) : 0

  // Login gate
  if (!token) {
    return (
      <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#0A0A0F' }}>
        <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle 700px at 50% 40%, rgba(99,102,241,0.07) 0%, transparent 65%)' }} />
        <div className="relative z-10">
          <Navbar />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="container mx-auto px-4 py-16"
          >
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-indigo-400/60 font-semibold mb-3">Volunteer Portal</p>
              <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight font-heading-art mb-3">Volunteer Login</h1>
              <p className="text-slate-400 text-sm">Sign in to access the attendance scanner</p>
            </div>
            <div className="max-w-sm mx-auto glass-card rounded-2xl p-6 md:p-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Roll Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                    className="form-input font-mono tracking-wider"
                    placeholder="12-character roll number"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                    placeholder="Registered email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm tracking-[0.05em] uppercase transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 mt-1"
                >
                  {loginLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </div>
    )
  }

  // Scanner view
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0A0A0F]/95 backdrop-blur-sm z-10">
        <button
          onClick={() => {
            localStorage.removeItem('volunteer_token')
            setToken(null)
          }}
          className="text-slate-500 hover:text-slate-300 transition-colors text-sm flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-indigo-400/70 font-semibold">IZEE Job Fair 2026</p>
          <p className="text-[11px] text-white/30 tracking-widest uppercase">Attendance Scanner</p>
        </div>
        <div className="w-16" />
      </header>

      {/* Scanner + Manual */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-8">

        {/* QR Viewfinder */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {['tl','tr','bl','br'].map((pos) => (
              <motion.div
                key={pos}
                className={`absolute w-6 h-6 z-10 ${
                  pos === 'tl' ? '-top-1 -left-1 border-t-2 border-l-2 rounded-tl-lg' :
                  pos === 'tr' ? '-top-1 -right-1 border-t-2 border-r-2 rounded-tr-lg' :
                  pos === 'bl' ? '-bottom-1 -left-1 border-b-2 border-l-2 rounded-bl-lg' :
                                  '-bottom-1 -right-1 border-b-2 border-r-2 rounded-br-lg'
                } border-indigo-500`}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: pos === 'tl' || pos === 'br' ? 0 : 1 }}
              />
            ))}
            <div className="absolute inset-x-0 top-0 h-full overflow-hidden rounded-xl z-10 pointer-events-none">
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                animate={{ top: ['8%', '92%', '8%'] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            {scannerError ? (
              <div className="w-[260px] h-[260px] rounded-xl bg-[#111118] border border-white/10 flex flex-col items-center justify-center gap-3">
                <svg className="w-9 h-9 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                <p className="text-slate-600 text-xs text-center px-4">Camera unavailable<br/>Use manual entry</p>
              </div>
            ) : (
              <div id="vol-qr-reader" ref={qrRef} className="w-[260px] h-[260px] rounded-xl overflow-hidden bg-black border border-white/10" />
            )}
          </div>
          <p className="text-slate-600 text-xs tracking-widest uppercase">Scan QR pass</p>
        </div>

        {/* Divider */}
        <div className="flex lg:flex-col items-center gap-3">
          <div className="flex-1 lg:w-px lg:flex-none lg:h-20 h-px w-20 bg-white/[0.06]" />
          <span className="text-slate-700 text-xs uppercase tracking-widest">or</span>
          <div className="flex-1 lg:w-px lg:flex-none lg:h-20 h-px w-20 bg-white/[0.06]" />
        </div>

        {/* Manual Entry */}
        <div className="w-full max-w-xs">
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-4 text-center">Manual Entry</p>
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input
              type="text"
              value={manualSid}
              onChange={e => setManualSid(e.target.value)}
              placeholder="Enter SID…"
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-slate-700 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all font-mono tracking-wider"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-95"
            >
              Validate Entry
            </button>
          </form>
        </div>
      </div>

      {/* Result Overlay */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
            style={{ background: `${resultColor}12` }}
          >
            <div className="absolute inset-0 backdrop-blur-md" onClick={doReset} />
            <motion.div
              initial={result.status === 'duplicate' ? { x: 0 } : { scale: 0.88, opacity: 0 }}
              animate={result.status === 'duplicate'
                ? { x: [0, -12, 12, -8, 8, -4, 4, 0] }
                : { scale: 1, opacity: 1 }
              }
              transition={result.status === 'duplicate'
                ? { duration: 0.5, ease: 'easeOut' }
                : { type: 'spring', stiffness: 300, damping: 22 }
              }
              className="relative z-10 w-full max-w-sm rounded-2xl p-7 border"
              style={{
                background: result.status === 'valid' ? '#0C1D14' : result.status === 'duplicate' ? '#1D0C0C' : '#1A1505',
                borderColor: `${resultColor}40`,
                boxShadow: `0 0 60px ${resultColor}1A`
              }}
            >
              <div className="flex justify-center mb-5">
                {result.status === 'valid' ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.1 }}
                    className="w-18 h-18 rounded-full flex items-center justify-center" style={{ width: 72, height: 72, background: '#10B98120', border: '2px solid #10B98140' }}>
                    <svg className="w-9 h-9 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : result.status === 'duplicate' ? (
                  <div className="rounded-full flex items-center justify-center" style={{ width: 72, height: 72, background: '#EF444420', border: '2px solid #EF444440' }}>
                    <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                    </svg>
                  </div>
                ) : (
                  <div className="rounded-full flex items-center justify-center" style={{ width: 72, height: 72, background: '#F59E0B20', border: '2px solid #F59E0B40' }}>
                    <svg className="w-9 h-9 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-center mb-1.5" style={{ color: resultColor }}>
                {result.status === 'valid' ? 'Entry Granted' : result.status === 'duplicate' ? 'Already Validated' : 'Not Found'}
              </h2>

              {result.message && <p className="text-slate-400 text-sm text-center mb-3 leading-relaxed">{result.message}</p>}

              {result.attendee && (
                <div className="rounded-xl p-3.5 mt-2 space-y-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white font-semibold text-center">{result.attendee.name}</p>
                  <div className="flex justify-center gap-4 text-xs text-slate-500 mt-0.5">
                    {result.attendee.academic_level && <span>{result.attendee.academic_level}</span>}
                    {result.attendee.stream && <span>{result.attendee.stream}</span>}
                    {result.attendee.reg_type && <span className="uppercase font-mono text-indigo-400">{result.attendee.reg_type}</span>}
                  </div>
                </div>
              )}

              {countdown > 0 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <svg width="40" height="40" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
                    <circle cx="20" cy="20" r="16" fill="none" stroke={resultColor} strokeWidth="2.5" strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={CIRCUMFERENCE * (1 - ringProgress)}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <span className="text-slate-600 text-xs">Reset in {countdown}s</span>
                </div>
              )}

              <button onClick={doReset} className="w-full mt-3.5 py-2.5 rounded-xl text-sm transition-all" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = ''; e.target.style.color = 'rgba(255,255,255,0.4)' }}
              >
                Scan Next →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default VolunteerValidatePage
