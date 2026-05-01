import FormField from '../FormField'

const CollegeInfoStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">College Information</h2>
      <p className="text-gray-400 mb-6">Please provide your college details</p>

      <FormField
        label="College Name"
        name="college_name"
        value={formData.college_name}
        onChange={handleChange}
        error={errors.college_name}
        required
      />
      <FormField
        label="Principal Name"
        name="principal_name"
        value={formData.principal_name}
        onChange={handleChange}
      />
      <FormField
        label="Principal Email"
        name="principal_email"
        type="email"
        value={formData.principal_email}
        onChange={handleChange}
      />
      <FormField
        label="Coordinator Name"
        name="coordinator_name"
        value={formData.coordinator_name}
        onChange={handleChange}
      />
      <FormField
        label="Coordinator Phone"
        name="coordinator_phone"
        value={formData.coordinator_phone}
        onChange={handleChange}
      />
      <FormField
        label="Coordinator Email"
        name="coordinator_email"
        type="email"
        value={formData.coordinator_email}
        onChange={handleChange}
      />
    </div>
  )
}

export default CollegeInfoStep