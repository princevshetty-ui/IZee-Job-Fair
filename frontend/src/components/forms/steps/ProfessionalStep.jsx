import FormField from '../FormField'
import { PASSED_OUT_YEARS, CITIES, STATES } from '../../../utils/constants'

const YEAR_OPTIONS = PASSED_OUT_YEARS.map(y => ({ value: String(y), label: String(y) }))
const CITY_OPTIONS = CITIES.map(c => ({ value: c, label: c }))
const STATE_OPTIONS = STATES.map(s => ({ value: s, label: s }))

const ProfessionalStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-light mb-2 font-heading-art tracking-tight" style={{ color: '#f5f1ed' }}>Professional Information</h2>
      <p className="text-sm mb-8" style={{ color: '#8d7f76' }}>Please provide your professional details</p>

      <FormField
        label="Company Name"
        name="company_name"
        value={formData.company_name}
        onChange={handleChange}
        error={errors.company_name}
        placeholder="Enter your company name"
        required
      />
      <FormField
        label="Designation"
        name="designation"
        value={formData.designation}
        onChange={handleChange}
        error={errors.designation}
        placeholder="Enter your designation"
        required
      />
      <FormField
        label="Years of Experience"
        name="experience_years"
        type="number"
        value={formData.experience_years}
        onChange={handleChange}
        error={errors.experience_years}
        placeholder="e.g. 3"
        required
      />
      <FormField
        label="Graduation College"
        name="graduation_college"
        value={formData.graduation_college}
        onChange={handleChange}
        error={errors.graduation_college}
        placeholder="e.g. ABC College of Engineering"
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
    </div>
  )
}

export default ProfessionalStep
