import t from "../../../shared/i18n/t.js";
const statusDetails = {
  Requested: {
    label: t("Under review"),
    group: "in-progress",
    description: t(
      "The salon has received your application and is reviewing it.",
    ),
  },
  Accepted_Pending_Leave: {
    label: t("Accepted · transfer pending"),
    group: "in-progress",
    description: t(
      "The salon accepted you. Your employment transfer is being completed.",
    ),
  },
  Accepted: {
    label: t("Accepted"),
    group: "accepted",
    description: t("The salon accepted your application."),
  },
  Rejected: {
    label: t("Not selected"),
    group: "closed",
    description: t("The salon has completed its review for this application."),
  },
  Cancelled: {
    label: t("Cancelled"),
    group: "closed",
    description: t("This application is no longer active."),
  },
};

export function getApplicationStatus(status) {
  return (
    statusDetails[status] || {
      label: status || t("Unknown"),
      group: "closed",
      description: t("The application status is unavailable."),
    }
  );
}

export function filterApplications(applications, filter) {
  if (filter === "all") return applications;
  return applications.filter(
    (application) => getApplicationStatus(application.status).group === filter,
  );
}

export function countApplications(applications, filter) {
  return filterApplications(applications, filter).length;
}
