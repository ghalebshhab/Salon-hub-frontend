import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import AuthSubmitButton from "../components/AuthSubmitButton.jsx";
import PasswordField from "../components/PasswordField.jsx";
import useChangePassword from "../hooks/useChangePassword.js";

export default function AccountSecurity() {
  const { form, loading, handleChange, handleSubmit } = useChangePassword();

  return (
    <AuthShell
      eyebrow="Account security"
      title="Change your password"
      intro="Confirm your current password, then choose a strong replacement. Every signed-in session will be invalidated after this change."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <PasswordField
          id="current-password"
          name="currentPassword"
          label="Current password"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Enter your current password"
          autoComplete="current-password"
          required
        />
        <PasswordField
          id="security-new-password"
          name="newPassword"
          label="New password"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
        />
        <PasswordField
          id="security-confirm-password"
          name="confirmPassword"
          label="Confirm new password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your new password"
          autoComplete="new-password"
          required
        />
        <p className="auth-hint">
          Use at least eight characters with an uppercase letter, a number, and
          a special character.
        </p>
        <AuthSubmitButton loading={loading} loadingLabel="Changing your password…">
          Change password
        </AuthSubmitButton>
      </form>
      <div className="auth-note">
        Cannot remember the current password?{" "}
        <Link className="auth-link" to="/forgot-password">
          Verify your account and reset it
        </Link>
        .
      </div>
    </AuthShell>
  );
}
