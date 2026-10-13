const TITLES = {
  BOOKING_ACCEPTED: "Booking accepted",
  BOOKING_REJECTED: "Booking update",
  BOOKING_TIME_SUGGESTED: "Suggested appointment time",
  BOOKING_EMPLOYEE_REASSIGNED: "Employee updated",
  BOOKING_CANCELLED: "Booking cancelled",
};

export function getNotificationTitle(eventType) {
  return TITLES[eventType] || "Booking notification";
}

export function formatNotificationDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
