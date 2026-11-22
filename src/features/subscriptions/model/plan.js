import { formatMoney } from "../../payments/model/payment.js";
import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";

export const PLAN_ORDER = ["FREE", "PRO", "BUSINESS"];

/** Short text for each plan, shown on its card. */
export const PLAN_TAGLINES = {
  FREE: t("Start taking bookings online."),
  PRO: t("For a growing salon with a small team."),
  BUSINESS: t("For a busy salon with a large team."),
};

/** Plan features as owners read them. Keys match the server's PlanFeature. */
export const FEATURE_LABELS = {
  CARD_PAYMENTS: t("Card payments"),
  CANCELLATION_FEES: t("Late-cancel and no-show fees"),
  MISSED_VISIT_RULE: t("Missed-visit rule"),
  EMAIL_REMINDERS: t("Email and 2-hour reminders"),
  ADVANCED_ANALYTICS: t("Busy hours, returning customers, payment health"),
  CSV_EXPORT: t("Export to CSV"),
  PLAN_BADGE: t("Plan badge on your salon page"),
  SEARCH_BOOST: t("Higher place in search"),
  MANAGER_ROLE: t("Manager role for a team member"),
};
export const FEATURE_ORDER = Object.keys(FEATURE_LABELS);

export const BILLING_CYCLES = [
  { key: "MONTHLY", label: t("Monthly") },
  { key: "YEARLY", label: t("Yearly") },
];

export const STATUS_LOOK = {
  TRIAL: { label: t("Free trial"), tone: "info" },
  ACTIVE: { label: t("Active"), tone: "success" },
  GRACE: { label: t("Payment due"), tone: "warning" },
  ENDED: { label: t("Free plan"), tone: "neutral" },
};

export const REQUEST_STATUS_LOOK = {
  PENDING: { label: t("Waiting for review"), tone: "warning" },
  CONFIRMED: { label: t("Confirmed"), tone: "success" },
  REJECTED: { label: t("Not accepted"), tone: "danger" },
  CANCELLED: { label: t("Cancelled"), tone: "neutral" },
};

export const METHOD_LABELS = {
  CLIQ: t("CliQ transfer"),
  CASH: t("Cash"),
  COMPLIMENTARY: t("Free months"),
};

export function planPrice(plan, cycle) {
  const fils =
    cycle === "YEARLY" ? plan.yearlyPriceFils : plan.monthlyPriceFils;
  return formatMoney(fils, plan.currency);
}

/** Months a yearly payment saves compared with paying every month. */
export function yearlySavingMonths(plan) {
  if (!plan.monthlyPriceFils) return 0;
  const saved = plan.monthlyPriceFils * 12 - plan.yearlyPriceFils;
  return Math.round(saved / plan.monthlyPriceFils);
}

export const limitText = (value, unit) =>
  value == null ? t("Unlimited {unit}", { unit }) : `${value} ${unit}`;

export const feeText = (bps) => `${(bps / 100).toLocaleString(dateLocale())}%`;

/** Usage rows for the meters: what the salon uses against the plan limit. */
export function usageRows(subscription) {
  const limits = subscription?.limits;
  const usage = subscription?.usage;
  if (!limits || !usage) return [];
  return [
    {
      key: "team",
      label: t("Team members"),
      hint: t("Including you"),
      used: usage.teamMembers,
      max: limits.maxTeamMembers,
    },
    {
      key: "services",
      label: t("Active services"),
      used: usage.activeServices,
      max: limits.maxServices,
    },
    {
      key: "posts",
      label: t("Open hiring posts"),
      used: usage.openHiringPosts,
      max: limits.maxOpenHiringPosts,
    },
  ];
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(dateLocale(), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
