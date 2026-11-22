import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import PasswordField from "../components/PasswordField.jsx";
import useChangePassword from "../hooks/useChangePassword.js";
import t from "../../../shared/i18n/t.js";
import { AUTH_COPY } from "../model/authCopy.js";

const COPY = AUTH_COPY.accountSecurity;

export default function AccountSecurity() {
  const { form, loading, handleChange, handleSubmit } = useChangePassword();

  return (
    <AuthShell
      eyebrow={t(COPY.eyebrow)}
      title={t(COPY.title)}
      intro={t(COPY.intro)}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <PasswordField
          id="current-password"
          name="currentPassword"
          label={t("Current password")}
          value={form.currentPassword}
          onChange={handleChange}
          placeholder={t("Enter your current password")}
          autoComplete="current-password"
          required
        />
        <PasswordField
          id="security-new-password"
          name="newPassword"
          label={t("New password")}
          value={form.newPassword}
          onChange={handleChange}
          placeholder={t("Create a strong password")}
          autoComplete="new-password"
          required
        />
        <PasswordField
          id="security-confirm-password"
          name="confirmPassword"
          label={t("Confirm new password")}
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder={t("Repeat your new password")}
          autoComplete="new-password"
          required
        />
        <p className="auth-hint">{t(COPY.hint[0])}</p>
        <AuthSubmitButton
          loading={loading}
          loadingLabel={t("Changing your password…")}
        >
          {t("Change password")}
        </AuthSubmitButton>
      </form>
      <div className="auth-note">
        {t(COPY.note[0])}
        <Link className="auth-link" to="/forgot-password">
          {t(COPY.note[1])}
        </Link>
        .
      </div>
    </AuthShell>
  );
}
