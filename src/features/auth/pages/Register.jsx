import { Link } from "react-router-dom";
import useRegister from "../hooks/useRegister.js";
import AuthShell from "../components/AuthShell.jsx";
import { AuthField, AuthSubmitButton, PasswordField } from "../components/AuthFields.jsx";

function Register() {
  const { form, loading, handleChange, handleSubmit } = useRegister();
  return (
    <AuthShell eyebrow="Join the community" title="Make room for what’s next" intro="Create one SalonHub account to book great services, manage a salon, or grow your career.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form-row">
          <AuthField id="register-first-name" name="firstName" label="First name" value={form.firstName} onChange={handleChange} placeholder="Ahmad" autoComplete="given-name" />
          <AuthField id="register-last-name" name="lastName" label="Last name" value={form.lastName} onChange={handleChange} placeholder="Ali" autoComplete="family-name" />
        </div>
        <AuthField id="register-username" name="userName" label="Username" value={form.userName} onChange={handleChange} placeholder="ahmadali" autoComplete="username" required />
        <div className="auth-form-row">
          <AuthField id="register-email" name="email" label="Email address" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
          <AuthField id="register-phone" name="phoneNumber" label="Phone number" type="tel" value={form.phoneNumber} onChange={handleChange} placeholder="+962…" autoComplete="tel" required />
        </div>
        <PasswordField id="register-password" name="password" label="Password" value={form.password} onChange={handleChange} placeholder="Create a strong password" autoComplete="new-password" required />
        <p className="auth-hint">Use the password rules required by your SalonHub account.</p>
        <AuthSubmitButton loading={loading}>Create account</AuthSubmitButton>
      </form>
      <div className="auth-note">Your normal user profile is created automatically. You can upgrade to a career profile later—no career fields are needed here.</div>
      <p className="auth-footer">Already have an account? <Link className="auth-link" to="/login">Sign in</Link></p>
    </AuthShell>
  );
}
export default Register;
