import t from "../../../shared/i18n/t.js";
const labels = {
  Requested: t("Pending"),
  Accepted_Pending_Leave: t("Waiting for leave approval"),
  Accepted: t("Accepted"),
  Rejected: t("Rejected"),
  Cancelled: t("Cancelled"),
};

export default function EmploymentStatusPill({ status }) {
  return (
    <span
      className={`employment-status employment-status-${String(status || "unknown").toLowerCase()}`}
    >
      {labels[status] || status || t("Unknown")}
    </span>
  );
}
