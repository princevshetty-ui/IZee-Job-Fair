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
      <label className="block text-slate-300 text-sm font-medium mb-2 tracking-wide">
        {label} {required && <span className="text-cyan-400">*</span>}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className="form-select"
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
            className="form-checkbox mt-0.5"
            {...props}
          />
          {label && (
            <label className="text-slate-300 text-sm leading-relaxed cursor-pointer select-none">
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
          className="form-input"
          {...props}
        />
      )}
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  )
}

export default FormField