const TITLES = {
  BOOKING_ACCEPTED: "Booking accepted",
  BOOKING_REJECTED: "Booking update",
  BOOKING_TIME_SUGGESTED: "Suggested appointment time",
  BOOKING_RESCHEDULE_PROPOSED: "New appointment proposal",
  BOOKING_RESCHEDULE_ACCEPTED: "Reschedule accepted",
  BOOKING_RESCHEDULE_REJECTED: "Reschedule declined",
  BOOKING_EMPLOYEE_REASSIGNED: "Employee updated",
  BOOKING_CANCELLED: "Booking cancelled",
  SALON_REQUEST_SUBMITTED: "Salon request submitted",
  SALON_REQUEST_RESUBMITTED: "Salon request resubmitted",
  SALON_REQUEST_ACCEPTED: "Salon request accepted",
  SALON_REQUEST_REJECTED: "Salon request rejected",
  SALON_BLOCKED: "Salon blocked",
  SALON_UNBLOCKED: "Salon restored",
};

export function getNotificationTitle(eventType) {
  return TITLES[eventType] || "SalonHub notification";
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
