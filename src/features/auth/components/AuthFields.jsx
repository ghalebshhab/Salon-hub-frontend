import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AuthField({ id, label, hint, error, ...props }) {
  return (
    <div className="auth-field" data-invalid={Boolean(error)}>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...props} />
      {hint && <p id={`${id}-hint`} className="auth-hint">{hint}</p>}
      {error && <p id={`${id}-error`} className="auth-error" role="alert">{error}</p>}
    </div>
  );
}

export function PasswordField({ id, label = "Password", ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input id={id} type={visible ? "text" : "password"} {...props} />
        <button type="button" className="auth-password-toggle" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

export function AuthSubmitButton({ loading, children }) {
  return <button className="btn btn-primary full-width auth-submit" disabled={loading}>{loading ? "Please wait…" : children}</button>;
}
