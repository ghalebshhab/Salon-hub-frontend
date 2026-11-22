import { CalendarDays, Store, UserRound } from "lucide-react";
import EmploymentStatusPill from "./EmploymentStatusPill.jsx";
import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(dateLocale(), {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : t("Date unavailable");

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
            {invitation ? t("Salon invitation") : t("Join request")}
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
          {t("Connected to hiring post:")}{" "}
          <strong>{request.hiringPostTitle}</strong>
        </p>
      )}
      {request.rejectionReason && (
        <p className="employment-reason">
          <strong>{t("Decision reason:")}</strong> {request.rejectionReason}
        </p>
      )}
      {actions && <div className="employment-card-actions">{actions}</div>}
    </article>
  );
}
