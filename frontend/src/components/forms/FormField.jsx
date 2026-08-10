import { motion, AnimatePresence } from 'framer-motion'

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options = [],
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: '#8d7f76' }}>
        {label}{required && <span className="ml-1" style={{ color: '#d0b070' }}>*</span>}
      </label>

      {type === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className="lp2-form-select"
          {...props}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name={name}
            checked={!!value}
            onChange={onChange}
            className="lp2-form-checkbox mt-0.5"
            {...props}
          />
          {label && (
            <label className="text-sm leading-relaxed cursor-pointer select-none" style={{ color: '#c9bfb5' }}>
              {label}
            </label>
          )}
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="lp2-form-input"
          {...props}
        />
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs mt-1.5 flex items-center gap-1.5"
            style={{ color: '#a11f26' }}
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FormField
