import { ShieldCheck } from "lucide-react";
import t from "../../../shared/i18n/t.js";

/**
 * Owner-only control on a team card: shows whether the employee is a
 * manager and lets the owner change it. On plans without the role, only
 * removing a manager is possible.
 */
export default function ManagerRoleControl({
  employee,
  locked,
  busy,
  onChange,
}) {
  const manager = Boolean(employee.manager);
  if (!manager && locked) return null;

  return (
    <button
      className={`btn btn-small ${manager ? "btn-ghost-danger" : "btn-secondary"}`}
      type="button"
      disabled={busy}
      aria-busy={busy}
      onClick={() => onChange(employee, !manager)}
    >
      <ShieldCheck size={15} aria-hidden="true" />
      {manager ? t("Remove manager") : t("Make manager")}
    </button>
  );
}
