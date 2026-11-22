import { Link } from "react-router-dom";
import AuthField from "../components/AuthField.jsx";
import AuthShell from "../components/AuthShell.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import usePasswordResetCode from "../hooks/usePasswordResetCode.js";
import t from "../../../shared/i18n/t.js";
import { AUTH_COPY } from "../model/authCopy.js";

const COPY = AUTH_COPY.verifyResetCode;

export default function VerifyResetCode() {
  const { form, loading, handleChange, handleSubmit } = usePasswordResetCode();

  return (
    <AuthShell
      eyebrow={t(COPY.eyebrow)}
      title={t(COPY.title)}
      intro={t(COPY.intro)}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          id="reset-code-email"
          name="email"
          label={t("Email address")}
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthField
          id="reset-code"
          name="code"
          label={t("Password reset code")}
          value={form.code}
          onChange={handleChange}
          placeholder="000000"
          autoComplete="one-time-code"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          className="auth-code-input"
          hint={t(COPY.codeHint)}
          required
        />
        <AuthSubmitButton
          loading={loading}
          loadingLabel={t("Verifying your reset code…")}
        >
          {t("Verify code")}
        </AuthSubmitButton>
      </form>
      <p className="auth-footer">
        {t(COPY.footer[0])}
        <Link className="auth-link" to="/forgot-password">
          {t(COPY.footer[1])}
        </Link>
      </p>
    </AuthShell>
  );
}
