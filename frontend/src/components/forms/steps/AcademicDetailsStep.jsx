import FormField from '../FormField'
import { ACADEMIC_LEVELS, getStreamsForLevel, MBA_SPECIALIZATIONS } from '../../../utils/constants'

const AcademicDetailsStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const streamOptions = getStreamsForLevel(formData.academic_level) || []

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Academic Details</h2>
      <p className="text-gray-400 mb-6">Please provide your academic information</p>

      <FormField
        label="Academic Level"
        name="academic_level"
        type="select"
        value={formData.academic_level}
        onChange={handleChange}
        error={errors.academic_level}
        options={ACADEMIC_LEVELS}
        required
      />

      <FormField
        label="Stream"
        name="stream"
        type="select"
        value={formData.stream}
        onChange={handleChange}
        error={errors.stream}
        options={streamOptions}
        required
      />

      {formData.stream === 'MBA' && (
        <FormField
          label="MBA Specialization"
          name="mba_specialization"
          type="select"
          value={formData.mba_specialization}
          onChange={handleChange}
          error={errors.mba_specialization}
          options={MBA_SPECIALIZATIONS}
          required
        />
      )}

      {formData.stream === 'Others' && (
        <FormField
          label="Other Stream"
          name="stream_other"
          value={formData.stream_other}
          onChange={handleChange}
          error={errors.stream_other}
          required
        />
      )}
    </div>
  )
}

export default AcademicDetailsStep