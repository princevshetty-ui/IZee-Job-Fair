import { useState } from 'react'
import Navbar from '../components/shared/Navbar'
import RegistrationForm from '../components/forms/RegistrationForm'
import Toast from '../components/shared/Toast'
import { apiCall } from '../utils/api'

const RegisterPage = () => {
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
        setToast({ type: 'success', message: 'Registration submitted successfully!' })
      } else {
        const errorData = await response.json()
        setToast({ type: 'error', message: errorData.detail || 'Registration failed' })
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Pre-Registration</h1>
        <div className="max-w-2xl mx-auto glass rounded-lg p-6">
          <RegistrationForm onSubmit={handleSubmit} submitting={submitting} />
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