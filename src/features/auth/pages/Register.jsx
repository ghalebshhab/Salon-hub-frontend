import { Link } from "react-router-dom";
import useRegister from "../hooks/useRegister.js";
import AuthShell from "../components/AuthShell.jsx";
import AuthField from "../components/AuthField.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import PasswordField from "../components/PasswordField.jsx";
import t from "../../../shared/i18n/t.js";
import { AUTH_COPY } from "../model/authCopy.js";

const COPY = AUTH_COPY.register;

function Register() {
  const { form, loading, handleChange, handleSubmit } = useRegister();
  return (
    <AuthShell
      eyebrow={t(COPY.eyebrow)}
      title={t(COPY.title)}
      intro={t(COPY.intro)}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-row">
          <AuthField
            id="register-first-name"
            name="firstName"
            label={t("First name")}
            value={form.firstName}
            onChange={handleChange}
            placeholder={t("Ahmad")}
            autoComplete="given-name"
          />
          <AuthField
            id="register-last-name"
            name="lastName"
            label={t("Last name")}
            value={form.lastName}
            onChange={handleChange}
            placeholder={t("Ali")}
            autoComplete="family-name"
          />
        </div>
        <AuthField
          id="register-username"
          name="userName"
          label={t("Username")}
          value={form.userName}
          onChange={handleChange}
          placeholder={t("ahmadali")}
          autoComplete="username"
          required
        />
        <div className="auth-form-row">
          <AuthField
            id="register-email"
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
            id="register-phone"
            name="phoneNumber"
            label={t("Phone number")}
            type="tel"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="+962…"
            autoComplete="tel"
            required
          />
        </div>
        <PasswordField
          id="register-password"
          name="password"
          label={t("Password")}
          value={form.password}
          onChange={handleChange}
          placeholder={t("Create a strong password")}
          autoComplete="new-password"
          required
        />
        <p className="auth-hint">{t(COPY.hint[0])}</p>
        <AuthSubmitButton
          loading={loading}
          loadingLabel={t("Creating your account…")}
        >
          {t("Create account")}
        </AuthSubmitButton>
      </form>
      <div className="auth-note">{t(COPY.note[0])}</div>
      <p className="auth-footer">
        {t(COPY.footer[0])}
        <Link className="auth-link" to="/login">
          {t(COPY.footer[1])}
        </Link>
      </p>
    </AuthShell>
  );
}
export default Register;
