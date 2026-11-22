import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";
/**
 * Payment rules and labels for the UI. The server sends money as whole fils
 * (1 JOD = 1000 fils), so the UI never adds decimals itself.
 */

export const FILS_PER_DINAR = 1000;

export const PAYMENT_METHODS = {
  CASH: {
    label: t("Cash at the salon"),
    short: t("Cash"),
    hint: t("Pay the salon when your service is done."),
  },
  CARD_POSTPAID: {
    label: t("Card after the service"),
    short: t("Card after"),
    hint: t("Get a secure payment link when your service is done."),
  },
  CARD_PREPAID: {
    label: t("Card now"),
    short: t("Card now"),
    hint: t("The amount is held now and taken only after the service."),
  },
};

/** Card methods the wizard shows as "coming soon" while no provider is connected. */
export const CARD_METHODS = ["CARD_POSTPAID", "CARD_PREPAID"];

export const PAYMENT_STATUSES = {
  UNPAID: { label: t("Not paid yet"), tone: "warning" },
  AUTHORIZED: { label: t("Card on hold"), tone: "info" },
  PAID: { label: t("Paid"), tone: "success" },
  PARTIALLY_REFUNDED: { label: t("Partly refunded"), tone: "info" },
  REFUNDED: { label: t("Refunded"), tone: "muted" },
  VOIDED: { label: t("Closed, no charge"), tone: "muted" },
  FAILED: { label: t("Payment failed"), tone: "danger" },
};

export const TRANSACTION_LABELS = {
  CASH_RECEIVED: t("Cash received"),
  AUTHORIZE: t("Card hold"),
  CAPTURE: t("Card charged"),
  VOID: t("Closed without charge"),
  REFUND: t("Refund"),
  METHOD_CHANGED: t("Method changed"),
};

const NUMBER = new Intl.NumberFormat(dateLocale(), {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

/** 19500 → "19.500 JOD". Null or bad input → "—". */
export function formatMoney(fils, currency = "JOD") {
  const value = Number(fils);
  if (fils === null || fils === undefined || !Number.isFinite(value)) {
    return "—";
  }
  return `${NUMBER.format(value / FILS_PER_DINAR)} ${t(currency)}`;
}

/** Dinars as typed or sent in a price ("19.50") → whole fils. */
export function toFils(dinars) {
  const value = Number(dinars);
  return Number.isFinite(value) ? Math.round(value * FILS_PER_DINAR) : 0;
}

export function getMethodLabel(method) {
  return PAYMENT_METHODS[method]?.label || t("Payment");
}

export function getMethodShort(method) {
  return PAYMENT_METHODS[method]?.short || t("Payment");
}

export function getPaymentStatus(status) {
  return PAYMENT_STATUSES[status] || { label: t("Unknown"), tone: "muted" };
}

export function isCardMethod(method) {
  return CARD_METHODS.includes(method);
}

/** Only bookings that ended with a service can have a receipt to show. */
export function hasReceipt(payment) {
  return Boolean(payment?.receiptNumber);
}

/** "Commission 0%" when the rate is 0, else "Commission 2.5%". */
export function formatRate(bps) {
  const percent = Number(bps || 0) / 100;
  return `${Number.isInteger(percent) ? percent : percent.toFixed(2)}%`;
}

const pad = (value) => String(value).padStart(2, "0");

export function toIsoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Named periods for the owner report. `today` is injectable for tests. */
export function periodRange(period, today = new Date()) {
  const end = toIsoDate(today);
  if (period === "today") return { from: end, to: end };
  if (period === "7d") {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return { from: toIsoDate(start), to: end };
  }
  if (period === "30d") {
    const start = new Date(today);
    start.setDate(start.getDate() - 29);
    return { from: toIsoDate(start), to: end };
  }
  return {
    from: toIsoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    to: end,
  };
}

export const REPORT_PERIODS = [
  { key: "today", label: t("Today") },
  { key: "7d", label: t("7 days") },
  { key: "month", label: t("This month") },
  { key: "30d", label: t("30 days") },
];
