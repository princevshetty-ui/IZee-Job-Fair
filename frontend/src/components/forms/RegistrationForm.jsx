import { useState, useMemo } from 'react'
import PersonalInfoStep from './steps/PersonalInfoStep'
import AcademicDetailsStep from './steps/AcademicDetailsStep'
import ProfessionalStep from './steps/ProfessionalStep'
import CollegeInfoStep from './steps/CollegeInfoStep'

const RegistrationForm = ({ onSubmit, submitting = false }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    college_name: '',
    academic_level: '',
    stream: '',
    attendee_type: 'student',
    mba_specialization: '',
    stream_other: '',
    principal_name: '',
    principal_email: '',
    coordinator_name: '',
    coordinator_phone: '',
    coordinator_email: '',
    company_name: '',
    designation: '',
    experience_years: '',
    graduation_college: '',
    graduation_stream: '',
    graduation_year: ''
  })

  const steps = useMemo(() => {
    if (formData.attendee_type === 'professional') {
      return [
        { key: 'personal', component: PersonalInfoStep },
        { key: 'professional', component: ProfessionalStep },
        { key: 'college', component: CollegeInfoStep }
      ]
    }

    return [
      { key: 'personal', component: PersonalInfoStep },
      { key: 'academic', component: AcademicDetailsStep },
      { key: 'college', component: CollegeInfoStep }
    ]
  }, [formData.attendee_type])

  const CurrentStep = steps[currentStep].component

  const validateStep = () => {
    const nextErrors = {}
    if (steps[currentStep].key === 'personal') {
      if (!formData.full_name) nextErrors.full_name = 'Full name is required'
      if (!formData.phone) nextErrors.phone = 'Phone is required'
      if (!formData.email) nextErrors.email = 'Email is required'
    }

    if (steps[currentStep].key === 'academic') {
      if (!formData.academic_level) nextErrors.academic_level = 'Academic level is required'
      if (!formData.stream) nextErrors.stream = 'Stream is required'
      if (formData.stream === 'MBA' && !formData.mba_specialization) {
        nextErrors.mba_specialization = 'MBA specialization is required'
      }
      if (formData.stream === 'Others' && !formData.stream_other) {
        nextErrors.stream_other = 'Stream is required'
      }
    }

    if (steps[currentStep].key === 'professional') {
      if (!formData.company_name) nextErrors.company_name = 'Company name is required'
      if (!formData.designation) nextErrors.designation = 'Designation is required'
    }

    if (steps[currentStep].key === 'college') {
      if (!formData.college_name) nextErrors.college_name = 'College name is required'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validateStep()) return
    const payload = {
      ...formData,
      experience_years: formData.experience_years === '' ? null : Number(formData.experience_years),
      graduation_year: formData.graduation_year === '' ? null : Number(formData.graduation_year)
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CurrentStep formData={formData} setFormData={setFormData} errors={errors} />

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-lg border border-white/10 text-white disabled:opacity-40"
        >
          Back
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </form>
  )
}

export default RegistrationForm