import { Link } from "react-router-dom";
import { ApplyHiringSkeleton } from "../components/HiringSkeletons.jsx";
import useApplyHiringPost from "../hooks/useApplyHiringPost.js";
import t from "../../../shared/i18n/t.js";

function ApplyHiringPost() {
  const {
    navigate,
    profile,
    applicationNote,
    setApplicationNote,
    loading,
    submitting,
    handleSubmit,
  } = useApplyHiringPost();
  if (loading) return <ApplyHiringSkeleton />;
  return (
    <section className="auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <h1>{t("Apply for this position")}</h1>
        <p className="muted">
          {t("Your application uses the career profile saved to your account.")}
        </p>
        <div className="form-group">
          <label>{t("Applicant")}</label>
          <input
            value={[profile?.firstName, profile?.lastName]
              .filter(Boolean)
              .join(" ")}
            disabled
          />
        </div>
        <div className="form-group">
          <label>{t("Skills")}</label>
          <input
            value={profile?.skills?.join(", ") || t("No career skills saved")}
            disabled
          />
        </div>
        {!profile?.careerProfileEnabled && (
          <p className="muted">
            {t("Your career profile is incomplete.")}
            <Link to="/profile/career">{t("Complete it now")}</Link>.
          </p>
        )}
        <div className="form-group">
          <label>{t("Application note")}</label>
          <textarea
            value={applicationNote}
            onChange={(event) => setApplicationNote(event.target.value)}
            maxLength="2000"
            rows="5"
            placeholder={t("Tell the salon why you are a good fit.")}
          />
        </div>
        <button
          className="btn btn-primary full-width"
          disabled={submitting || !profile?.careerProfileEnabled}
        >
          {submitting ? t("Submitting...") : t("Submit Application")}
        </button>
        <p className="auth-switch">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigate("/hiring-posts")}
          >
            {t("Cancel")}
          </button>
        </p>
      </form>
    </section>
  );
}
export default ApplyHiringPost;
