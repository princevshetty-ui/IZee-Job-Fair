import { useState } from 'react'
import { motion } from 'framer-motion'
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
        setToast({ type: 'success', message: 'Volunteer registered successfully!' })
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
    <div className="min-h-screen overflow-x-hidden lp2-grain" style={{ backgroundColor: '#15120f' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[200px]"
          style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(161,31,38,0.06) 0%, transparent 70%)', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
        <div className="absolute rounded-full blur-[150px]"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(208,176,112,0.04) 0%, transparent 70%)', bottom: '15%', right: '10%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(208,176,112,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(208,176,112,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 10%, transparent 100%)' }} />
      </div>

      <div className="relative z-10 py-16 px-4">
        <div className="container mx-auto" style={{ maxWidth: '620px' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center mb-10"
          >
            <p className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.28em] font-semibold mb-4" style={{ color: '#d0b070' }}>
              <span className="h-px w-8 bg-current" />
              Staff & Volunteers
              <span className="h-px w-8 bg-current" />
            </p>
            <h1
              className="mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem,8vw,4rem)', color: '#f5f1ed', lineHeight: 1.05, fontWeight: 400 }}
            >
              Volunteer <span style={{ fontStyle: 'italic', color: '#d0b070' }}>Registration</span>
            </h1>
            <p className="text-sm" style={{ color: '#8d7f76' }}>Register to volunteer at the IZEE Job Fair 2027</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            style={{
              background: 'rgba(21,18,15,0.85)',
              border: '1px solid rgba(208,176,112,0.18)',
              boxShadow: '0 0 80px rgba(161,31,38,0.06), 0 1px 0 rgba(208,176,112,0.08) inset',
              backdropFilter: 'blur(12px)',
              padding: '32px',
            }}
          >
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center"
                  style={{ background: '#a11f26', border: '1px solid rgba(208,176,112,0.3)' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', color: '#f5f1ed', fontWeight: 400 }} className="mb-2">
                  Registration <span style={{ fontStyle: 'italic', color: '#d0b070' }}>Successful</span>
                </h2>
                <p className="text-sm" style={{ color: '#8d7f76' }}>You've been registered as a volunteer.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                <FormField label="Roll Number" name="roll_number" value={formData.roll_number} onChange={handleChange} required />
                <FormField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <FormField label="Course" name="course" type="select" value={formData.course} onChange={handleChange} options={COURSES} required />
                <FormField label="Year" name="year" type="select" value={formData.year} onChange={handleChange} options={YEARS} required />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 font-semibold text-sm tracking-[0.12em] uppercase transition-all duration-300 disabled:opacity-50 mt-2"
                  style={{ background: '#a11f26', color: '#f5f1ed', border: '1px solid rgba(208,176,112,0.25)' }}
                  onMouseEnter={e => { if (!submitting) { e.currentTarget.style.background = '#d0b070'; e.currentTarget.style.color = '#15120f' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#a11f26'; e.currentTarget.style.color = '#f5f1ed' }}
                >
                  {submitting ? 'Submitting…' : 'Register as Volunteer'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

export default VolunteerRegisterPage
