import { MessageSquareText } from "lucide-react";

export default function RejectBookingDialog({
  booking,
  reason,
  rejecting,
  onReasonChange,
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
          aria-label="Close rejection dialog"
        >
          ×
        </button>
        <div className="reject-modal-icon">
          <MessageSquareText size={30} />
        </div>
        <span className="eyebrow">Reject appointment</span>
        <h2>Send a clear reason</h2>
        <p className="reject-modal-subtitle">
          Let the customer know why this booking cannot be accepted.
        </p>
        <div className="reject-booking-summary">
          <div>
            <strong>Customer</strong>
            <span>
              {booking?.customerName || booking?.customerEmail || "Customer"}
            </span>
          </div>
          <div>
            <strong>Requested time</strong>
            <span>
              {booking?.bookingDate} •{" "}
              {booking?.bookingTime?.toString().slice(0, 5)}
            </span>
          </div>
        </div>
        <div className="reject-input-group">
          <label htmlFor="booking-rejection-reason">Reason of rejection</label>
          <textarea
            id="booking-rejection-reason"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder="Example: Sorry, this time is already full. Please choose another time."
          />
        </div>
        <div className="reject-modal-actions">
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={onSubmit}
            disabled={rejecting}
          >
            {rejecting ? "Sending..." : "Send Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}
