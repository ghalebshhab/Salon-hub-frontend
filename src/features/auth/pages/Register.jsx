import useRegister from "../hooks/useRegister.js";

import { Link } from "react-router-dom";

function Register() {
  const { form, loading, handleChange, handleSubmit } = useRegister();

  return (
    <section className="auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p className="muted">Join SalonHub as an owner, barber, or customer.</p>

        <div className="form-row">
          <div className="form-group">
            <label>First name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Ahmad"
            />
          </div>

          <div className="form-group">
            <label>Last name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Ali"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="ahmadali"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="owner@gmail.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone number</label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="+962791234567"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Xxxxxx1@"
            required
          />
        </div>

        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="auth-switch">
          Already have account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
