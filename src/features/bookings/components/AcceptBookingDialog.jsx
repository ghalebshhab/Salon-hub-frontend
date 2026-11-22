import { CheckCircle, UserRoundCheck } from "lucide-react";
import { useId, useState } from "react";
import useAssignableEmployees from "../hooks/useAssignableEmployees.js";
import { formatDateLabel, toHourMinute } from "../model/booking.js";
import t from "../../../shared/i18n/t.js";
import { serviceName } from "../../services/model/serviceText.js";
import useOverlayDialog from "../../../shared/hooks/useOverlayDialog.js";

const REASON_LABELS = {
  BUSY: t("Busy at this time"),
  TIME_OFF: t("On time off"),
  NOT_WORKING: t("Not working then"),
  SALON_CLOSED: t("Salon closed that day"),
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
  const dialogRef = useOverlayDialog(onClose, { locked: accepting });
  const id = useId();
  const [choice, setChoice] = useState(null);
  const [note, setNote] = useState(
    t("See you soon! Please arrive a few minutes early."),
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
      >
        <button
          className="reject-modal-close"
          type="button"
          onClick={onClose}
          disabled={accepting}
          aria-label={t("Close accept dialog")}
        >
          ×
        </button>
        <div className="reject-modal-icon accept-modal-icon">
          <UserRoundCheck size={30} aria-hidden="true" />
        </div>
        <span className="eyebrow">{t("Confirm appointment")}</span>
        <h2 id={`${id}-title`}>
          {booking.customerName
            ? t("Who will serve {name}?", { name: booking.customerName })
            : t("Who will serve this customer?")}
        </h2>
        <p className="reject-modal-subtitle">
          {t("{date} at {time}", {
            date: formatDateLabel(booking.bookingDate),
            time: toHourMinute(booking.bookingTime),
          })}{" "}
          · {booking.services?.map(serviceName).join(", ")}
        </p>

        {requestedUnavailable && (
          <p className="accept-warning" role="status">
            {t(
              "The customer asked for {name}, who is not free ({reason}). Choose another professional; the customer will see the change.",
              {
                name: requested.fullName,
                reason: t(REASON_LABELS[requested.reason] || "Unavailable"),
              },
            )}
          </p>
        )}

        <fieldset className="accept-employees" aria-busy={loading}>
          <legend className="sr-only">{t("Employee")}</legend>
          {loading &&
            Array.from({ length: 3 }, (_, index) => (
              <span
                key={index}
                className="skeleton-block accept-employee-skeleton"
              />
            ))}
          {!loading && error && (
            <p className="accept-warning" role="alert">
              {t("Could not load your team. Close and try again.")}
            </p>
          )}
          {!loading && !error && employees.length === 0 && (
            <p className="accept-warning">
              {t(
                "No employee can do every requested service. Update the services on your team page, or reject with a note.",
              )}
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
                    <em> {t("· requested")}</em>
                  )}
                </strong>
                <small>{employee.specialty || t("Salon professional")}</small>
              </span>
              <span
                className={`accept-employee-state ${employee.available ? "is-free" : ""}`}
              >
                {employee.available
                  ? t("Free")
                  : REASON_LABELS[employee.reason] || t("Unavailable")}
              </span>
            </label>
          ))}
        </fieldset>

        {noneFree && employees.length > 0 && (
          <p className="accept-warning">
            {t(
              "Nobody is free at this time. Propose a new time to the customer instead.",
            )}
          </p>
        )}

        <div className="reject-input-group">
          <label htmlFor={`${id}-note`}>
            {t("Message to the customer (optional)")}
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
            {t("Cancel")}
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
            {accepting ? t("Confirming…") : t("Confirm and notify")}
          </button>
        </div>
      </div>
    </div>
  );
}
