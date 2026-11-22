import { BadgeCheck, Crown } from "lucide-react";
import t from "../../../shared/i18n/t.js";

const BADGES = {
  PRO: { label: t("Pro salon"), icon: BadgeCheck },
  BUSINESS: { label: t("Business salon"), icon: Crown },
};

/** The paid-plan badge a salon earns on public pages. Nothing on Free. */
export default function SalonPlanBadge({ badge, className = "" }) {
  const look = BADGES[badge];
  if (!look) return null;
  const Icon = look.icon;
  return (
    <span
      className={`salon-plan-badge is-${badge.toLowerCase()} ${className}`.trim()}
      title={t("{label} on SalonHub", { label: look.label })}
    >
      <Icon size={13} aria-hidden="true" />
      {t(look.label)}
    </span>
  );
}
