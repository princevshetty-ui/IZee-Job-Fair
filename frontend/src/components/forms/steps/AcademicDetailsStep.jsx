import FormField from '../FormField'
import { STUDENT_ACADEMIC_LEVELS, getStreamsForLevel, MBA_SPECIALIZATIONS, CITIES } from '../../../utils/constants'

const CITY_OPTIONS = CITIES.map(c => ({ value: c, label: c }))

const AcademicDetailsStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'academic_level') {
      setFormData({ ...formData, academic_level: value, stream: '', mba_specialization: '', stream_other: '' })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const streamOptions = getStreamsForLevel(formData.academic_level) || []

  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-2 font-heading-art tracking-tight">Academic Details</h2>
      <p className="text-slate-400 text-sm mb-8">Please provide your academic information</p>

      <FormField
        label="Academic Level"
        name="academic_level"
        type="select"
        value={formData.academic_level}
        onChange={handleChange}
        error={errors.academic_level}
        options={STUDENT_ACADEMIC_LEVELS}
        required
      />

      {streamOptions.length > 0 && (
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
      )}

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
        label="College City"
        name="city"
        type="select"
        value={formData.city}
        onChange={handleChange}
        error={errors.city}
        options={CITY_OPTIONS}
        required
      />
    </div>
  )
}

export default AcademicDetailsStep
