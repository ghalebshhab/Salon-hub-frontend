const labels = {
  Requested: "Pending",
  Accepted_Pending_Leave: "Waiting for leave approval",
  Accepted: "Accepted",
  Rejected: "Rejected",
  Cancelled: "Cancelled",
};

export default function EmploymentStatusPill({ status }) {
  return (
    <span
      className={`employment-status employment-status-${String(status || "unknown").toLowerCase()}`}
    >
      {labels[status] || status || "Unknown"}
    </span>
  );
}
