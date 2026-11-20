import { getPaymentStatus } from "../../payments/model/payment.js";

export const money = (value) =>
  `${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} JD`;

/** Owner-side words and color tone for each booking or employee status. */
const STATUS_LOOK = {
  PENDING: { label: "Needs answer", tone: "warning" },
  RESCHEDULE_AWAITING: { label: "New time sent", tone: "warning" },
  ACCEPTED: { label: "Confirmed", tone: "info" },
  IN_PROGRESS: { label: "In service", tone: "brand" },
  COMPLETED: { label: "Completed", tone: "success" },
  REJECTED: { label: "Declined", tone: "danger" },
  CANCELLED: { label: "Cancelled", tone: "danger" },
  EXPIRED: { label: "Expired", tone: "neutral" },
  NO_SHOW: { label: "No-show", tone: "danger" },
  ACTIVE: { label: "Active", tone: "success" },
  AVAILABLE: { label: "Available", tone: "success" },
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
  payment ? getPaymentStatus(payment.status).label : "No payment record";

export function greeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export const timeLabel = (value) =>
  value
    ? new Date(value).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
