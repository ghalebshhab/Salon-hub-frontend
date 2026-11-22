import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";
const TITLES = {
  BOOKING_ACCEPTED: t("Booking accepted"),
  BOOKING_REJECTED: t("Booking update"),
  BOOKING_TIME_SUGGESTED: t("Suggested appointment time"),
  BOOKING_RESCHEDULE_PROPOSED: t("New appointment proposal"),
  BOOKING_RESCHEDULE_ACCEPTED: t("Reschedule accepted"),
  BOOKING_RESCHEDULE_REJECTED: t("Reschedule declined"),
  BOOKING_EMPLOYEE_REASSIGNED: t("Employee updated"),
  BOOKING_CANCELLED: t("Booking cancelled"),
  BOOKING_REQUESTED: t("New booking request"),
  BOOKING_ASSIGNED: t("New appointment for you"),
  BOOKING_CUSTOMER_ON_THE_WAY: t("Customer on the way"),
  BOOKING_CUSTOMER_ARRIVED: t("Customer arrived"),
  BOOKING_CUSTOMER_CONFIRMED: t("Customer confirmed"),
  BOOKING_SERVICE_STARTED: t("Your service started"),
  BOOKING_COMPLETED: t("Appointment complete"),
  BOOKING_EXPIRED: t("Request expired"),
  BOOKING_REMINDER: t("Appointment reminder"),
  BOOKING_NO_SHOW: t("Missed appointment"),
  PAYMENT_RECEIVED: t("Payment received"),
  SALON_REQUEST_SUBMITTED: t("Salon request submitted"),
  SALON_REQUEST_RESUBMITTED: t("Salon request resubmitted"),
  SALON_REQUEST_ACCEPTED: t("Salon request accepted"),
  SALON_REQUEST_REJECTED: t("Salon request rejected"),
  SALON_BLOCKED: t("Salon blocked"),
  SALON_UNBLOCKED: t("Salon restored"),
  FRIEND_REQUEST_RECEIVED: t("New friend request"),
  FRIEND_REQUEST_ACCEPTED: t("Friend request accepted"),
  FRIEND_REQUEST_DECLINED: t("Friend request declined"),
};

export function getNotificationTitle(eventType) {
  return TITLES[eventType] || t("SalonHub notification");
}

export function formatNotificationDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(dateLocale(), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
