function SalonStatusBadge({ state }) {
  const value = state || "UNKNOWN";

  return (
    <span
      className={value === "OPEN" ? "badge badge-open" : "badge badge-closed"}
    >
      {value}
    </span>
  );
}

export default SalonStatusBadge;
