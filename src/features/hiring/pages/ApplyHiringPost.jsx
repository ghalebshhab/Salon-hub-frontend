import useApplyHiringPost from "../hooks/useApplyHiringPost.js";

import Loading from "../../../shared/components/Loading.jsx";

function ApplyHiringPost() {
  const { navigate, form, loading, submitting, handleChange, handleSubmit } =
    useApplyHiringPost();

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <h1>Join Salon Application</h1>
        <p className="muted">
          Please fill out or update your details below to submit your join
          request.
        </p>

        <div className="form-group">
          <label>Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="+96279XXXXXXXX or 07XXXXXXXX"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age</label>
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="25"
              min="18"
              required
            />
          </div>

          <div className="form-group">
            <label>Experience Years</label>
            <input
              name="experienceYears"
              type="number"
              value={form.experienceYears}
              onChange={handleChange}
              placeholder="3"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>CV Link or Professional Description</label>
          <textarea
            name="cv"
            value={form.cv}
            onChange={handleChange}
            placeholder="Provide a link to your Google Drive CV, LinkedIn profile, or a short summary of your work history."
            rows="3"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
              backgroundColor: "var(--input-bg)",
              color: "var(--foreground)",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        <button
          className="btn btn-primary full-width"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>

        <p className="auth-switch">
          Changed your mind?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/hiring-posts");
            }}
          >
            Cancel
          </a>
        </p>
      </form>
    </section>
  );
}

export default ApplyHiringPost;
