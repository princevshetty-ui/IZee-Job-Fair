import FormField from '../FormField'

const CollegeInfoStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-light mb-2 font-heading-art tracking-tight" style={{ color: '#f5f1ed' }}>Coordinator Information</h2>
      <p className="text-sm mb-8" style={{ color: '#8d7f76' }}>Coordinator details are optional — fill in if available</p>

      <FormField
        label="Coordinator Name"
        name="coordinator_name"
        value={formData.coordinator_name}
        onChange={handleChange}
        placeholder="Enter coordinator name (optional)"
      />
      <FormField
        label="Coordinator Phone"
        name="coordinator_phone"
        value={formData.coordinator_phone}
        onChange={handleChange}
        placeholder="Enter coordinator phone (optional)"
      />
      <FormField
        label="Coordinator Email"
        name="coordinator_email"
        type="email"
        value={formData.coordinator_email}
        onChange={handleChange}
        placeholder="Enter coordinator email (optional)"
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
