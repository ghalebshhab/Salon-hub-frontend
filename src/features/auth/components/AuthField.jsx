export default function AuthField({ id, label, hint, error, ...props }) {
  return (
    <div className="auth-field" data-invalid={Boolean(error)}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...props}
      />
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
