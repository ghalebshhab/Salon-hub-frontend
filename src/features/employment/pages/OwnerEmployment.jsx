import {
  CheckCircle2,
  FileText,
  Search,
  Send,
  UserRoundSearch,
  XCircle,
} from "lucide-react";
import EmptyState from "../../../shared/components/EmptyState.jsx";
import Loading from "../../../shared/components/Loading.jsx";
import EmploymentRequestCard from "../components/EmploymentRequestCard.jsx";
import LeaveRequestCard from "../components/LeaveRequestCard.jsx";
import useOwnerEmployment from "../hooks/useOwnerEmployment.js";

export default function OwnerEmployment() {
  const employment = useOwnerEmployment();
  if (employment.loading) return <Loading message="Loading employment workflows…" />;

  const joinRequests = employment.requests.filter(
    (request) => request.requestType === "User_Request",
  );
  const invitations = employment.requests.filter(
    (request) => request.requestType === "Owner_Invite",
  );

  return (
    <section className="container section employment-page">
      <header className="employment-hero">
        <div>
          <span className="eyebrow">Owner workspace</span>
          <h1>Employment and invitations</h1>
          <p>
            Discover career-ready candidates, invite them to your salon, decide
            join requests, and release employees through one traceable workflow.
          </p>
        </div>
        <div className="employment-summary-grid">
          <span><strong>{joinRequests.filter((item) => item.status === "Requested").length}</strong> pending joins</span>
          <span><strong>{invitations.filter((item) => item.status === "Requested").length}</strong> open invitations</span>
          <span><strong>{employment.leaveRequests.filter((item) => item.status === "Requested").length}</strong> leave decisions</span>
        </div>
      </header>

      <section className="employment-section">
        <div className="employment-section-heading">
          <div>
            <span className="eyebrow">Candidate discovery</span>
            <h2>Invite a professional</h2>
          </div>
          <form className="employment-search" onSubmit={employment.submitSearch}>
            <Search size={18} />
            <input
              value={employment.searchInput}
              onChange={(event) => employment.setSearchInput(event.target.value)}
              placeholder="Search by name, username, skill, or location"
              maxLength={100}
            />
            <button className="btn btn-secondary btn-small" type="submit">
              Search
            </button>
          </form>
        </div>
        {employment.candidates.length === 0 ? (
          <EmptyState
            title="No matching career profiles"
            message="Try another name or skill. Only active career profiles can be invited."
          />
        ) : (
          <div className="candidate-directory-grid">
            {employment.candidates.map((candidate) => {
              const pendingInvitation = invitations.some(
                (request) =>
                  Number(request.receiverId) === Number(candidate.userId) &&
                  request.status === "Requested",
              );
              return (
                <article className="candidate-directory-card" key={candidate.userId}>
                  <div className="candidate-directory-heading">
                    <span className="candidate-directory-avatar">
                      <UserRoundSearch size={23} />
                    </span>
                    <div>
                      <h3>{candidate.fullName}</h3>
                      <p>@{candidate.userName}</p>
                    </div>
                  </div>
                  <p className="candidate-directory-bio">
                    {candidate.professionalBio || "No professional biography added."}
                  </p>
                  <div className="candidate-directory-skills">
                    {(candidate.skills || []).slice(0, 5).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                  <div className="candidate-directory-meta">
                    <span>{candidate.yearsOfExperience ?? 0} years experience</span>
                    <span>
                      {candidate.currentSalonName
                        ? `Currently at ${candidate.currentSalonName}`
                        : "Available to join"}
                    </span>
                  </div>
                  <div className="employment-card-actions">
                    {candidate.resumeUrl && (
                      <a
                        className="btn btn-secondary btn-small"
                        href={candidate.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FileText size={16} /> Résumé
                      </a>
                    )}
                    <button
                      className="btn btn-primary btn-small"
                      type="button"
                      disabled={employment.acting || pendingInvitation}
                      onClick={() => employment.inviteCandidate(candidate.userId)}
                    >
                      <Send size={16} />
                      {pendingInvitation ? "Invitation pending" : "Invite"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="employment-section">
        <div className="employment-section-heading">
          <div><span className="eyebrow">Incoming</span><h2>Join requests</h2></div>
        </div>
        {joinRequests.length === 0 ? (
          <EmptyState title="No join requests" message="Direct requests from users will appear here." />
        ) : (
          <div className="employment-grid">
            {joinRequests.map((request) => (
              <EmploymentRequestCard
                perspective="owner"
                request={request}
                key={request.requestId}
                actions={request.status === "Requested" && (
                  <>
                    <button className="btn btn-primary btn-small" type="button" disabled={employment.acting} onClick={() => employment.acceptRequest(request.requestId)}>
                      <CheckCircle2 size={16} /> Accept
                    </button>
                    <button className="btn btn-secondary btn-small" type="button" disabled={employment.acting} onClick={() => employment.setRejection({ requestId: request.requestId, reason: "" })}>
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
              />
            ))}
          </div>
        )}
      </section>

      {employment.rejection.requestId && (
        <section className="employment-decision-panel">
          <div><span className="eyebrow">Owner decision</span><h2>Explain the rejection</h2></div>
          <textarea rows="3" value={employment.rejection.reason} onChange={(event) => employment.setRejection((current) => ({ ...current, reason: event.target.value }))} placeholder="Reason shown to the applicant" />
          <div className="employment-card-actions">
            <button className="btn btn-primary" type="button" disabled={employment.acting} onClick={employment.submitRejection}>Send rejection</button>
            <button className="btn btn-secondary" type="button" disabled={employment.acting} onClick={() => employment.setRejection({ requestId: null, reason: "" })}>Cancel</button>
          </div>
        </section>
      )}

      <section className="employment-section">
        <div className="employment-section-heading"><div><span className="eyebrow">Outgoing</span><h2>Invitation history</h2></div></div>
        {invitations.length === 0 ? (
          <EmptyState title="No invitations sent" message="Invite a career-ready candidate from the directory above." />
        ) : (
          <div className="employment-grid">
            {invitations.map((request) => (
              <EmploymentRequestCard
                perspective="owner"
                request={request}
                key={request.requestId}
                actions={request.status === "Requested" && (
                  <button className="btn btn-secondary btn-small" type="button" disabled={employment.acting} onClick={() => employment.cancelInvitation(request.requestId)}>Cancel invitation</button>
                )}
              />
            ))}
          </div>
        )}
      </section>

      <section className="employment-section">
        <div className="employment-section-heading"><div><span className="eyebrow">Employee rights</span><h2>Leave requests</h2></div></div>
        <p className="employment-policy-note">Employees cannot be forced to remain. Owners confirm the release so schedules, service capabilities, employee counts, and any approved transfer update atomically.</p>
        {employment.leaveRequests.length === 0 ? (
          <EmptyState title="No leave requests" message="Employee leave and transfer approvals will appear here." />
        ) : (
          <div className="employment-grid">
            {employment.leaveRequests.map((request) => (
              <LeaveRequestCard
                request={request}
                key={request.requestId}
                actions={request.status === "Requested" && (
                  <button className="btn btn-primary btn-small" type="button" disabled={employment.acting} onClick={() => employment.acceptLeave(request.requestId)}>
                    <CheckCircle2 size={16} /> Confirm release
                  </button>
                )}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
