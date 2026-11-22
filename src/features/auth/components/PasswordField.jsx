import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import t from "../../../shared/i18n/t.js";

export default function PasswordField({
  id,
  label = t("Password"),
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
        <label htmlFor={id}>{t(label)}</label>
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? t("Hide password") : t("Show password")}
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
