import { HandCoins } from "lucide-react";
import { useId } from "react";
import { formatMoney } from "../model/payment.js";
import t from "../../../shared/i18n/t.js";
import { serviceName } from "../../services/model/serviceText.js";
import useOverlayDialog from "../../../shared/hooks/useOverlayDialog.js";

/** Confirms the amount before the employee or owner records cash. */
export default function CashReceivedDialog({
  booking,
  saving,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useOverlayDialog(onCancel, { locked: saving });
  const id = useId();
  if (!booking) return null;
  const payment = booking.payment;

  return (
    <div className="reject-modal-overlay" role="presentation">
      <div
        className="reject-modal pay-cash-modal"
        ref={dialogRef}
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
          aria-label={t("Close")}
        >
          ×
        </button>
        <div className="reject-modal-icon pay-cash-icon">
          <HandCoins size={28} aria-hidden="true" />
        </div>
        <span className="eyebrow">{t("Cash received")}</span>
        <h2 id={`${id}-title`}>
          {booking.customerName
            ? t("Did {name} pay in cash?", { name: booking.customerName })
            : t("Did the customer pay in cash?")}
        </h2>
        <p className="pay-cash-amount">
          {formatMoney(payment?.amountFils, payment?.currency)}
        </p>
        <p className="reject-modal-subtitle" id={`${id}-desc`}>
          {t(
            "{services}. The customer gets a receipt at once. Only confirm money you have in hand.",
            {
              services: booking.services?.map(serviceName).join("، "),
            },
          )}
        </p>
        <div className="reject-modal-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            {t("Not yet")}
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onConfirm}
            disabled={saving}
          >
            <HandCoins size={17} aria-hidden="true" />
            {saving ? t("Recording…") : t("Yes, record payment")}
          </button>
        </div>
      </div>
    </div>
  );
}
