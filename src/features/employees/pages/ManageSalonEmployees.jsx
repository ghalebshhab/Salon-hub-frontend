import { CalendarClock, Scissors, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "../../../shared/components/EmptyState.jsx";
import Loading from "../../../shared/components/Loading.jsx";
import useManageSalonEmployees from "../hooks/useManageSalonEmployees.js";

function ManageSalonEmployees() {
  const { employees, loading } = useManageSalonEmployees();

  if (loading) return <Loading message="Loading your salon team…" />;

  return (
    <section className="container section">
      <header className="profile-header">
        <div>
          <span className="eyebrow">Team setup</span>
          <h1>Employees and schedules</h1>
          <p>
            Set the services each employee can perform and their weekly working
            hours. Customers will only be able to select qualified employees.
          </p>
        </div>
      </header>

      {employees.length === 0 ? (
        <EmptyState
          title="No active employees yet"
          message="Once an employee joins your salon, you can configure their services and weekly schedule here."
        />
      ) : (
        <div className="employee-setup-grid">
          {employees.map((employee) => (
            <article className="employee-setup-card" key={employee.id}>
              <div className="employee-setup-avatar">
                {employee.imageUrl ? (
                  <img src={employee.imageUrl} alt="" />
                ) : (
                  <UserRound size={24} />
                )}
              </div>
              <div className="employee-setup-copy">
                <h2>{employee.fullName}</h2>
                <p>{employee.specialty || employee.email}</p>
                <span>
                  <Scissors size={15} />
                  {employee.serviceNames?.length
                    ? employee.serviceNames.join(", ")
                    : "No services assigned"}
                </span>
                <span>
                  <CalendarClock size={15} />
                  Configure weekly availability
                </span>
              </div>
              <Link
                className="btn btn-secondary btn-small"
                to={`/owner/employees/${employee.id}/setup`}
              >
                Manage booking options
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ManageSalonEmployees;
