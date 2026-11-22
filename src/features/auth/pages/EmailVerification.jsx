import { Link } from "react-router-dom";
import AuthField from "../components/AuthField.jsx";
import AuthShell from "../components/AuthShell.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import useEmailVerification from "../hooks/useEmailVerification.js";
import t from "../../../shared/i18n/t.js";
import { AUTH_COPY } from "../model/authCopy.js";

const COPY = AUTH_COPY.verifyEmail;

export default function EmailVerification() {
  const {
    form,
    loading,
    resending,
    cooldown,
    handleChange,
    handleSubmit,
    resend,
  } = useEmailVerification();

  return (
    <AuthShell
      eyebrow={t(COPY.eyebrow)}
      title={t(COPY.title)}
      intro={t(COPY.intro)}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          id="verification-email"
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
          id="verification-code"
          name="code"
          label={t("Verification code")}
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
          loadingLabel={t("Verifying your email…")}
        >
          {t("Verify email")}
        </AuthSubmitButton>
        <button
          className="auth-secondary-action"
          type="button"
          onClick={resend}
          disabled={resending || cooldown > 0 || !form.email.trim()}
        >
          {resending
            ? t("Sending a new code…")
            : cooldown > 0
              ? t("Send a new code in {cooldown}s", { cooldown })
              : t("Send a new verification code")}
        </button>
      </form>
      <p className="auth-footer">
        {t(COPY.footer[0])}
        <Link className="auth-link" to="/login" state={{ email: form.email }}>
          {t(COPY.footer[1])}
        </Link>
      </p>
    </AuthShell>
  );
}
