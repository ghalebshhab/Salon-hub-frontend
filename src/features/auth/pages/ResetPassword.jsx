import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import PasswordField from "../components/PasswordField.jsx";
import useResetPassword from "../hooks/useResetPassword.js";

export default function ResetPassword() {
  const {
    form,
    loading,
    hasResetAuthorization,
    handleChange,
    handleSubmit,
  } = useResetPassword();

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password"
      intro="Use a strong password you have not used before. Your existing signed-in sessions will no longer be valid."
    >
      {!hasResetAuthorization && (
        <div className="auth-flow-status" role="alert">
          Verify a current password reset code before choosing a new password.
          <Link className="auth-link" to="/forgot-password">
            Request a code
          </Link>
        </div>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <PasswordField
          id="new-password"
          name="newPassword"
          label="New password"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
        />
        <PasswordField
          id="confirm-new-password"
          name="confirmPassword"
          label="Confirm new password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your new password"
          autoComplete="new-password"
          required
        />
        <AuthSubmitButton
          loading={loading}
          loadingLabel="Securing your new password…"
          disabled={!hasResetAuthorization}
        >
          Save new password
        </AuthSubmitButton>
      </form>
      <p className="auth-footer">
        <Link className="auth-link" to="/login">
          Return to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
