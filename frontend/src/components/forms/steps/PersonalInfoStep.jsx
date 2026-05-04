import { motion, AnimatePresence } from 'framer-motion'
import FormField from '../FormField'
import { ATTENDEE_TYPES, CITIES } from '../../../utils/constants'

const CITY_OPTIONS = CITIES.map(c => ({ value: c, label: c }))

const PersonalInfoStep = ({ formData, setFormData, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-2 font-heading-art tracking-tight">Personal Information</h2>
      <p className="text-slate-400 text-sm mb-8">Please fill in your personal details to get started</p>

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
        label="City"
        name="city"
        type="select"
        value={formData.city}
        onChange={handleChange}
        error={errors.city}
        options={CITY_OPTIONS}
        required
      />

      <AnimatePresence>
        {formData.city === 'Others' && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <FormField
              label="Enter Your City"
              name="city_other"
              value={formData.city_other}
              onChange={handleChange}
              error={errors.city_other}
              placeholder="Type your city name"
              required
            />
          </motion.div>
        )}
      </AnimatePresence>

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
