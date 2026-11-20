import { formatMoney } from "../../payments/model/payment.js";

export const PLAN_ORDER = ["FREE", "PRO", "BUSINESS"];

/** Short text for each plan, shown on its card. */
export const PLAN_TAGLINES = {
  FREE: "Start taking bookings online.",
  PRO: "For a growing salon with a small team.",
  BUSINESS: "For a busy salon with a large team.",
};

/** Plan features as owners read them. Keys match the server's PlanFeature. */
export const FEATURE_LABELS = {
  CARD_PAYMENTS: "Card payments",
  CANCELLATION_FEES: "Late-cancel and no-show fees",
  MISSED_VISIT_RULE: "Missed-visit rule",
  EMAIL_REMINDERS: "Email and 2-hour reminders",
  ADVANCED_ANALYTICS: "Busy hours, returning customers, payment health",
  CSV_EXPORT: "Export to CSV",
  PLAN_BADGE: "Plan badge on your salon page",
  SEARCH_BOOST: "Higher place in search",
  MANAGER_ROLE: "Manager role for a team member",
};
export const FEATURE_ORDER = Object.keys(FEATURE_LABELS);

export const BILLING_CYCLES = [
  { key: "MONTHLY", label: "Monthly" },
  { key: "YEARLY", label: "Yearly" },
];

export const STATUS_LOOK = {
  TRIAL: { label: "Free trial", tone: "info" },
  ACTIVE: { label: "Active", tone: "success" },
  GRACE: { label: "Payment due", tone: "warning" },
  ENDED: { label: "Free plan", tone: "neutral" },
};

export const REQUEST_STATUS_LOOK = {
  PENDING: { label: "Waiting for review", tone: "warning" },
  CONFIRMED: { label: "Confirmed", tone: "success" },
  REJECTED: { label: "Not accepted", tone: "danger" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

export const METHOD_LABELS = {
  CLIQ: "CliQ transfer",
  CASH: "Cash",
  COMPLIMENTARY: "Free months",
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
  value == null ? `Unlimited ${unit}` : `${value} ${unit}`;

export const feeText = (bps) => `${(bps / 100).toLocaleString("en-GB")}%`;

/** Usage rows for the meters: what the salon uses against the plan limit. */
export function usageRows(subscription) {
  const limits = subscription?.limits;
  const usage = subscription?.usage;
  if (!limits || !usage) return [];
  return [
    {
      key: "team",
      label: "Team members",
      hint: "Including you",
      used: usage.teamMembers,
      max: limits.maxTeamMembers,
    },
    {
      key: "services",
      label: "Active services",
      used: usage.activeServices,
      max: limits.maxServices,
    },
    {
      key: "posts",
      label: "Open hiring posts",
      used: usage.openHiringPosts,
      max: limits.maxOpenHiringPosts,
    },
  ];
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
