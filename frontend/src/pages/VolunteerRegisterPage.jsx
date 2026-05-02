import { useState } from 'react'
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
            <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art mb-3">Volunteer Registration</h1>
            <p className="text-slate-400 text-base">Register to volunteer at the IZEE Job Fair 2026</p>
          </div>
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <FormField
                label="Roll Number"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                required
              />
              <FormField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FormField
                label="Course"
                name="course"
                type="select"
                value={formData.course}
                onChange={handleChange}
                options={COURSES}
                required
              />
              <FormField
                label="Year"
                name="year"
                type="select"
                value={formData.year}
                onChange={handleChange}
                options={YEARS}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm tracking-[0.05em] uppercase transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02] disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Register'}
              </button>
            </form>
            <p className="text-center mt-6 text-xs text-slate-500">This is a hidden registration link for volunteers</p>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default VolunteerRegisterPage