import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

/** A short note that a feature needs a higher plan, with a link to the plan page. */
export default function PlanLockNote({ children }) {
  return (
    <p className="plan-lock-note">
      <Lock size={14} aria-hidden="true" />
      <span>
        {children}
        <Link to="/owner/plan">See plans</Link>
      </span>
    </p>
  );
}
