import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PersonalInfoStep from './steps/PersonalInfoStep'
import AcademicDetailsStep from './steps/AcademicDetailsStep'
import ProfessionalStep from './steps/ProfessionalStep'
import CollegeInfoStep from './steps/CollegeInfoStep'
import FresherStep from './steps/FresherStep'

const STEP_LABELS = {
  personal: 'Personal',
  academic: 'Academic',
  coordinator: 'Coordinator',
  fresher: 'Details',
  professional: 'Professional',
}

const RegistrationForm = ({ onSubmit, submitting = false }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [complianceAccepted, setComplianceAccepted] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    city: '',
    city_other: '',
    state: '',
    attendee_type: 'student',
    // Student fields
    college_name: '',
    academic_level: '',
    stream: '',
    mba_specialization: '',
    stream_other: '',
    coordinator_name: '',
    coordinator_phone: '',
    coordinator_email: '',
    principal_name: '',
    principal_email: '',
    // Fresher + Professional fields
    graduation_college: '',
    graduation_year: '',
    // Professional-only fields
    company_name: '',
    designation: '',
    experience_years: '',
    graduation_stream: '',
  })

  const steps = useMemo(() => {
    if (formData.attendee_type === 'professional') {
      return [
        { key: 'personal', component: PersonalInfoStep },
        { key: 'professional', component: ProfessionalStep },
      ]
    }
    if (formData.attendee_type === 'fresher') {
      return [
        { key: 'personal', component: PersonalInfoStep },
        { key: 'fresher', component: FresherStep },
      ]
    }
    // student
    return [
      { key: 'personal', component: PersonalInfoStep },
      { key: 'academic', component: AcademicDetailsStep },
      { key: 'coordinator', component: CollegeInfoStep },
    ]
  }, [formData.attendee_type])

  const CurrentStep = steps[currentStep].component

  const validateStep = () => {
    const nextErrors = {}
    const key = steps[currentStep].key

    if (key === 'personal') {
      if (!formData.full_name) nextErrors.full_name = 'Full name is required'
      if (!formData.phone) nextErrors.phone = 'Phone is required'
      if (!formData.email) nextErrors.email = 'Email is required'
    }

    if (key === 'academic') {
      if (!formData.academic_level) nextErrors.academic_level = 'Academic level is required'
      if (!formData.stream) nextErrors.stream = 'Stream is required'
      if (!formData.college_name) nextErrors.college_name = 'College name is required'
      if (!formData.city) nextErrors.city = 'College city is required'
      if (formData.city === 'Others' && !formData.city_other) nextErrors.city_other = 'Please enter your city'
      if (!formData.state) nextErrors.state = 'State is required'
      if (formData.stream === 'MBA' && !formData.mba_specialization) {
        nextErrors.mba_specialization = 'MBA specialization is required'
      }
      if (formData.stream === 'Others' && !formData.stream_other) {
        nextErrors.stream_other = 'Stream is required'
      }
    }

    // coordinator — all fields optional, no validation needed

    if (key === 'fresher') {
      if (!formData.college_name) nextErrors.college_name = 'College name is required'
      if (!formData.city) nextErrors.city = 'City is required'
      if (formData.city === 'Others' && !formData.city_other) nextErrors.city_other = 'Please enter your city'
      if (!formData.state) nextErrors.state = 'State is required'
      if (!formData.graduation_year) nextErrors.graduation_year = 'Passed out year is required'
      if (!formData.stream) nextErrors.stream = 'Stream is required'
    }

    if (key === 'professional') {
      if (!formData.company_name) nextErrors.company_name = 'Company name is required'
      if (!formData.designation) nextErrors.designation = 'Designation is required'
      if (!formData.experience_years) nextErrors.experience_years = 'Experience years is required'
      if (!formData.graduation_college) nextErrors.graduation_college = 'Graduation college is required'
      if (!formData.city) nextErrors.city = 'City is required'
      if (formData.city === 'Others' && !formData.city_other) nextErrors.city_other = 'Please enter your city'
      if (!formData.state) nextErrors.state = 'State is required'
      if (!formData.graduation_year) nextErrors.graduation_year = 'Passed out year is required'
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
    const { city_other, ...rest } = formData
    const payload = {
      ...rest,
      city: formData.city === 'Others' ? formData.city_other : formData.city,
      experience_years: formData.experience_years === '' ? null : Number(formData.experience_years),
      graduation_year: formData.graduation_year === '' ? null : Number(formData.graduation_year),
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* ── Step Indicator ── */}
      <div className="flex items-center justify-center">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 relative"
                style={
                  i < currentStep
                    ? { background: 'linear-gradient(135deg, #10B981, #0d9488)', color: 'white', boxShadow: '0 0 16px rgba(16,185,129,0.35)' }
                    : i === currentStep
                    ? { background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white', boxShadow: '0 0 20px rgba(99,102,241,0.45)' }
                    : { background: '#080810', border: '1px solid #1a1a2e', color: '#475569' }
                }
              >
                {i < currentStep ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className="text-[10px] font-medium hidden sm:block transition-colors duration-300"
                style={{ color: i === currentStep ? '#a5b4fc' : i < currentStep ? '#6ee7b7' : '#334155' }}>
                {STEP_LABELS[s.key]}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className="w-12 md:w-20 h-px mx-1 mb-5 rounded-full transition-all duration-500"
                style={{ background: i < currentStep ? 'linear-gradient(90deg, #10B981, #0d9488)' : '#1a1a2e' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Current Step Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <CurrentStep formData={formData} setFormData={setFormData} errors={errors} />
        </motion.div>
      </AnimatePresence>

      {/* ── Compliance Checkbox (last step only) ── */}
      {currentStep === steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-5"
          style={{ background: '#080810', border: '1px solid #1a1a2e' }}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="compliance"
              checked={complianceAccepted}
              onChange={(e) => setComplianceAccepted(e.target.checked)}
              className="form-checkbox mt-0.5"
            />
            <label htmlFor="compliance" className="text-sm leading-relaxed cursor-pointer select-none" style={{ color: '#94A3B8' }}>
              I confirm that I will bring <strong className="text-white">10 sets of updated CVs</strong>,{' '}
              <strong className="text-white">10 passport-size photographs</strong>, and a{' '}
              <strong className="text-white">valid government-issued ID proof</strong>. I understand that this is
              a large-scale recruitment event with participation from <strong className="text-white">80+ companies</strong>{' '}
              and I must come fully prepared.
            </label>
          </div>
          {errors.compliance && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs mt-2" style={{ color: '#EF4444' }}>
              {errors.compliance}
            </motion.p>
          )}
        </motion.div>
      )}

      {/* ── Navigation Buttons ── */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex-1 py-3.5 rounded-xl text-sm font-semibold tracking-[0.05em] transition-all duration-200 disabled:opacity-30"
          style={{
            background: '#080810',
            border: '1px solid #1a1a2e',
            color: '#94A3B8',
          }}
        >
          Back
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-[2] py-3.5 rounded-xl text-sm font-semibold tracking-[0.06em] uppercase text-white transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="flex-[2] py-3.5 rounded-xl text-sm font-semibold tracking-[0.06em] uppercase text-white transition-all duration-200 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #10B981, #0d9488)', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}
            onMouseEnter={e => { if (!submitting) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Submitting…
              </span>
            ) : 'Submit Registration'}
          </button>
        )}
      </div>
    </form>
  )
}

export default RegistrationForm
