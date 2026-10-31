import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordField({
  id,
  label = "Password",
  placeholder,
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field auth-password-field">
      <div className="auth-input-wrap">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder || " "}
          {...props}
        />
        <label htmlFor={id}>{label}</label>
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          <span className="auth-password-toggle-pulse" aria-hidden="true" />
          <Eye className="auth-password-eye-open" aria-hidden="true" />
          <EyeOff className="auth-password-eye-closed" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
