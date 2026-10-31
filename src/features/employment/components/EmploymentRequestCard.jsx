import { CalendarDays, Store, UserRound } from "lucide-react";
import EmploymentStatusPill from "./EmploymentStatusPill.jsx";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Date unavailable";

export default function EmploymentRequestCard({
  request,
  perspective = "user",
  actions,
}) {
  const invitation = request.requestType === "Owner_Invite";
  const person = invitation ? request.receiverName : request.senderName;

  return (
    <article className="employment-card">
      <div className="employment-card-heading">
        <div className="employment-card-icon">
          {perspective === "owner" ? <UserRound /> : <Store />}
        </div>
        <div>
          <span className="eyebrow">
            {invitation ? "Salon invitation" : "Join request"}
          </span>
          <h3>{perspective === "owner" ? person : request.salonName}</h3>
        </div>
        <EmploymentStatusPill status={request.status} />
      </div>
      <div className="employment-card-meta">
        <span>
          <Store size={15} /> {request.salonName}
        </span>
        <span>
          <CalendarDays size={15} /> {formatDate(request.createdAt)}
        </span>
      </div>
      {request.hiringPostTitle && (
        <p className="employment-context">
          Connected to hiring post: <strong>{request.hiringPostTitle}</strong>
        </p>
      )}
      {request.rejectionReason && (
        <p className="employment-reason">
          <strong>Decision reason:</strong> {request.rejectionReason}
        </p>
      )}
      {actions && <div className="employment-card-actions">{actions}</div>}
    </article>
  );
}
