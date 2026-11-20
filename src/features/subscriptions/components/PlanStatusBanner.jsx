import { AlertTriangle, ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../model/plan.js";

/** Days before the end when the dashboard starts to warn the owner. */
const WARN_DAYS = 7;

/** The warning to show for this plan, or null when there is nothing to say. */
function planWarning(subscription) {
  if (!subscription || subscription.openRequest) return null;
  const { status, daysLeft, accessEndsAt, limits } = subscription;
  const name = limits?.name || "Pro";
  const date = formatDate(accessEndsAt);
  const days = daysLeft === 1 ? "1 day" : `${daysLeft} days`;
  if (status === "GRACE") {
    return {
      tone: "danger",
      text: `Your ${name} period ended. Pay by ${date} to keep your plan; after that your salon moves to Free.`,
      action: "Pay now",
    };
  }
  if (daysLeft == null || daysLeft > WARN_DAYS) return null;
  if (status === "TRIAL") {
    return {
      tone: "warning",
      text: `Your free ${name} trial ends in ${days}, on ${date}. Choose a plan to keep card payments, reminders and full analytics.`,
      action: "Choose a plan",
    };
  }
  if (status === "ACTIVE") {
    return {
      tone: "warning",
      text: `Your ${name} plan is paid until ${date} (${days} left).`,
      action: "Renew",
    };
  }
  return null;
}

/** A short plan warning at the top of owner pages. */
export default function PlanStatusBanner({ subscription }) {
  const warning = planWarning(subscription);
  if (!warning) return null;
  const Icon = warning.tone === "danger" ? AlertTriangle : Clock3;
  return (
    <div className={`plan-banner is-${warning.tone}`} role="status">
      <Icon size={18} aria-hidden="true" />
      <p>{warning.text}</p>
      <Link className="btn btn-primary" to="/owner/plan">
        {warning.action} <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}
