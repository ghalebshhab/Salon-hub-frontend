import { getTodayDate, isLiveToday, parseLocalDate } from "./booking.js";
import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";

/** The three lists on the customer's My Bookings page. */
export const BOOKING_VIEWS = [
  { key: "upcoming", label: t("Upcoming") },
  { key: "past", label: t("Past") },
  { key: "closed", label: t("Cancelled") },
];

const CLOSED_STATUSES = new Set([
  "REJECTED",
  "CANCELLED",
  "EXPIRED",
  "NO_SHOW",
]);
const OPEN_STATUSES = new Set(["PENDING", "ACCEPTED", "IN_PROGRESS"]);

/** One look per status: tone for color, short label, and icon name. */
export const STATUS_LOOK = {
  PENDING: { tone: "warning", label: t("Waiting for salon") },
  ACCEPTED: { tone: "success", label: t("Confirmed") },
  IN_PROGRESS: { tone: "brand", label: t("In service") },
  COMPLETED: { tone: "neutral", label: t("Completed") },
  REJECTED: { tone: "danger", label: t("Not accepted") },
  CANCELLED: { tone: "danger", label: t("Cancelled") },
  EXPIRED: { tone: "danger", label: t("Expired") },
  NO_SHOW: { tone: "danger", label: t("Missed") },
};

export const getStatusLook = (status) =>
  STATUS_LOOK[status] || { tone: "neutral", label: status };

export const hasPendingReschedule = (booking) =>
  booking.rescheduleProposals?.some((item) => item.status === "PENDING");

const appointmentTime = (booking) =>
  new Date(
    `${booking.bookingDate}T${booking.bookingTime || "00:00"}`,
  ).getTime();

/** Which list a booking belongs to. */
export function getBookingView(booking, today = getTodayDate()) {
  if (CLOSED_STATUSES.has(booking.status)) return "closed";
  if (booking.status === "COMPLETED") return "past";
  if (booking.status === "IN_PROGRESS" || hasPendingReschedule(booking))
    return "upcoming";
  if (OPEN_STATUSES.has(booking.status) && booking.bookingDate >= today)
    return "upcoming";
  return "past";
}

/** Bookings for one list: upcoming soonest first (live today on top), others newest first. */
export function selectBookings(bookings, view, today = getTodayDate()) {
  const list = bookings.filter((item) => getBookingView(item, today) === view);
  if (view === "upcoming") {
    return list.sort(
      (a, b) =>
        Number(isLiveToday(b, today)) - Number(isLiveToday(a, today)) ||
        appointmentTime(a) - appointmentTime(b),
    );
  }
  return list.sort((a, b) => appointmentTime(b) - appointmentTime(a));
}

export function countByView(bookings, today = getTodayDate()) {
  const counts = { upcoming: 0, past: 0, closed: 0 };
  bookings.forEach((item) => {
    counts[getBookingView(item, today)] += 1;
  });
  return counts;
}

/** Bookings that wait for the customer: a new time to accept or reject. */
export const countNeedsAnswer = (bookings) =>
  bookings.filter(hasPendingReschedule).length;

/** Day, month and weekday for the date tile. */
export function getDateParts(value) {
  const date = parseLocalDate(value);
  if (!date || Number.isNaN(date.getTime())) return null;
  return {
    day: date.getDate(),
    month: date.toLocaleDateString(dateLocale(), { month: "short" }),
    weekday: date.toLocaleDateString(dateLocale(), { weekday: "short" }),
    year: date.getFullYear(),
  };
}

export function formatDuration(minutes) {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return t("{rest} min", { rest });
  return rest ? t("{hours} h {rest} min", { hours, rest }) : `${hours} h`;
}

export const formatPrice = (value) =>
  value == null
    ? ""
    : t("{value} JD", { value: Number(value).toFixed(2).replace(/\.00$/, "") });
