import FormField from '../FormField'

const CollegeInfoStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-2 font-heading-art tracking-tight">Coordinator Information</h2>
      <p className="text-slate-400 text-sm mb-8">Please provide your college coordinator's contact details</p>

      <FormField
        label="Coordinator Name"
        name="coordinator_name"
        value={formData.coordinator_name}
        onChange={handleChange}
        error={errors.coordinator_name}
        placeholder="Enter coordinator name"
        required
      />
      <FormField
        label="Coordinator Phone"
        name="coordinator_phone"
        value={formData.coordinator_phone}
        onChange={handleChange}
        error={errors.coordinator_phone}
        placeholder="Enter coordinator phone"
        required
      />
      <FormField
        label="Coordinator Email"
        name="coordinator_email"
        type="email"
        value={formData.coordinator_email}
        onChange={handleChange}
        error={errors.coordinator_email}
        placeholder="Enter coordinator email"
        required
      />
      <FormField
        label="Principal Name"
        name="principal_name"
        value={formData.principal_name}
        onChange={handleChange}
        placeholder="Enter principal name (optional)"
      />
      <FormField
        label="Principal Email"
        name="principal_email"
        type="email"
        value={formData.principal_email}
        onChange={handleChange}
        placeholder="Enter principal email (optional)"
      />
    </div>
  )
}

export default CollegeInfoStep
