import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/shared/Navbar'
import RegistrationForm from '../components/forms/RegistrationForm'
import Toast from '../components/shared/Toast'
import { apiCall } from '../utils/api'

const OnSpotRegisterPage = () => {
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [passImage, setPassImage] = useState(null)
  const [sid, setSid] = useState(null)

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

  if (passImage) {
    return (
      <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: 'transparent' }}>
        <div className="relative z-10">
          <Navbar />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="container mx-auto px-4 py-16"
          >
            <div className="max-w-lg mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20"
              >
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight font-heading-art mb-3">You're All Set!</h1>
              <p className="text-slate-400 text-base mb-8">Your pass has been generated and emailed to you.</p>
              {sid && (
                <div className="glass-card rounded-2xl p-6 mb-6">
                  <p className="text-slate-400 text-xs tracking-[0.15em] uppercase mb-2 font-semibold">Your SID</p>
                  <p className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-wider">{sid}</p>
                </div>
              )}
              <div className="glass-card rounded-2xl p-4 mb-6">
                <img src={`data:image/jpeg;base64,${passImage}`} alt="Your Event Pass" className="w-full rounded-xl" />
              </div>
              <p className="text-slate-500 text-sm">A copy has been sent to your email address.</p>
            </div>
          </motion.div>
        </div>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: 'transparent' }}>
      <div className="relative z-10">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-4 py-16"
        >
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-400/60 font-semibold mb-3">Walk-In Registration</p>
            <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art mb-3">On-Spot Registration</h1>
            <p className="text-slate-400 text-base max-w-xl mx-auto">Register immediately for the IZEE Job Fair 2026</p>
          </div>
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 md:p-8">
            <RegistrationForm onSubmit={handleSubmit} submitting={submitting} />
          </div>
        </motion.div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default OnSpotRegisterPage
