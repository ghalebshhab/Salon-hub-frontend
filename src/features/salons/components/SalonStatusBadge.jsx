import t from "../../../shared/i18n/t.js";

function SalonStatusBadge({ state }) {
  const value = state || "UNKNOWN";

  return (
    <span
      className={value === "OPEN" ? "badge badge-open" : "badge badge-closed"}
    >
      {t(value)}
    </span>
  );
}

export default SalonStatusBadge;
