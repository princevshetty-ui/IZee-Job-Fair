import FormField from '../FormField'

const ProfessionalStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-2 font-heading-art tracking-tight">Professional Information</h2>
      <p className="text-slate-400 text-sm mb-8">Please provide your professional details</p>

      <FormField
        label="Company Name"
        name="company_name"
        value={formData.company_name}
        onChange={handleChange}
        error={errors.company_name}
        required
      />
      <FormField
        label="Designation"
        name="designation"
        value={formData.designation}
        onChange={handleChange}
        error={errors.designation}
        required
      />
      <FormField
        label="Years of Experience"
        name="experience_years"
        type="number"
        value={formData.experience_years}
        onChange={handleChange}
      />
      <FormField
        label="Graduation College"
        name="graduation_college"
        value={formData.graduation_college}
        onChange={handleChange}
      />
      <FormField
        label="Graduation Stream"
        name="graduation_stream"
        value={formData.graduation_stream}
        onChange={handleChange}
      />
      <FormField
        label="Graduation Year"
        name="graduation_year"
        type="number"
        value={formData.graduation_year}
        onChange={handleChange}
      />
    </div>
  )
}

export default ProfessionalStep