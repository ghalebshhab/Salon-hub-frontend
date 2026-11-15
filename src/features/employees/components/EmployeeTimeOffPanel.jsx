import { CalendarOff, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../shared/notifications/toast.jsx";
import useEmployeeTimeOff from "../hooks/useEmployeeTimeOff.js";
import { formatDateLabel, getTodayDate } from "../../bookings/model/booking.js";

const emptyForm = () => ({
  startDate: getTodayDate(),
  endDate: getTodayDate(),
  reason: "",
});

/**
 * Days an employee is away. Customers cannot book them on these days and the
 * owner cannot assign them; existing appointments inside it are counted.
 */
export default function EmployeeTimeOffPanel({ employeeId, employeeName }) {
  const id = useId();
  const [form, setForm] = useState(emptyForm);
  const [removing, setRemoving] = useState(null);
  const { items, loading, saving, add, remove } = useEmployeeTimeOff(
    employeeId,
    { onError: showErrorToast },
  );

  const update = (field) => (event) =>
    setForm((current) => {
      const next = { ...current, [field]: event.target.value };
      if (field === "startDate" && next.endDate < next.startDate) {
        next.endDate = next.startDate;
      }
      return next;
    });

  const submit = async (event) => {
    event.preventDefault();
    const result = await add({
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason.trim() || null,
    });
    if (!result.ok) {
      showErrorToast(result.message);
      return;
    }
    if (result.affectedBookings > 0) {
      showWarningToast(result.message, "Reassign appointments");
    } else {
      showSuccessToast("Time off saved. Customers cannot book these days.");
    }
    setForm(emptyForm());
  };

  const confirmRemove = async () => {
    if (!removing) return;
    const result = await remove(removing.id);
    setRemoving(null);
    if (result.ok) showSuccessToast("Time off removed.");
    else showErrorToast(result.message);
  };

  return (
    <section className="employee-setup-panel" aria-labelledby={`${id}-title`}>
      <div className="employee-setup-panel-heading">
        <span className="employee-setup-panel-icon">
          <CalendarOff size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 id={`${id}-title`}>Time off</h2>
          <p>
            Vacation or sick days. {employeeName} disappears from booking on
            these days, including the first and last day.
          </p>
        </div>
      </div>

      <form className="time-off-form" onSubmit={submit}>
        <label>
          <span>From</span>
          <input
            type="date"
            required
            min={getTodayDate()}
            value={form.startDate}
            onChange={update("startDate")}
          />
        </label>
        <label>
          <span>To</span>
          <input
            type="date"
            required
            min={form.startDate}
            value={form.endDate}
            onChange={update("endDate")}
          />
        </label>
        <label className="time-off-reason">
          <span>Reason (only you see it)</span>
          <input
            maxLength={255}
            value={form.reason}
            onChange={update("reason")}
            placeholder="Vacation"
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          <Plus size={16} aria-hidden="true" />{" "}
          {saving ? "Saving…" : "Add time off"}
        </button>
      </form>

      {loading ? (
        <span className="skeleton-block time-off-skeleton" />
      ) : items.length === 0 ? (
        <p className="time-off-empty">No upcoming time off.</p>
      ) : (
        <ul className="time-off-list">
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>
                  {item.startDate === item.endDate
                    ? formatDateLabel(item.startDate)
                    : `${formatDateLabel(item.startDate)} – ${formatDateLabel(item.endDate)}`}
                </strong>
                {item.reason && <small>{item.reason}</small>}
              </div>
              <button
                className="icon-button danger"
                type="button"
                aria-label="Remove this time off"
                onClick={() => setRemoving(item)}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        title="Remove this time off?"
        message={`${employeeName} becomes bookable again on these days.`}
        confirmText="Remove"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setRemoving(null)}
      />
    </section>
  );
}
