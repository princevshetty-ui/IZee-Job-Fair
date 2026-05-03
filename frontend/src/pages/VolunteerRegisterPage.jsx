import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/shared/Navbar'
import FormField from '../components/forms/FormField'
import Toast from '../components/shared/Toast'
import { apiCall } from '../utils/api'
import { COURSES, YEARS } from '../utils/constants'

const VolunteerRegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    roll_number: '',
    phone: '',
    email: '',
    course: '',
    year: ''
  })
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const response = await apiCall('/api/volunteer/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response?.ok) {
        setSuccess(true)
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

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#0A0A0F' }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle 700px at 60% 30%, rgba(99,102,241,0.07) 0%, transparent 65%)' }} />
      <div className="relative z-10">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-4 py-16"
        >
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-indigo-400/60 font-semibold mb-3">Volunteer Programme</p>
            <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art mb-3">Volunteer Registration</h1>
            <p className="text-slate-400 text-base">Register to volunteer at the IZEE Job Fair 2026</p>
          </div>

          <div className="max-w-lg mx-auto">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="glass-card rounded-2xl p-10 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-light text-white mb-2 font-heading-art">You're registered!</h2>
                <p className="text-slate-400 text-sm">Your volunteer registration has been received. You'll receive login credentials before the event.</p>
              </motion.div>
            ) : (
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                  <FormField label="Roll Number" name="roll_number" value={formData.roll_number} onChange={handleChange} required placeholder="12 alphanumeric characters" />
                  <FormField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                  <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  <FormField label="Course" name="course" type="select" value={formData.course} onChange={handleChange} options={COURSES} required />
                  <FormField label="Year" name="year" type="select" value={formData.year} onChange={handleChange} options={YEARS} required />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm tracking-[0.05em] uppercase transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 mt-2"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Registering…
                      </span>
                    ) : 'Register as Volunteer'}
                  </button>
                </form>
                <p className="text-center mt-5 text-xs text-slate-600">This is a restricted registration link for volunteers only</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

export default VolunteerRegisterPage
