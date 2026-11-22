import CareerProfileSkeleton from "../components/CareerProfileSkeleton.jsx";
import useCareerProfile from "../hooks/useCareerProfile.js";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function CareerProfile() {
  const { form, profile, loading, saving, handleChange, handleSubmit } =
    useCareerProfile();
  if (loading) return <CareerProfileSkeleton />;
  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>{t(PAGE_HEADS.careerProfile.title)}</h1>
        <p className="muted">
          {t(PAGE_HEADS.careerProfile.text)}
          {profile?.careerProfileCompletionPercentage ?? 0}%.
        </p>
        <div className="form-row">
          <div className="form-group">
            <label>{t("Date of birth")}</label>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("Years of experience")}</label>
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
          <label>{t("Skills, separated by commas")}</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("Preferred work locations, separated by commas")}</label>
          <input
            name="preferredWorkLocations"
            value={form.preferredWorkLocations}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("Resume URL")}</label>
          <input
            name="resumeUrl"
            type="url"
            value={form.resumeUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("Portfolio URL")}</label>
          <input
            name="portfolioUrl"
            type="url"
            value={form.portfolioUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("Professional bio")}</label>
          <textarea
            name="professionalBio"
            value={form.professionalBio}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>
        <button className="btn btn-primary full-width" disabled={saving}>
          {saving ? t("Saving...") : t("Save Career Profile")}
        </button>
      </form>
    </section>
  );
}
export default CareerProfile;
