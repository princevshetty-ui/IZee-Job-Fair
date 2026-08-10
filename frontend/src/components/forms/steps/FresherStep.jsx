import FormField from '../FormField'
import { FRESHER_STREAMS, PASSED_OUT_YEARS, CITIES, STATES } from '../../../utils/constants'

const YEAR_OPTIONS = PASSED_OUT_YEARS.map(y => ({ value: String(y), label: String(y) }))
const CITY_OPTIONS = CITIES.map(c => ({ value: c, label: c }))
const STATE_OPTIONS = STATES.map(s => ({ value: s, label: s }))

const FresherStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-light mb-2 font-heading-art tracking-tight" style={{ color: '#f5f1ed' }}>Education Details</h2>
      <p className="text-sm mb-8" style={{ color: '#8d7f76' }}>Please provide your graduation details</p>

      <FormField
        label="College Name"
        name="college_name"
        value={formData.college_name}
        onChange={handleChange}
        error={errors.college_name}
        placeholder="e.g. ABC Institute of Technology"
        required
      />

      <FormField
        label="City"
        name="city"
        type="select"
        value={formData.city}
        onChange={handleChange}
        error={errors.city}
        options={CITY_OPTIONS}
        required
      />
      {formData.city === 'Others' && (
        <FormField
          label="Enter City"
          name="city_other"
          value={formData.city_other}
          onChange={handleChange}
          error={errors.city_other}
          placeholder="Enter your city"
          required
        />
      )}
      <FormField
        label="State"
        name="state"
        type="select"
        value={formData.state}
        onChange={handleChange}
        error={errors.state}
        options={STATE_OPTIONS}
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
