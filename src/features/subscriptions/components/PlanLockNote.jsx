import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import t from "../../../shared/i18n/t.js";

/** A short note that a feature needs a higher plan, with a link to the plan page. */
export default function PlanLockNote({ children }) {
  return (
    <p className="plan-lock-note">
      <Lock size={14} aria-hidden="true" />
      <span>
        {children}
        <Link to="/owner/plan">{t("See plans")}</Link>
      </span>
    </p>
  );
}
