import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordField({ id, label = "Password", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input id={id} type={visible ? "text" : "password"} {...props} />
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
