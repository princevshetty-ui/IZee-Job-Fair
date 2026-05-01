import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import Navbar from '../components/shared/Navbar'
import FormField from '../components/forms/FormField'
import Toast from '../components/shared/Toast'

const VolunteerValidatePage = () => {
  const [token, setToken] = useState(localStorage.getItem('volunteer_token'))
  const [rollNumber, setRollNumber] = useState('')
  const [email, setEmail] = useState('')
  const [manualSid, setManualSid] = useState('')
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)
  const qrRef = useRef(null)

  useEffect(() => {
    if (!token || !qrRef.current) return
    const qr = new Html5Qrcode(qrRef.current.id)
    const start = async () => {
      try {
        await qr.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 260 },
          (decodedText) => handleValidate(decodedText),
          () => {}
        )
      } catch (error) {
        setToast({ type: 'error', message: 'Unable to start QR scanner' })
      }
    }

    start()
    return () => {
      qr.stop().catch(() => {})
      qr.clear().catch(() => {})
    }
  }, [token])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteer/login`, {
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
      setToast({ type: 'error', message: 'Network error. Please try again.' })
    }
  }

  const handleValidate = async (sidValue) => {
    if (!sidValue) return
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteer/validate`, {
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
        setTimeout(() => setResult(null), 3000)
      } else {
        setResult({ status: 'error', message: data.detail || 'Validation failed' })
        setTimeout(() => setResult(null), 3000)
      }
    } catch (error) {
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
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8 text-center">Volunteer Login</h1>
          <div className="max-w-md mx-auto glass rounded-lg p-6">
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
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              >
                Login
              </button>
            </form>
          </div>
        </div>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Volunteer Validation</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Scan QR</h2>
            <div id="qr-reader" ref={qrRef} className="w-full" />
          </div>

          <div className="glass rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Manual SID</h2>
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
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
              >
                Validate
              </button>
            </form>
          </div>
        </div>

        {result && (
          <div
            className={`mt-6 glass rounded-lg p-6 border ${
              result.status === 'valid'
                ? 'border-emerald-500/60'
                : result.status === 'duplicate'
                ? 'border-rose-500/60'
                : 'border-yellow-500/60'
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">
              {result.status === 'valid' ? 'Valid Entry' : result.status === 'duplicate' ? 'Duplicate Scan' : 'Not Found'}
            </h3>
            <p className="text-gray-300 mb-2">{result.message}</p>
            {result.attendee && (
              <div className="text-sm text-gray-400 space-y-1">
                <p>Name: {result.attendee.name}</p>
                <p>Level: {result.attendee.academic_level}</p>
                <p>Stream: {result.attendee.stream}</p>
                <p>Reg Type: {result.attendee.reg_type}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default VolunteerValidatePage