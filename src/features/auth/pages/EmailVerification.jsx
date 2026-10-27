import { Link } from "react-router-dom";
import AuthField from "../components/AuthField.jsx";
import AuthShell from "../components/AuthShell.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import useEmailVerification from "../hooks/useEmailVerification.js";

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
      eyebrow="Secure your account"
      title="Verify your email"
      intro="Enter the six-digit code sent to your email. This keeps your account and salon activity protected."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          id="verification-email"
          name="email"
          label="Email address"
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
          label="Verification code"
          value={form.code}
          onChange={handleChange}
          placeholder="000000"
          autoComplete="one-time-code"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          className="auth-code-input"
          hint="The code contains exactly six digits and expires after 10 minutes."
          required
        />
        <AuthSubmitButton loading={loading} loadingLabel="Verifying your email…">
          Verify email
        </AuthSubmitButton>
        <button
          className="auth-secondary-action"
          type="button"
          onClick={resend}
          disabled={resending || cooldown > 0 || !form.email.trim()}
        >
          {resending
            ? "Sending a new code…"
            : cooldown > 0
              ? `Send a new code in ${cooldown}s`
              : "Send a new verification code"}
        </button>
      </form>
      <p className="auth-footer">
        Already verified?{" "}
        <Link className="auth-link" to="/login" state={{ email: form.email }}>
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
