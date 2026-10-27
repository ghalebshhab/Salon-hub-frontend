import { Link } from "react-router-dom";
import AuthField from "../components/AuthField.jsx";
import AuthShell from "../components/AuthShell.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import usePasswordResetCode from "../hooks/usePasswordResetCode.js";

export default function VerifyResetCode() {
  const { form, loading, handleChange, handleSubmit } = usePasswordResetCode();

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Check your inbox"
      intro="Enter the six-digit recovery code. After it is verified, you can choose a new password."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          id="reset-code-email"
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
          id="reset-code"
          name="code"
          label="Password reset code"
          value={form.code}
          onChange={handleChange}
          placeholder="000000"
          autoComplete="one-time-code"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          className="auth-code-input"
          hint="The code expires after 10 minutes and can only be used once."
          required
        />
        <AuthSubmitButton loading={loading} loadingLabel="Verifying your reset code…">
          Verify code
        </AuthSubmitButton>
      </form>
      <p className="auth-footer">
        Need another code?{" "}
        <Link className="auth-link" to="/forgot-password">
          Start again
        </Link>
      </p>
    </AuthShell>
  );
}
