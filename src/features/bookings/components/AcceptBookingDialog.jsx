import { CheckCircle, UserRoundCheck } from "lucide-react";
import { useId, useState } from "react";
import useAssignableEmployees from "../hooks/useAssignableEmployees.js";
import { formatDateLabel, toHourMinute } from "../model/booking.js";

const REASON_LABELS = {
  BUSY: "Busy at this time",
  TIME_OFF: "On time off",
  NOT_WORKING: "Not working then",
};

function pickDefault(employees, requestedId) {
  const requested = employees.find(
    (employee) => employee.id === requestedId && employee.available,
  );
  if (requested) return String(requested.id);
  const firstFree = employees.find((employee) => employee.available);
  return firstFree ? String(firstFree.id) : "";
}

/**
 * Owner confirms a request and chooses who serves the customer. Only employees
 * who can do every service are listed; unavailable ones show why.
 */
export default function AcceptBookingDialog({
  booking,
  accepting,
  onClose,
  onSubmit,
}) {
  const id = useId();
  const [choice, setChoice] = useState(null);
  const [note, setNote] = useState(
    "See you soon! Please arrive a few minutes early.",
  );

  const { employees, loading, error } = useAssignableEmployees(booking.id);

  const selectedId =
    choice ?? pickDefault(employees, booking.assignedEmployeeId);
  const requested = employees.find(
    (employee) => employee.id === booking.assignedEmployeeId,
  );
  const requestedUnavailable = requested && !requested.available;
  const noneFree =
    !loading && employees.every((employee) => !employee.available);

  return (
    <div className="reject-modal-overlay" role="presentation">
      <div
        className="reject-modal accept-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
      >
        <button
          className="reject-modal-close"
          type="button"
          onClick={onClose}
          disabled={accepting}
          aria-label="Close accept dialog"
        >
          ×
        </button>
        <div className="reject-modal-icon accept-modal-icon">
          <UserRoundCheck size={30} aria-hidden="true" />
        </div>
        <span className="eyebrow">Confirm appointment</span>
        <h2 id={`${id}-title`}>
          Who will serve {booking.customerName || "this customer"}?
        </h2>
        <p className="reject-modal-subtitle">
          {formatDateLabel(booking.bookingDate)} at{" "}
          {toHourMinute(booking.bookingTime)} ·{" "}
          {booking.services?.map((service) => service.name).join(", ")}
        </p>

        {requestedUnavailable && (
          <p className="accept-warning" role="status">
            The customer asked for {requested.fullName}, who is{" "}
            {(REASON_LABELS[requested.reason] || "unavailable").toLowerCase()}.
            Choose another professional; the customer will see the change.
          </p>
        )}

        <fieldset className="accept-employees" aria-busy={loading}>
          <legend className="sr-only">Employee</legend>
          {loading &&
            Array.from({ length: 3 }, (_, index) => (
              <span
                key={index}
                className="skeleton-block accept-employee-skeleton"
              />
            ))}
          {!loading && error && (
            <p className="accept-warning" role="alert">
              Could not load your team. Close and try again.
            </p>
          )}
          {!loading && !error && employees.length === 0 && (
            <p className="accept-warning">
              No employee can do every requested service. Update the services on
              your team page, or reject with a note.
            </p>
          )}
          {employees.map((employee) => (
            <label
              key={employee.id}
              className={`accept-employee ${String(employee.id) === selectedId ? "is-selected" : ""} ${employee.available ? "" : "is-disabled"}`}
            >
              <input
                type="radio"
                name={`${id}-employee`}
                className="sr-only"
                value={employee.id}
                disabled={!employee.available}
                checked={String(employee.id) === selectedId}
                onChange={() => setChoice(String(employee.id))}
              />
              <span className="accept-employee-avatar" aria-hidden="true">
                {employee.fullName.charAt(0).toUpperCase()}
              </span>
              <span className="accept-employee-body">
                <strong>
                  {employee.fullName}
                  {employee.id === booking.assignedEmployeeId && (
                    <em> · requested</em>
                  )}
                </strong>
                <small>{employee.specialty || "Salon professional"}</small>
              </span>
              <span
                className={`accept-employee-state ${employee.available ? "is-free" : ""}`}
              >
                {employee.available
                  ? "Free"
                  : REASON_LABELS[employee.reason] || "Unavailable"}
              </span>
            </label>
          ))}
        </fieldset>

        {noneFree && employees.length > 0 && (
          <p className="accept-warning">
            Nobody is free at this time. Propose a new time to the customer
            instead.
          </p>
        )}

        <div className="reject-input-group">
          <label htmlFor={`${id}-note`}>
            Message to the customer (optional)
          </label>
          <textarea
            id={`${id}-note`}
            maxLength={1000}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>

        <div className="reject-modal-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onClose}
            disabled={accepting}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="button"
            disabled={accepting || !selectedId}
            onClick={() =>
              onSubmit({
                assignedEmployeeId: Number(selectedId),
                ownerNote: note.trim() || null,
              })
            }
          >
            <CheckCircle size={17} aria-hidden="true" />
            {accepting ? "Confirming…" : "Confirm and notify"}
          </button>
        </div>
      </div>
    </div>
  );
}
