import useMySalonEmployees from "../hooks/useMySalonEmployees.js";

import {
  Mail,
  RefreshCcw,
  Trash2,
  Clock,
  UserRound,
  Phone,
} from "lucide-react";

function MySalonEmployees() {
  const {
    employees,
    loading,
    handleResend,
    handleRemove,
    handleProcessApplication,
  } = useMySalonEmployees();

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Team management</span>
          <h1>My Salon Employees</h1>
          <p>Track invited and active employees for your salon.</p>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">
          <h3>No employees yet</h3>
          <p>Add employees while creating your salon or add them later.</p>
        </div>
      ) : (
        <div className="owner-employees-grid">
          {employees.map((employee) => (
            <div className="owner-employee-card" key={employee.id}>
              <div className="owner-employee-top">
                <div className="owner-employee-avatar">
                  {employee.imageUrl ? (
                    <img src={employee.imageUrl} alt={employee.fullName} />
                  ) : (
                    <UserRound size={28} />
                  )}
                </div>

                <div>
                  <h3>{employee.fullName}</h3>
                  <p>{employee.specialty || "Salon employee"}</p>
                </div>

                <span
                  className={`employee-status-pill status-${employee.status?.toLowerCase()}`}
                >
                  {employee.status}
                </span>
              </div>

              <div className="owner-employee-info">
                <p>
                  <Mail size={15} />
                  {employee.email}
                </p>

                <p>
                  <Phone size={15} />
                  {employee.phoneNumber}
                </p>

                {employee.status === "INPROGRESS" ? (
                  <>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <strong>Age:</strong> {employee.age}
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <strong>Experience:</strong> {employee.experienceYears}{" "}
                      years
                    </p>
                    {employee.cv && (
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <strong>CV:</strong>{" "}
                        <a
                          href={
                            employee.cv.startsWith("http")
                              ? employee.cv
                              : `https://${employee.cv}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "var(--primary)",
                            textDecoration: "underline",
                            fontWeight: "700",
                          }}
                        >
                          View CV
                        </a>
                      </p>
                    )}
                  </>
                ) : (
                  <p>
                    <Clock size={15} />
                    {employee.startTime?.toString().slice(0, 5)} -{" "}
                    {employee.endTime?.toString().slice(0, 5)}
                  </p>
                )}
              </div>

              <div className="service-actions">
                {employee.status === "INVITED" && (
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => handleResend(employee.id)}
                  >
                    <RefreshCcw size={15} />
                    Resend Invite
                  </button>
                )}

                {employee.status === "INPROGRESS" ? (
                  <>
                    <button
                      className="btn btn-success btn-small"
                      onClick={() =>
                        handleProcessApplication(employee.id, true)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() =>
                        handleProcessApplication(employee.id, false)
                      }
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleRemove(employee.id)}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MySalonEmployees;
