import useMySalonEmployees from "../hooks/useMySalonEmployees.js";
import t from "../../../shared/i18n/t.js";
import { ApplicationsReviewSkeleton } from "../components/EmployeesPageSkeletons.jsx";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function MySalonEmployees() {
  const { applications, loading, handleProcessApplication } =
    useMySalonEmployees();
  if (loading) return <ApplicationsReviewSkeleton />;
  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">
            {t(PAGE_HEADS.hiringApplications.eyebrow)}
          </span>
          <h1>{t(PAGE_HEADS.hiringApplications.title)}</h1>
          <p>{t(PAGE_HEADS.hiringApplications.text)}</p>
        </div>
      </div>
      {applications.length === 0 ? (
        <div className="empty-state">
          <h3>{t("No applications yet")}</h3>
          <p>
            {t(
              "Applications will appear after candidates apply to your hiring posts.",
            )}
          </p>
        </div>
      ) : (
        <div className="owner-employees-grid">
          {applications.map((application) => (
            <article
              className="owner-employee-card"
              key={application.applicationId}
            >
              <div className="owner-employee-top">
                <div>
                  <h3>{application.applicantName}</h3>
                  <p>{application.hiringPostTitle}</p>
                </div>
                <span
                  className={`employee-status-pill status-${application.status?.toLowerCase()}`}
                >
                  {application.status}
                </span>
              </div>
              <div className="owner-employee-info">
                <p>{application.applicantEmail}</p>
                <p>{application.applicantPhoneNumber}</p>
                <p>
                  {t("Age:")} {application.age ?? "—"} {t("· Experience:")}
                  {application.yearsOfExperience ?? 0} {t("years")}
                </p>
                <p>
                  {t("Skills:")} {application.skills?.join(", ") || "—"}
                </p>
                <p>
                  {t("Match:")} {application.matchScore ?? 0}% (
                  {application.matchLevel || t("unrated")})
                </p>
                {application.applicationNote && (
                  <p>{application.applicationNote}</p>
                )}
                {application.resumeUrl && (
                  <p>
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("View resume")}
                    </a>
                  </p>
                )}
              </div>
              {application.status === "Requested" && (
                <div className="service-actions">
                  <button
                    className="btn btn-success btn-small"
                    onClick={() =>
                      handleProcessApplication(application.applicationId, true)
                    }
                  >
                    {t("Accept")}
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() =>
                      handleProcessApplication(application.applicationId, false)
                    }
                  >
                    {t("Reject")}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
export default MySalonEmployees;
