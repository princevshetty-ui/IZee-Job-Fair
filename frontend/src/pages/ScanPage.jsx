import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const RESET_DELAY = 5000
const CIRCUMFERENCE = 2 * Math.PI * 20

const ScanPage = () => {
  const [result, setResult] = useState(null)
  const [manualSid, setManualSid] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [scannerError, setScannerError] = useState(false)
  const qrRef = useRef(null)
  const qrInstanceRef = useRef(null)
  const resetTimerRef = useRef(null)
  const countdownRef = useRef(null)
  const processingRef = useRef(false)
  const API_URL = import.meta.env.VITE_API_URL || ''

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

  const handleVerify = useCallback(async (sid) => {
    const clean = sid?.trim()
    if (!clean || processingRef.current) return
    processingRef.current = true
    try {
      const res = await fetch(`${API_URL}/api/scan/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid: clean })
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ status: data.status, attendee: data.attendee, message: data.message })
      } else {
        setResult({ status: 'error', message: data.detail || 'SID not found' })
      }
    } catch {
      setResult({ status: 'error', message: 'Network error — check connection' })
    }
    scheduleReset()
  }, [API_URL, scheduleReset])

  useEffect(() => {
    if (!qrRef.current) return
    const qr = new Html5Qrcode('scan-qr-reader')
    qrInstanceRef.current = qr
    const start = async () => {
      try {
        await qr.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => { if (!processingRef.current) handleVerify(decoded) },
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
  }, [handleVerify])

  const handleManual = (e) => {
    e.preventDefault()
    handleVerify(manualSid)
    setManualSid('')
  }

  const ringProgress = countdown > 0 ? countdown / (RESET_DELAY / 1000) : 0
  const resultColor = result?.status === 'valid' ? '#10B981' : result?.status === 'duplicate' ? '#EF4444' : '#F59E0B'

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col overflow-hidden">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0A0A0F]/95 backdrop-blur-sm z-10">
        <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors text-sm flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400/70 font-semibold">IZEE Job Fair 2026</p>
          <p className="text-[11px] text-white/30 tracking-widest uppercase">Entry Scanner</p>
        </div>
        <div className="w-16" />
      </header>

      {/* Scanner Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">

        {/* Viewfinder */}
        <div className="relative">
          {/* Animated corner brackets */}
          {['tl','tr','bl','br'].map((pos) => (
            <motion.div
              key={pos}
              className={`absolute w-7 h-7 z-10 ${
                pos === 'tl' ? '-top-1 -left-1 border-t-2 border-l-2 rounded-tl-lg' :
                pos === 'tr' ? '-top-1 -right-1 border-t-2 border-r-2 rounded-tr-lg' :
                pos === 'bl' ? '-bottom-1 -left-1 border-b-2 border-l-2 rounded-bl-lg' :
                                '-bottom-1 -right-1 border-b-2 border-r-2 rounded-br-lg'
              } border-blue-500`}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: pos === 'tl' || pos === 'br' ? 0 : 1 }}
            />
          ))}

          {/* Scan line */}
          <div className="absolute inset-x-0 top-0 h-full overflow-hidden rounded-2xl z-10 pointer-events-none">
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              animate={{ top: ['8%', '92%', '8%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {scannerError ? (
            <div className="w-[300px] h-[300px] rounded-2xl bg-[#111118] border border-white/10 flex flex-col items-center justify-center gap-3">
              <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-slate-500 text-sm text-center px-4">Camera unavailable<br/>Use manual entry below</p>
            </div>
          ) : (
            <div
              id="scan-qr-reader"
              ref={qrRef}
              className="w-[300px] h-[300px] rounded-2xl overflow-hidden bg-black border border-white/10"
            />
          )}
        </div>

        <p className="text-slate-600 text-xs tracking-widest uppercase">Point camera at QR pass</p>

        {/* Manual Entry */}
        <form onSubmit={handleManual} className="w-full max-w-sm flex gap-2">
          <input
            type="text"
            value={manualSid}
            onChange={e => setManualSid(e.target.value)}
            placeholder="Type SID manually…"
            className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-slate-700 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all font-mono tracking-wider"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-xl text-white text-sm font-semibold transition-all"
          >
            Check
          </button>
        </form>
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
            style={{ background: `${resultColor}14` }}
          >
            <div className="absolute inset-0 backdrop-blur-md" onClick={doReset} />

            <motion.div
              initial={result.status === 'duplicate' ? { x: 0 } : { scale: 0.85, opacity: 0 }}
              animate={result.status === 'duplicate'
                ? { x: [0, -14, 14, -9, 9, -5, 5, 0] }
                : { scale: 1, opacity: 1 }
              }
              transition={result.status === 'duplicate'
                ? { duration: 0.55, ease: 'easeOut' }
                : { type: 'spring', stiffness: 320, damping: 22 }
              }
              className="relative z-10 w-full max-w-sm rounded-2xl p-8 border backdrop-blur-sm"
              style={{
                background: result.status === 'valid' ? '#0D1F17' : result.status === 'duplicate' ? '#1F0D0D' : '#1A1505',
                borderColor: `${resultColor}40`,
                boxShadow: `0 0 80px ${resultColor}22`
              }}
            >
              {/* Status icon */}
              <div className="flex justify-center mb-5">
                {result.status === 'valid' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: '#10B98120', border: '2px solid #10B98150' }}
                  >
                    <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : result.status === 'duplicate' ? (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#EF444420', border: '2px solid #EF444450' }}>
                    <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#F59E0B20', border: '2px solid #F59E0B50' }}>
                    <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold text-center mb-1.5" style={{ color: resultColor }}>
                {result.status === 'valid' ? 'Entry Granted' : result.status === 'duplicate' ? 'Already Checked In' : 'Not Found'}
              </h2>

              {result.message && (
                <p className="text-slate-400 text-sm text-center mb-4 leading-relaxed">{result.message}</p>
              )}

              {result.attendee && (
                <div className="rounded-xl p-4 mt-2 space-y-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white font-semibold text-center text-lg">
                    {result.attendee.full_name || result.attendee.name}
                  </p>
                  <div className="flex justify-center gap-4 text-xs text-slate-500 mt-1">
                    {result.attendee.academic_level && <span>{result.attendee.academic_level}</span>}
                    {result.attendee.stream && <span>{result.attendee.stream}</span>}
                    {result.attendee.sid && (
                      <span className="font-mono text-blue-400 uppercase">{result.attendee.sid}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Auto-reset countdown ring */}
              {countdown > 0 && (
                <div className="flex items-center justify-center gap-2.5 mt-5">
                  <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
                    <circle
                      cx="22" cy="22" r="18" fill="none"
                      stroke={resultColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE * 0.9}
                      strokeDashoffset={(CIRCUMFERENCE * 0.9) * (1 - ringProgress)}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <span className="text-slate-600 text-xs">Reset in {countdown}s</span>
                </div>
              )}

              <button
                onClick={doReset}
                className="w-full mt-4 py-2.5 rounded-xl text-sm transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.color = 'rgba(255,255,255,0.8)' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.4)' }}
              >
                Scan Next →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ScanPage
