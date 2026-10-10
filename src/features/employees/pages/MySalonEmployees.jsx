import useMySalonEmployees from "../hooks/useMySalonEmployees.js";

function MySalonEmployees() {
  const { applications, loading, handleProcessApplication } =
    useMySalonEmployees();
  if (loading) return <div className="loading">Loading applications...</div>;
  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Hiring management</span>
          <h1>Hiring Applications</h1>
          <p>Review applications submitted to your salon's hiring posts.</p>
        </div>
      </div>
      {applications.length === 0 ? (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>
            Applications will appear after candidates apply to your hiring
            posts.
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
                  Age: {application.age ?? "—"} · Experience:{" "}
                  {application.yearsOfExperience ?? 0} years
                </p>
                <p>Skills: {application.skills?.join(", ") || "—"}</p>
                <p>
                  Match: {application.matchScore ?? 0}% (
                  {application.matchLevel || "unrated"})
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
                      View resume
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
                    Accept
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() =>
                      handleProcessApplication(application.applicationId, false)
                    }
                  >
                    Reject
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
