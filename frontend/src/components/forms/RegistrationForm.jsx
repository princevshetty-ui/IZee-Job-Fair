import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PersonalInfoStep from './steps/PersonalInfoStep'
import AcademicDetailsStep from './steps/AcademicDetailsStep'
import ProfessionalStep from './steps/ProfessionalStep'
import CollegeInfoStep from './steps/CollegeInfoStep'

const RegistrationForm = ({ onSubmit, submitting = false }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [complianceAccepted, setComplianceAccepted] = useState(false)
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
    if (!complianceAccepted) {
      setErrors({ ...errors, compliance: 'You must confirm the checklist to proceed' })
      return
    }
    const payload = {
      ...formData,
      experience_years: formData.experience_years === '' ? null : Number(formData.experience_years),
      graduation_year: formData.graduation_year === '' ? null : Number(formData.graduation_year)
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Progress */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
              i < currentStep ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' :
              i === currentStep ? 'bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30' :
              'bg-white/[0.06] text-slate-500 border border-white/10'
            }`}>
              {i < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 md:w-12 h-0.5 rounded-full transition-all duration-300 ${i < currentStep ? 'bg-emerald-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
        >
          <CurrentStep formData={formData} setFormData={setFormData} errors={errors} />
        </motion.div>
      </AnimatePresence>

      {currentStep === steps.length - 1 && (
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="compliance"
              checked={complianceAccepted}
              onChange={(e) => setComplianceAccepted(e.target.checked)}
              className="form-checkbox mt-0.5"
            />
            <label htmlFor="compliance" className="text-slate-300 text-sm leading-relaxed cursor-pointer select-none">
              I confirm that I will bring <strong className="text-white">10 sets of updated CVs</strong>,{' '}
              <strong className="text-white">10 passport-size photographs</strong>, and a{' '}
              <strong className="text-white">valid government-issued ID proof</strong>. I understand that this is
              a large-scale recruitment event with participation from <strong className="text-white">80+ companies</strong>{' '}
              and I must come fully prepared.
            </label>
          </div>
          {errors.compliance && <p className="text-red-400 text-xs mt-2">{errors.compliance}</p>}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-indigo-500/30 text-slate-300 disabled:opacity-40 hover:bg-white/[0.04] transition-all text-sm font-medium"
        >
          Back
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm tracking-[0.05em] uppercase transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02]"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm tracking-[0.05em] uppercase transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        )}
      </div>
    </form>
  )
}

export default RegistrationForm