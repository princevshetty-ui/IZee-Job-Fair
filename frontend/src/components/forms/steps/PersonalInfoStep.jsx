import FormField from '../FormField'

const PersonalInfoStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      <p className="text-gray-400 mb-6">Please fill in your personal details</p>

      <FormField
        label="Full Name"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        error={errors.full_name}
        required
      />
      <FormField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        required
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />
      <FormField
        label="Attendee Type"
        name="attendee_type"
        type="select"
        value={formData.attendee_type}
        onChange={handleChange}
        options={[
          { value: 'student', label: 'Student' },
          { value: 'professional', label: 'Professional' }
        ]}
        required
      />
    </div>
  )
}

export default PersonalInfoStep