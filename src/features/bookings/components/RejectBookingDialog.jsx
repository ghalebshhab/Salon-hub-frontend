import { MessageSquareText } from "lucide-react";
import t from "../../../shared/i18n/t.js";
import { useId } from "react";
import useOverlayDialog from "../../../shared/hooks/useOverlayDialog.js";

export default function RejectBookingDialog({
  booking,
  reason,
  rejecting,
  onReasonChange,
  onClose,
  onSubmit,
}) {
  const id = useId();
  const dialogRef = useOverlayDialog(onClose, { locked: rejecting });
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
          aria-label={t("Close rejection dialog")}
        >
          ×
        </button>
        <div className="reject-modal-icon">
          <MessageSquareText size={30} />
        </div>
        <span className="eyebrow">{t("Reject appointment")}</span>
        <h2 id={`${id}-title`}>{t("Send a clear reason")}</h2>
        <p className="reject-modal-subtitle">
          {t("Let the customer know why this booking cannot be accepted.")}
        </p>
        <div className="reject-booking-summary">
          <div>
            <strong>{t("Customer")}</strong>
            <span>
              {booking?.customerName || booking?.customerEmail || t("Customer")}
            </span>
          </div>
          <div>
            <strong>{t("Requested time")}</strong>
            <span>
              {booking?.bookingDate} •{" "}
              {booking?.bookingTime?.toString().slice(0, 5)}
            </span>
          </div>
        </div>
        <div className="reject-input-group">
          <label htmlFor="booking-rejection-reason">
            {t("Reason of rejection")}
          </label>
          <textarea
            id="booking-rejection-reason"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={t(
              "Example: Sorry, this time is already full. Please choose another time.",
            )}
          />
        </div>
        <div className="reject-modal-actions">
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            {t("Cancel")}
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={onSubmit}
            disabled={rejecting}
          >
            {rejecting ? t("Sending...") : t("Send Rejection")}
          </button>
        </div>
      </div>
    </div>
  );
}
