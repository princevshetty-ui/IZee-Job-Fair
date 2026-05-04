import FormField from '../FormField'
import { FRESHER_STREAMS, PASSED_OUT_YEARS } from '../../../utils/constants'

const YEAR_OPTIONS = PASSED_OUT_YEARS.map(y => ({ value: String(y), label: String(y) }))

const FresherStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-2 font-heading-art tracking-tight">Education Details</h2>
      <p className="text-slate-400 text-sm mb-8">Please provide your graduation details</p>

      <FormField
        label="Graduation College & Location"
        name="graduation_college"
        value={formData.graduation_college}
        onChange={handleChange}
        error={errors.graduation_college}
        placeholder="e.g. ABC College, Bangalore"
        required
      />
      <FormField
        label="Passed Out Year"
        name="graduation_year"
        type="select"
        value={formData.graduation_year}
        onChange={handleChange}
        error={errors.graduation_year}
        options={YEAR_OPTIONS}
        required
      />
      <FormField
        label="Stream"
        name="stream"
        type="select"
        value={formData.stream}
        onChange={handleChange}
        error={errors.stream}
        options={FRESHER_STREAMS}
        required
      />
    </div>
  )
}

export default FresherStep
