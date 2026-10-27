import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin.js";
import AuthShell from "../components/AuthShell.jsx";
import AuthField from "../components/AuthField.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import PasswordField from "../components/PasswordField.jsx";

function Login() {
  const { form, loading, handleChange, handleSubmit } = useLogin();
  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back"
      intro="Your next appointment, your saved places, and your SalonHub community are waiting."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          id="login-email"
          name="email"
          label="Email address"
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
          label="Password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
        <div className="auth-inline">
          <span>Secure access to your account</span>
          <Link className="auth-link" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <AuthSubmitButton loading={loading} loadingLabel="Signing you in…">
          Sign in
        </AuthSubmitButton>
      </form>
      <div className="auth-note">
        Your profile keeps bookings, salon relationships, and career progress in
        one place.
      </div>
      <p className="auth-footer">
        New to SalonHub?{" "}
        <Link className="auth-link" to="/register">
          Create an account
        </Link>
        <span className="auth-footer-separator" aria-hidden="true">
          ·
        </span>
        <Link className="auth-link" to="/verify-email">
          Verify email
        </Link>
      </p>
    </AuthShell>
  );
}
export default Login;
