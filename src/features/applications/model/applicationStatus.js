const statusDetails = {
  Requested: {
    label: "Under review",
    group: "in-progress",
    description: "The salon has received your application and is reviewing it.",
  },
  Accepted_Pending_Leave: {
    label: "Accepted · transfer pending",
    group: "in-progress",
    description:
      "The salon accepted you. Your employment transfer is being completed.",
  },
  Accepted: {
    label: "Accepted",
    group: "accepted",
    description: "The salon accepted your application.",
  },
  Rejected: {
    label: "Not selected",
    group: "closed",
    description: "The salon has completed its review for this application.",
  },
  Cancelled: {
    label: "Cancelled",
    group: "closed",
    description: "This application is no longer active.",
  },
};

export function getApplicationStatus(status) {
  return (
    statusDetails[status] || {
      label: status || "Unknown",
      group: "closed",
      description: "The application status is unavailable.",
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
