import { getPaymentStatus } from "../../payments/model/payment.js";
import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";

export const money = (value) =>
  t("{localeString} JD", {
    localeString: Number(value || 0).toLocaleString(dateLocale(), {
      maximumFractionDigits: 2,
    }),
  });

/** Owner-side words and color tone for each booking or employee status. */
const STATUS_LOOK = {
  PENDING: { label: t("Needs answer"), tone: "warning" },
  RESCHEDULE_AWAITING: { label: t("New time sent"), tone: "warning" },
  ACCEPTED: { label: t("Confirmed"), tone: "info" },
  IN_PROGRESS: { label: t("In service"), tone: "brand" },
  COMPLETED: { label: t("Completed"), tone: "success" },
  REJECTED: { label: t("Declined"), tone: "danger" },
  CANCELLED: { label: t("Cancelled"), tone: "danger" },
  EXPIRED: { label: t("Expired"), tone: "neutral" },
  NO_SHOW: { label: t("No-show"), tone: "danger" },
  ACTIVE: { label: t("Active"), tone: "success" },
  AVAILABLE: { label: t("Available"), tone: "success" },
};

const titleCase = (value) =>
  String(value)
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());

export function getOwnerStatusLook(status) {
  const key = String(status || "").toUpperCase();
  return STATUS_LOOK[key] || { label: titleCase(key), tone: "neutral" };
}

/** Booking statuses the owner can filter by, in workflow order. */
export const BOOKING_FILTER_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
  "REJECTED",
  "EXPIRED",
];

/** Short payment line for a booking, or a clear note when none exists. */
export const paymentLabel = (payment) =>
  payment ? getPaymentStatus(payment.status).label : t("No payment record");

export function greeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return t("Good morning");
  if (hour < 18) return t("Good afternoon");
  return t("Good evening");
}

export const timeLabel = (value) =>
  value
    ? new Date(value).toLocaleTimeString(dateLocale(), {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
