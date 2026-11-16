import { CalendarX2, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../shared/notifications/toast.jsx";
import useSalonClosures from "../hooks/useSalonClosures.js";
import {
  formatDateRange,
  getTodayDate,
} from "../../bookings/model/booking.js";

const emptyForm = () => ({
  startDate: getTodayDate(),
  endDate: getTodayDate(),
  reason: "",
});

/**
 * Owner panel for whole-salon closures. On these days nobody can book the
 * salon; appointments that already fall inside are counted for the owner.
 */
export default function SalonClosuresPanel({ salonId }) {
  const id = useId();
  const [form, setForm] = useState(emptyForm);
  const [removing, setRemoving] = useState(null);
  const [affected, setAffected] = useState(0);
  const { items, loading, saving, add, remove } = useSalonClosures(salonId, {
    onError: showErrorToast,
  });

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
    setAffected(result.affectedBookings);
    if (result.affectedBookings > 0) {
      showWarningToast(result.message, "Appointments inside the closure");
    } else {
      showSuccessToast("Closure saved. Customers cannot book these days.");
    }
    setForm(emptyForm());
  };

  const confirmRemove = async () => {
    if (!removing) return;
    const result = await remove(removing.id);
    setRemoving(null);
    if (result.ok) showSuccessToast("Closure removed. These days are open again.");
    else showErrorToast(result.message);
  };

  return (
    <section
      className="owner-edit-section owner-edit-wide salon-closures"
      aria-labelledby={`${id}-title`}
    >
      <header className="owner-edit-section-heading">
        <div>
          <span className="eyebrow">Holidays</span>
          <h2 id={`${id}-title`}>Days the salon is closed</h2>
          <p>
            Public holidays, renovation or a team trip. Nobody can book on
            these days, and guests see the dates on your salon page.
          </p>
        </div>
        <span className="salon-closures-icon" aria-hidden="true">
          <CalendarX2 size={20} />
        </span>
      </header>

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
          <span>Note for guests (optional)</span>
          <input
            maxLength={255}
            value={form.reason}
            onChange={update("reason")}
            placeholder="Eid holiday"
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          <Plus size={16} aria-hidden="true" />{" "}
          {saving ? "Saving…" : "Add closure"}
        </button>
      </form>

      {affected > 0 && (
        <p className="salon-closures-warning" role="status">
          {affected} appointment{affected === 1 ? "" : "s"} already fall inside
          this closure. Move or cancel them in{" "}
          <Link to="/owner/bookings">Salon Bookings</Link>.
        </p>
      )}

      {loading ? (
        <span className="skeleton-block time-off-skeleton" />
      ) : items.length === 0 ? (
        <p className="time-off-empty">
          No closures planned. The salon follows its normal hours.
        </p>
      ) : (
        <ul className="time-off-list">
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{formatDateRange(item.startDate, item.endDate)}</strong>
                {item.reason && <small>{item.reason}</small>}
              </div>
              <button
                className="icon-button danger"
                type="button"
                aria-label={`Remove the closure on ${formatDateRange(item.startDate, item.endDate)}`}
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
        title="Remove this closure?"
        message="Customers can book these days again."
        confirmText="Remove"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setRemoving(null)}
      />
    </section>
  );
}
