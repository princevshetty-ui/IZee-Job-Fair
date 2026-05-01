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
      <label className="block text-gray-300 text-sm font-bold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full glass text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...props}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full glass text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...props}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default FormField