import { useState } from 'react'
import Navbar from '../components/shared/Navbar'
import RegistrationForm from '../components/forms/RegistrationForm'
import Toast from '../components/shared/Toast'
import { apiCall } from '../utils/api'

const OnSpotPage = () => {
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [passImage, setPassImage] = useState(null)

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const response = await apiCall('/api/onspot', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (response?.ok) {
        setPassImage(data.pass_image)
        setToast({ type: 'success', message: 'Pass emailed! Please check inbox.' })
      } else {
        setToast({ type: 'error', message: data.detail || 'Registration failed' })
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
        <h1 className="text-3xl font-bold mb-8 text-center">On-Spot Registration</h1>
        <div className="max-w-2xl mx-auto glass rounded-lg p-6">
          <RegistrationForm onSubmit={handleSubmit} submitting={submitting} />
        </div>

        {passImage && (
          <div className="max-w-2xl mx-auto mt-10 glass rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Your Pass</h2>
            <img
              src={`data:image/jpeg;base64,${passImage}`}
              alt="Job Fair Pass"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        )}
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

export default OnSpotPage