import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight font-heading-art mb-3">Pre-Registration</h1>
            <p className="text-slate-400 text-base max-w-xl mx-auto">Register now to secure your spot at the IZEE Job Fair 2026</p>
          </div>
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 md:p-8">
            <RegistrationForm onSubmit={handleSubmit} submitting={submitting} />
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

export default RegisterPage