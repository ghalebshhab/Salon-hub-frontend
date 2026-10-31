import { ArrowRight, CalendarDays } from "lucide-react";
import EmploymentStatusPill from "./EmploymentStatusPill.jsx";

export default function LeaveRequestCard({ request, actions }) {
  return (
    <article className="employment-card leave-request-card">
      <div className="employment-card-heading">
        <div>
          <span className="eyebrow">Employee leave</span>
          <h3>{request.employeeName}</h3>
        </div>
        <EmploymentStatusPill status={request.status} />
      </div>
      <div className="employment-transfer-route">
        <span>{request.currentSalonName}</span>
        <ArrowRight size={18} />
        <span>{request.targetSalonName || "Independent departure"}</span>
      </div>
      <p className="employment-context">{request.reason || "No reason provided."}</p>
      <div className="employment-card-meta">
        <span>
          <CalendarDays size={15} />
          {request.createdAt
            ? new Date(request.createdAt).toLocaleString()
            : "Date unavailable"}
        </span>
      </div>
      {actions && <div className="employment-card-actions">{actions}</div>}
    </article>
  );
}
