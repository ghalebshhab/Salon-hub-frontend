export const money = (value) =>
  `${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} JD`;

export const dashboardStatusClass = (status) =>
  `owner-status owner-status-${String(status)
    .toLowerCase()
    .replaceAll("_", "-")}`;
