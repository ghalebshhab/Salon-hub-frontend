import { Link } from "react-router-dom";
import AuthField from "../components/AuthField.jsx";
import AuthShell from "../components/AuthShell.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import useForgotPassword from "../hooks/useForgotPassword.js";

export default function ForgotPassword() {
  const { email, setEmail, loading, handleSubmit } = useForgotPassword();

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      intro="Tell us which account you need to recover. We’ll send a short-lived verification code if the email belongs to an account."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          id="recovery-email"
          name="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthSubmitButton loading={loading} loadingLabel="Sending reset instructions…">
          Continue
        </AuthSubmitButton>
      </form>
      <div className="auth-note">
        For your privacy, SalonHub shows the same response whether or not an
        account exists for this email.
      </div>
      <p className="auth-footer">
        Remembered your password?{" "}
        <Link className="auth-link" to="/login" state={{ email }}>
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
