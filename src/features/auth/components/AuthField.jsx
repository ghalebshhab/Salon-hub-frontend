export default function AuthField({
  id,
  label,
  hint,
  error,
  placeholder,
  ...props
}) {
  return (
    <div className="auth-field" data-invalid={Boolean(error)}>
      <div className="auth-input-wrap">
        <input
          id={id}
          placeholder={placeholder || " "}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          {...props}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="auth-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="auth-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
