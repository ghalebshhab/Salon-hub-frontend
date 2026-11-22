import { CalendarClock, Scissors, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "../../../shared/components/EmptyState.jsx";
import { SalonTeamSkeleton } from "../components/EmployeesPageSkeletons.jsx";
import useAuth from "../../../shared/auth/useAuth.js";
import ManagerRoleControl from "../components/ManagerRoleControl.jsx";
import useManageSalonEmployees from "../hooks/useManageSalonEmployees.js";
import useSalonManagerRole from "../hooks/useSalonManagerRole.js";
import useMySubscription from "../../subscriptions/hooks/useMySubscription.js";
import PlanLockNote from "../../subscriptions/components/PlanLockNote.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function TeamGrid({ employees, managerControl }) {
  return (
    <div className="employee-setup-grid">
      {employees.map((employee) => (
        <article className="employee-setup-card" key={employee.id}>
          <div className="employee-setup-avatar">
            {employee.imageUrl ? (
              <img src={employee.imageUrl} alt="" />
            ) : (
              <UserRound size={24} aria-hidden="true" />
            )}
          </div>
          <div className="employee-setup-copy">
            <h2>
              {employee.fullName}
              {employee.manager && (
                <span className="employee-manager-badge">
                  <ShieldCheck size={13} aria-hidden="true" />
                  {t("Manager")}
                </span>
              )}
            </h2>
            <p>{employee.specialty || employee.email}</p>
            <span>
              <Scissors size={15} aria-hidden="true" />
              {employee.serviceNames?.length
                ? employee.serviceNames.join(", ")
                : t("No services assigned")}
            </span>
            <span>
              <CalendarClock size={15} aria-hidden="true" />
              {t("Configure weekly availability")}
            </span>
          </div>
          <div className="employee-setup-actions">
            <Link
              className="btn btn-secondary btn-small"
              to={`/owner/employees/${employee.id}/setup`}
            >
              {t("Manage booking options")}
            </Link>
            {managerControl?.(employee)}
          </div>
        </article>
      ))}
    </div>
  );
}

/** The owner's view: the same grid plus the manager role (Business plan). */
function OwnerTeam({ employees, refetch }) {
  const { data: subscription } = useMySubscription();
  const features = subscription?.limits?.features;
  // Until the plan loads, offer only "Remove manager"; the server checks too.
  const locked = !features?.includes("MANAGER_ROLE");
  const { setManager, busyId } = useSalonManagerRole(refetch);

  return (
    <>
      {features && locked && (
        <PlanLockNote>
          {t(
            "Business salons can make an employee a manager who answers bookings and plans the team's time.",
          )}
        </PlanLockNote>
      )}
      <TeamGrid
        employees={employees}
        managerControl={(employee) => (
          <ManagerRoleControl
            employee={employee}
            locked={locked}
            busy={busyId === employee.id}
            onChange={setManager}
          />
        )}
      />
    </>
  );
}

function ManageSalonEmployees() {
  const { isOwner } = useAuth();
  const { employees, loading, refetch } = useManageSalonEmployees();

  if (loading) return <SalonTeamSkeleton />;

  return (
    <section className="container section">
      <header className="profile-header">
        <div>
          <span className="eyebrow">{t(PAGE_HEADS.salonTeam.eyebrow)}</span>
          <h1>{t(PAGE_HEADS.salonTeam.title)}</h1>
          <p>{t(PAGE_HEADS.salonTeam.text)}</p>
        </div>
      </header>

      {employees.length === 0 ? (
        <EmptyState
          title={t("No active employees yet")}
          message={t(
            "Once an employee joins your salon, you can configure their services and weekly schedule here.",
          )}
        />
      ) : isOwner ? (
        <OwnerTeam employees={employees} refetch={refetch} />
      ) : (
        <TeamGrid employees={employees} />
      )}
    </section>
  );
}

export default ManageSalonEmployees;
