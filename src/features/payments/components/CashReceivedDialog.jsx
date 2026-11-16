import { HandCoins } from "lucide-react";
import { useId } from "react";
import { formatMoney } from "../model/payment.js";

/** Confirms the amount before the employee or owner records cash. */
export default function CashReceivedDialog({
  booking,
  saving,
  onConfirm,
  onCancel,
}) {
  const id = useId();
  if (!booking) return null;
  const payment = booking.payment;

  return (
    <div className="reject-modal-overlay" role="presentation">
      <div
        className="reject-modal pay-cash-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
      >
        <button
          className="reject-modal-close"
          type="button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Close"
        >
          ×
        </button>
        <div className="reject-modal-icon pay-cash-icon">
          <HandCoins size={28} aria-hidden="true" />
        </div>
        <span className="eyebrow">Cash received</span>
        <h2 id={`${id}-title`}>
          Did {booking.customerName || "the customer"} pay in cash?
        </h2>
        <p className="pay-cash-amount">
          {formatMoney(payment?.amountFils, payment?.currency)}
        </p>
        <p className="reject-modal-subtitle" id={`${id}-desc`}>
          {booking.services?.map((service) => service.name).join(", ")}. The
          customer gets a receipt at once. Only confirm money you have in hand.
        </p>
        <div className="reject-modal-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            Not yet
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onConfirm}
            disabled={saving}
          >
            <HandCoins size={17} aria-hidden="true" />
            {saving ? "Recording…" : "Yes, record payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
