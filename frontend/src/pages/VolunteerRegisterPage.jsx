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
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#020208' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[150px]"
          style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)' }} />
      </div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3" style={{ color: 'rgba(139,92,246,0.5)' }}>
              Staff & Volunteers
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-heading-art mb-3">Volunteer Registration</h1>
            <p className="text-sm" style={{ color: '#475569' }}>Register to volunteer at the IZEE Job Fair 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-xl mx-auto rounded-2xl p-6 md:p-8"
            style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}
          >
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #10B981, #0d9488)', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Registration Successful</h2>
                <p className="text-sm" style={{ color: '#475569' }}>You've been registered as a volunteer.</p>
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
                  className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-[0.06em] uppercase text-white transition-all duration-200 disabled:opacity-50 mt-2"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
                  onMouseEnter={e => { if (!submitting) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {submitting ? 'Submitting…' : 'Register as Volunteer'}
                </button>
              </form>
            )}
            <p className="text-center mt-5 text-xs" style={{ color: '#334155' }}>Hidden registration link for volunteers only</p>
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
