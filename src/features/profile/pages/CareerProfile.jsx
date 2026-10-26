import Loading from "../../../shared/components/Loading.jsx";
import useCareerProfile from "../hooks/useCareerProfile.js";

function CareerProfile() {
  const { form, profile, loading, saving, handleChange, handleSubmit } =
    useCareerProfile();
  if (loading) return <Loading message="Loading your career profile…" />;
  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Career Profile</h1>
        <p className="muted">
          Hiring applications use these details. Completion:{" "}
          {profile?.careerProfileCompletionPercentage ?? 0}%.
        </p>
        <div className="form-row">
          <div className="form-group">
            <label>Date of birth</label>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Years of experience</label>
            <input
              name="yearsOfExperience"
              type="number"
              min="0"
              value={form.yearsOfExperience}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Skills, separated by commas</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Preferred work locations, separated by commas</label>
          <input
            name="preferredWorkLocations"
            value={form.preferredWorkLocations}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Resume URL</label>
          <input
            name="resumeUrl"
            type="url"
            value={form.resumeUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Portfolio URL</label>
          <input
            name="portfolioUrl"
            type="url"
            value={form.portfolioUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Professional bio</label>
          <textarea
            name="professionalBio"
            value={form.professionalBio}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>
        <button className="btn btn-primary full-width" disabled={saving}>
          {saving ? "Saving..." : "Save Career Profile"}
        </button>
      </form>
    </section>
  );
}
export default CareerProfile;
