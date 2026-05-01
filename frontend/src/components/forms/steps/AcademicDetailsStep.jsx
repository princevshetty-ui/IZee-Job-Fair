const AcademicDetailsStep = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Academic Details</h2>
      <p className="text-gray-400 mb-6">Please provide your academic information</p>
      {/* Form fields would be implemented here */}
    </div>
  )
}

export default AcademicDetailsStep