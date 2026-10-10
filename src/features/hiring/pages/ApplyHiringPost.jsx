import { Link } from "react-router-dom";
import Loading from "../../../shared/components/Loading.jsx";
import useApplyHiringPost from "../hooks/useApplyHiringPost.js";

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
  if (loading) return <Loading />;
  return (
    <section className="auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <h1>Apply for this position</h1>
        <p className="muted">
          Your application uses the career profile saved to your account.
        </p>
        <div className="form-group">
          <label>Applicant</label>
          <input
            value={[profile?.firstName, profile?.lastName]
              .filter(Boolean)
              .join(" ")}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Skills</label>
          <input
            value={profile?.skills?.join(", ") || "No career skills saved"}
            disabled
          />
        </div>
        {!profile?.careerProfileEnabled && (
          <p className="muted">
            Your career profile is incomplete.{" "}
            <Link to="/profile/career">Complete it now</Link>.
          </p>
        )}
        <div className="form-group">
          <label>Application note</label>
          <textarea
            value={applicationNote}
            onChange={(event) => setApplicationNote(event.target.value)}
            maxLength="2000"
            rows="5"
            placeholder="Tell the salon why you are a good fit."
          />
        </div>
        <button
          className="btn btn-primary full-width"
          disabled={submitting || !profile?.careerProfileEnabled}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
        <p className="auth-switch">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigate("/hiring-posts")}
          >
            Cancel
          </button>
        </p>
      </form>
    </section>
  );
}
export default ApplyHiringPost;
