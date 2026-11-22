import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin.js";
import AuthShell from "../components/AuthShell.jsx";
import AuthField from "../components/AuthField.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import PasswordField from "../components/PasswordField.jsx";
import t from "../../../shared/i18n/t.js";
import { AUTH_COPY } from "../model/authCopy.js";

const COPY = AUTH_COPY.login;

function Login() {
  const { form, loading, handleChange, handleSubmit } = useLogin();
  return (
    <AuthShell
      eyebrow={t(COPY.eyebrow)}
      title={t(COPY.title)}
      intro={t(COPY.intro)}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          id="login-email"
          name="email"
          label={t("Email address")}
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <PasswordField
          id="login-password"
          name="password"
          label={t("Password")}
          value={form.password}
          onChange={handleChange}
          placeholder={t("Enter your password")}
          autoComplete="current-password"
          required
        />
        <div className="auth-inline">
          <span>{t(COPY.inline[0])}</span>
          <Link className="auth-link" to="/forgot-password">
            {t(COPY.inline[1])}
          </Link>
        </div>
        <AuthSubmitButton loading={loading} loadingLabel={t("Signing you in…")}>
          {t("Sign in")}
        </AuthSubmitButton>
      </form>
      <div className="auth-note">{t(COPY.note[0])}</div>
      <p className="auth-footer">
        {t(COPY.footer[0])}
        <Link className="auth-link" to="/register">
          {t(COPY.footer[1])}
        </Link>
        <span className="auth-footer-separator" aria-hidden="true">
          ·
        </span>
        <Link className="auth-link" to="/verify-email">
          {t(COPY.footer[2])}
        </Link>
      </p>
    </AuthShell>
  );
}
export default Login;
