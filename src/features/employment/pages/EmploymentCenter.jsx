import { BriefcaseBusiness, LogOut, RefreshCw, XCircle } from "lucide-react";
import EmptyState from "../../../shared/components/EmptyState.jsx";
import Loading from "../../../shared/components/Loading.jsx";
import EmploymentRequestCard from "../components/EmploymentRequestCard.jsx";
import LeaveRequestCard from "../components/LeaveRequestCard.jsx";
import useEmploymentCenter from "../hooks/useEmploymentCenter.js";

export default function EmploymentCenter() {
  const employment = useEmploymentCenter();
  if (employment.loading) return <Loading message="Loading your employment center…" />;

  return (
    <section className="container section employment-page">
      <header className="employment-hero">
        <div>
          <span className="eyebrow">Career relationships</span>
          <h1>Employment center</h1>
          <p>
            Review salon invitations, follow your join requests, and manage a
            leave or transfer without losing the request history.
          </p>
        </div>
        <div className="employment-summary-card">
          <BriefcaseBusiness size={24} />
          <strong>{employment.requests.length}</strong>
          <span>employment records</span>
        </div>
      </header>

      <section className="employment-section">
        <div className="employment-section-heading">
          <div>
            <span className="eyebrow">Invitations and requests</span>
            <h2>Your salon opportunities</h2>
          </div>
        </div>
        {employment.requests.length === 0 ? (
          <EmptyState
            title="No employment requests yet"
            message="Join requests and salon invitations will remain available here."
          />
        ) : (
          <div className="employment-grid">
            {employment.requests.map((request) => {
              const incoming =
                Number(request.receiverId) === Number(employment.currentUserId);
              const canDecide =
                incoming &&
                request.requestType === "Owner_Invite" &&
                request.status === "Requested";
              const canCancel =
                !incoming &&
                request.requestType === "User_Request" &&
                request.status === "Requested";
              return (
                <EmploymentRequestCard
                  request={request}
                  key={request.requestId}
                  actions={
                    (canDecide || canCancel) && (
                      <>
                        {canDecide && (
                          <>
                            <button
                              className="btn btn-primary btn-small"
                              type="button"
                              disabled={employment.acting}
                              onClick={() => employment.acceptRequest(request.requestId)}
                            >
                              Accept invitation
                            </button>
                            <button
                              className="btn btn-secondary btn-small"
                              type="button"
                              disabled={employment.acting}
                              onClick={() =>
                                employment.setRejection({
                                  requestId: request.requestId,
                                  reason: "",
                                })
                              }
                            >
                              <XCircle size={16} /> Reject
                            </button>
                          </>
                        )}
                        {canCancel && (
                          <button
                            className="btn btn-secondary btn-small"
                            type="button"
                            disabled={employment.acting}
                            onClick={() => employment.cancelRequest(request.requestId)}
                          >
                            Cancel request
                          </button>
                        )}
                      </>
                    )
                  }
                />
              );
            })}
          </div>
        )}
      </section>

      {employment.rejection.requestId && (
        <section className="employment-decision-panel">
          <div>
            <span className="eyebrow">Reject invitation</span>
            <h2>Tell the salon why you declined</h2>
          </div>
          <textarea
            rows="3"
            value={employment.rejection.reason}
            onChange={(event) =>
              employment.setRejection((current) => ({
                ...current,
                reason: event.target.value,
              }))
            }
            placeholder="Add a clear reason"
          />
          <div className="employment-card-actions">
            <button
              className="btn btn-primary"
              type="button"
              disabled={employment.acting}
              onClick={employment.submitRejection}
            >
              Confirm rejection
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              disabled={employment.acting}
              onClick={() =>
                employment.setRejection({ requestId: null, reason: "" })
              }
            >
              Keep invitation
            </button>
          </div>
        </section>
      )}

      <section className="employment-section">
        <div className="employment-section-heading">
          <div>
            <span className="eyebrow">Leave and transfer</span>
            <h2>Your leave history</h2>
          </div>
        </div>
        {employment.role === "Employee" &&
          !employment.leaveRequests.some((item) => item.status === "Requested") && (
            <div className="employment-leave-form">
              <LogOut size={22} />
              <div>
                <h3>Request to leave your current salon</h3>
                <p>
                  The owner must release the employment relationship. If this
                  is a transfer, your accepted destination remains reserved.
                </p>
              </div>
              <textarea
                rows="3"
                value={employment.leaveReason}
                onChange={(event) => employment.setLeaveReason(event.target.value)}
                placeholder="Optional reason for leaving"
              />
              <button
                className="btn btn-primary"
                type="button"
                disabled={employment.acting}
                onClick={employment.requestLeave}
              >
                Send leave request
              </button>
            </div>
          )}
        {employment.leaveRequests.length === 0 ? (
          <EmptyState
            title="No leave requests"
            message="Any normal leave or salon-transfer request will appear here."
          />
        ) : (
          <div className="employment-grid">
            {employment.leaveRequests.map((request) => (
              <LeaveRequestCard
                request={request}
                key={request.requestId}
                actions={
                  request.status === "Requested" && (
                    <button
                      className="btn btn-secondary btn-small"
                      type="button"
                      disabled={employment.acting}
                      onClick={() => employment.cancelLeave(request.requestId)}
                    >
                      <RefreshCw size={16} /> Cancel leave request
                    </button>
                  )
                }
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
