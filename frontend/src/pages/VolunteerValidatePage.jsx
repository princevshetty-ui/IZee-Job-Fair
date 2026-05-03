import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import Navbar from '../components/shared/Navbar'
import FormField from '../components/forms/FormField'
import Toast from '../components/shared/Toast'

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
        setTimeout(() => setResult(null), 5000)
      } else {
        setResult({ status: 'error', message: data.detail || 'Validation failed' })
        setTimeout(() => setResult(null), 5000)
      }
    } catch (error) {
      console.error(error)
      setToast({ type: 'error', message: 'Network error. Please try again.' })
    }
  }, [token])

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
      <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#0a0e1a' }}>
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 40%, #0f1628 100%)'
          }}
        />
        <div className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art mb-3">Volunteer Login</h1>
              <p className="text-slate-400 text-base">Sign in to access the validation dashboard</p>
            </div>
            <div className="max-w-md mx-auto glass-card rounded-2xl p-6 md:p-8">
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
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm tracking-[0.05em] uppercase transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02]"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#0a0e1a' }}>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 40%, #0f1628 100%)'
        }}
      />
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art mb-3">Volunteer Validation</h1>
            <p className="text-slate-400 text-base">Scan or enter a SID to validate attendance</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-light text-white mb-4 font-heading-art">Scan QR</h2>
              <div id="qr-reader" ref={qrRef} className="w-full" />
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-light text-white mb-4 font-heading-art">Manual Entry</h2>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <FormField
                  label="SID"
                  name="sid"
                  value={manualSid}
                  onChange={(e) => setManualSid(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm tracking-[0.05em] uppercase transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]"
                >
                  Validate
                </button>
              </form>
            </div>
          </div>

          {result && (
            <div className="max-w-2xl mx-auto mt-6">
              <div
                className={`rounded-2xl p-6 border ${
                  result.status === 'valid'
                    ? 'border-emerald-500/40 glass-card'
                    : result.status === 'duplicate'
                    ? 'border-rose-500/40 glass-card'
                    : 'border-amber-500/40 glass-card'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">
                  {result.status === 'valid' ? 'Valid Entry' : result.status === 'duplicate' ? 'Duplicate Scan' : 'Not Found'}
                </h3>
                <p className="text-slate-300 mb-2">{result.message}</p>
                {result.attendee && (
                  <div className="text-sm text-slate-400 space-y-1">
                    <p>Name: {result.attendee.name}</p>
                    <p>Level: {result.attendee.academic_level}</p>
                    <p>Stream: {result.attendee.stream}</p>
                    <p>Reg Type: {result.attendee.reg_type}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default VolunteerValidatePage