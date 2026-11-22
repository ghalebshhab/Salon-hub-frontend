import useCreateHiringPost from "../hooks/useCreateHiringPost.js";
import t from "../../../shared/i18n/t.js";

function CreateHiringPost() {
  const { form, loading, handleChange, handleSubmit } = useCreateHiringPost();
  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>{t("Create Hiring Post")}</h1>
        <p className="muted">
          {t("Publish an opening for your approved salon.")}
        </p>
        <div className="form-group">
          <label>{t("Title")}</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("Description")}</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>
        <div className="form-group">
          <label>{t("Required skills, separated by commas")}</label>
          <input
            name="requiredSkills"
            value={form.requiredSkills}
            onChange={handleChange}
            placeholder={t("Hair styling, Coloring")}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t("Minimum age")}</label>
            <input
              name="minimumAge"
              type="number"
              min="18"
              value={form.minimumAge}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("Maximum age")}</label>
            <input
              name="maximumAge"
              type="number"
              min={form.minimumAge}
              value={form.maximumAge}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t("Employee location")}</label>
            <input
              name="employeeLocation"
              value={form.employeeLocation}
              onChange={handleChange}
              placeholder={t("Amman")}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("Minimum experience (years)")}</label>
            <input
              name="minimumYearsOfExperience"
              type="number"
              min="0"
              value={form.minimumYearsOfExperience}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t("Positions")}</label>
            <input
              name="numOfPositions"
              type="number"
              min="1"
              value={form.numOfPositions}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("Application deadline")}</label>
            <input
              name="expiresAt"
              type="datetime-local"
              value={form.expiresAt}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? t("Posting...") : t("Create Hiring Post")}
        </button>
      </form>
    </section>
  );
}
export default CreateHiringPost;
