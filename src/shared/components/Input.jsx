function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div className="form-group ui-floating-field">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || " "}
        required={required}
      />
      {label && <label htmlFor={name}>{label}</label>}
    </div>
  );
}

export default Input;
