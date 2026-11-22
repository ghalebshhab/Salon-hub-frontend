import { AlertTriangle, ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../model/plan.js";
import t from "../../../shared/i18n/t.js";

/** Days before the end when the dashboard starts to warn the owner. */
const WARN_DAYS = 7;

/** The warning to show for this plan, or null when there is nothing to say. */
function planWarning(subscription) {
  if (!subscription || subscription.openRequest) return null;
  const { status, daysLeft, accessEndsAt, limits } = subscription;
  const name = limits?.name || t("Pro");
  const date = formatDate(accessEndsAt);
  const days =
    daysLeft === 1 ? t("1 day") : t("{count} days", { count: daysLeft });
  if (status === "GRACE") {
    return {
      tone: "danger",
      text: t(
        "Your {name} period ended. Pay by {date} to keep your plan; after that your salon moves to Free.",
        { name, date },
      ),
      action: t("Pay now"),
    };
  }
  if (daysLeft == null || daysLeft > WARN_DAYS) return null;
  if (status === "TRIAL") {
    return {
      tone: "warning",
      text: t(
        "Your free {name} trial ends in {days}, on {date}. Choose a plan to keep card payments, reminders and full analytics.",
        { name, days, date },
      ),
      action: t("Choose a plan"),
    };
  }
  if (status === "ACTIVE") {
    return {
      tone: "warning",
      text: t("Your {name} plan is paid until {date} ({days} left).", {
        name,
        date,
        days,
      }),
      action: t("Renew"),
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
      <p>{t(warning.text)}</p>
      <Link className="btn btn-primary" to="/owner/plan">
        {warning.action} <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}
