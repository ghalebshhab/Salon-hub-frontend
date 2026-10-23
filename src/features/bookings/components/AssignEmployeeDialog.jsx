import { UserRound } from "lucide-react";

export default function AssignEmployeeDialog({
  employees,
  employeeId,
  note,
  assigning,
  onEmployeeChange,
  onNoteChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="reject-modal-overlay" role="presentation">
      <div className="reject-modal" role="dialog" aria-modal="true">
        <button
          className="reject-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close reassignment dialog"
        >
          ×
        </button>
        <div className="reject-modal-icon">
          <UserRound size={30} />
        </div>
        <span className="eyebrow">Appointment update</span>
        <h2>Assign another employee</h2>
        <p className="reject-modal-subtitle">
          The customer will see this update with the new employee on their
          booking.
        </p>
        <div className="reject-input-group">
          <label htmlFor="replacement-employee">Available employee</label>
          <select
            id="replacement-employee"
            value={employeeId}
            onChange={(event) => onEmployeeChange(event.target.value)}
          >
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName} - {employee.specialty || "Employee"}
              </option>
            ))}
          </select>
        </div>
        <div className="reject-input-group">
          <label htmlFor="assignment-customer-note">
            Update for the customer
          </label>
          <textarea
            id="assignment-customer-note"
            maxLength={1000}
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="Explain that the selected employee is unavailable and who will take the appointment."
          />
        </div>
        <div className="reject-modal-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onClose}
            disabled={assigning}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSubmit}
            disabled={assigning || !employeeId}
          >
            {assigning ? "Saving…" : "Assign and update customer"}
          </button>
        </div>
      </div>
    </div>
  );
}
