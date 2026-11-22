import { Link } from "react-router-dom";
import AuthField from "../components/AuthField.jsx";
import AuthShell from "../components/AuthShell.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import useForgotPassword from "../hooks/useForgotPassword.js";
import t from "../../../shared/i18n/t.js";
import { AUTH_COPY } from "../model/authCopy.js";

const COPY = AUTH_COPY.forgotPassword;

export default function ForgotPassword() {
  const { email, setEmail, loading, handleSubmit } = useForgotPassword();

  return (
    <AuthShell
      eyebrow={t(COPY.eyebrow)}
      title={t(COPY.title)}
      intro={t(COPY.intro)}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          id="recovery-email"
          name="email"
          label={t("Email address")}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthSubmitButton
          loading={loading}
          loadingLabel={t("Sending reset instructions…")}
        >
          {t("Continue")}
        </AuthSubmitButton>
      </form>
      <div className="auth-note">{t(COPY.note[0])}</div>
      <p className="auth-footer">
        {t(COPY.footer[0])}
        <Link className="auth-link" to="/login" state={{ email }}>
          {t(COPY.footer[1])}
        </Link>
      </p>
    </AuthShell>
  );
}
