import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/shared/Navbar'
import RegistrationForm from '../components/forms/RegistrationForm'
import Toast from '../components/shared/Toast'
import { apiCall } from '../utils/api'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const response = await apiCall('/api/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response?.ok) {
        const data = await response.json()
        navigate(`/register/confirmation?id=${data.id}`)
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
            <p className="text-[11px] uppercase tracking-[0.25em] text-blue-400/60 font-semibold mb-3">IZEE Job Fair 2026</p>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight font-heading-art mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Pre-Registration</h1>
            <p className="text-slate-400 text-base max-w-xl mx-auto">Register now to secure your spot at the IZEE Job Fair 2026</p>
          </div>
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 md:p-8">
            <RegistrationForm onSubmit={handleSubmit} submitting={submitting} />
          </div>
        </motion.div>
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

export default RegisterPage
