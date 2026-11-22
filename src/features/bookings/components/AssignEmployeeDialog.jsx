import { UserRound } from "lucide-react";
import t from "../../../shared/i18n/t.js";
import { useId } from "react";
import useOverlayDialog from "../../../shared/hooks/useOverlayDialog.js";

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
  const id = useId();
  const dialogRef = useOverlayDialog(onClose, { locked: assigning });
  return (
    <div className="reject-modal-overlay" role="presentation">
      <div
        className="reject-modal"
        ref={dialogRef}
        role="dialog"
        aria-labelledby={`${id}-title`}
        aria-modal="true"
      >
        <button
          className="reject-modal-close"
          type="button"
          onClick={onClose}
          aria-label={t("Close reassignment dialog")}
        >
          ×
        </button>
        <div className="reject-modal-icon">
          <UserRound size={30} />
        </div>
        <span className="eyebrow">{t("Appointment update")}</span>
        <h2 id={`${id}-title`}>{t("Assign another employee")}</h2>
        <p className="reject-modal-subtitle">
          {t(
            "The customer will see this update with the new employee on their booking.",
          )}
        </p>
        <div className="reject-input-group">
          <label htmlFor="replacement-employee">
            {t("Available employee")}
          </label>
          <select
            id="replacement-employee"
            value={employeeId}
            onChange={(event) => onEmployeeChange(event.target.value)}
          >
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName} - {employee.specialty || t("Employee")}
              </option>
            ))}
          </select>
        </div>
        <div className="reject-input-group">
          <label htmlFor="assignment-customer-note">
            {t("Update for the customer")}
          </label>
          <textarea
            id="assignment-customer-note"
            maxLength={1000}
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder={t(
              "Explain that the selected employee is unavailable and who will take the appointment.",
            )}
          />
        </div>
        <div className="reject-modal-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onClose}
            disabled={assigning}
          >
            {t("Cancel")}
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSubmit}
            disabled={assigning || !employeeId}
          >
            {assigning ? t("Saving…") : t("Assign and update customer")}
          </button>
        </div>
      </div>
    </div>
  );
}
