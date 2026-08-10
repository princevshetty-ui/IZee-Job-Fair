import FormField from '../FormField'
import { ATTENDEE_TYPES } from '../../../utils/constants'

const PersonalInfoStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-light mb-2 font-heading-art tracking-tight" style={{ color: '#f5f1ed' }}>Personal Information</h2>
      <p className="text-sm mb-8" style={{ color: '#8d7f76' }}>Please fill in your personal details to get started</p>

      <FormField
        label="Full Name"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        error={errors.full_name}
        placeholder="Enter your full name"
        required
      />
      <FormField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="Enter your phone number"
        required
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Enter your email address"
        required
      />
      <FormField
        label="Attendee Type"
        name="attendee_type"
        type="select"
        value={formData.attendee_type}
        onChange={handleChange}
        options={ATTENDEE_TYPES}
        required
      />
    </div>
  )
}

export default PersonalInfoStep
