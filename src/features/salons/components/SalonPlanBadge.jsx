import { BadgeCheck, Crown } from "lucide-react";

const BADGES = {
  PRO: { label: "Pro salon", icon: BadgeCheck },
  BUSINESS: { label: "Business salon", icon: Crown },
};

/** The paid-plan badge a salon earns on public pages. Nothing on Free. */
export default function SalonPlanBadge({ badge, className = "" }) {
  const look = BADGES[badge];
  if (!look) return null;
  const Icon = look.icon;
  return (
    <span
      className={`salon-plan-badge is-${badge.toLowerCase()} ${className}`.trim()}
      title={`${look.label} on SalonHub`}
    >
      <Icon size={13} aria-hidden="true" />
      {look.label}
    </span>
  );
}
