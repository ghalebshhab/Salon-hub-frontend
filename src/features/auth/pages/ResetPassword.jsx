import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import PasswordField from "../components/PasswordField.jsx";
import useResetPassword from "../hooks/useResetPassword.js";
import t from "../../../shared/i18n/t.js";
import { AUTH_COPY } from "../model/authCopy.js";

const COPY = AUTH_COPY.resetPassword;

export default function ResetPassword() {
  const { form, loading, hasResetAuthorization, handleChange, handleSubmit } =
    useResetPassword();

  return (
    <AuthShell
      eyebrow={t(COPY.eyebrow)}
      title={t(COPY.title)}
      intro={t(COPY.intro)}
    >
      {!hasResetAuthorization && (
        <div className="auth-flow-status" role="alert">
          {t(COPY.status[0])}
          <Link className="auth-link" to="/forgot-password">
            {t(COPY.status[1])}
          </Link>
        </div>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <PasswordField
          id="new-password"
          name="newPassword"
          label={t("New password")}
          value={form.newPassword}
          onChange={handleChange}
          placeholder={t("Create a strong password")}
          autoComplete="new-password"
          required
        />
        <PasswordField
          id="confirm-new-password"
          name="confirmPassword"
          label={t("Confirm new password")}
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder={t("Repeat your new password")}
          autoComplete="new-password"
          required
        />
        <AuthSubmitButton
          loading={loading}
          loadingLabel={t("Securing your new password…")}
          disabled={!hasResetAuthorization}
        >
          {t("Save new password")}
        </AuthSubmitButton>
      </form>
      <p className="auth-footer">
        <Link className="auth-link" to="/login">
          {t(COPY.footer[0])}
        </Link>
      </p>
    </AuthShell>
  );
}
