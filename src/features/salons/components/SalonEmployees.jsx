function SalonEmployees({ employees }) {
  if (!employees || employees.length === 0) {
    return (
      <div className="empty-state">
        <h3>No employees yet</h3>
        <p>This salon has no active employees yet.</p>
      </div>
    );
  }

  return (
    <div className="employees-grid">
      {employees.map((employee) => (
        <div className="employee-card" key={employee.employeeRecordId}>
          <div className="avatar">
            {(employee.firstName || employee.username || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h3>
              {employee.firstName} {employee.lastName}
            </h3>

            <p className="muted">@{employee.username}</p>
            <p className="muted">{employee.email}</p>
            <p className="muted">{employee.phoneNumber}</p>

            <span className="mini-badge">{employee.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SalonEmployees;
