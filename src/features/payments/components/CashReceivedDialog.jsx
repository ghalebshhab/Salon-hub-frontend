import { HandCoins, Smartphone } from "lucide-react";
import { useId, useState } from "react";
import { formatMoney, isCliq } from "../model/payment.js";
import t from "../../../shared/i18n/t.js";
import { serviceName } from "../../services/model/serviceText.js";
import useOverlayDialog from "../../../shared/hooks/useOverlayDialog.js";

/**
 * Confirms the amount before the employee or owner records cash. For a CliQ
 * booking the owner confirms that the transfer arrived, with an optional
 * bank reference.
 */
export default function CashReceivedDialog({
  booking,
  saving,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useOverlayDialog(onCancel, { locked: saving });
  const id = useId();
  const [reference, setReference] = useState("");
  if (!booking) return null;
  const payment = booking.payment;
  const cliq = isCliq(payment?.method);
  const Icon = cliq ? Smartphone : HandCoins;
  const services = booking.services?.map(serviceName).join("، ");

  const close = () => {
    setReference("");
    onCancel();
  };
  const submit = () => {
    onConfirm(cliq ? reference : undefined);
    setReference("");
  };

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
          onClick={close}
          disabled={saving}
          aria-label={t("Close")}
        >
          ×
        </button>
        <div className="reject-modal-icon pay-cash-icon">
          <Icon size={28} aria-hidden="true" />
        </div>
        <span className="eyebrow">
          {cliq ? t("Paid by CliQ") : t("Cash received")}
        </span>
        <h2 id={`${id}-title`}>
          {cliq
            ? booking.customerName
              ? t("Did the CliQ transfer from {name} arrive?", {
                  name: booking.customerName,
                })
              : t("Did the customer's CliQ transfer arrive?")
            : booking.customerName
              ? t("Did {name} pay in cash?", { name: booking.customerName })
              : t("Did the customer pay in cash?")}
        </h2>
        <p className="pay-cash-amount">
          {formatMoney(payment?.amountFils, payment?.currency)}
        </p>
        <p className="reject-modal-subtitle" id={`${id}-desc`}>
          {cliq
            ? t(
                "{services}. Check your bank app first. The customer gets a receipt at once.",
                { services },
              )
            : t(
                "{services}. The customer gets a receipt at once. Only confirm money you have in hand.",
                { services },
              )}
        </p>
        {cliq && (
          <label className="pay-cliq-reference">
            <span>{t("Transfer reference (optional)")}</span>
            <input
              type="text"
              value={reference}
              maxLength={40}
              onChange={(event) => setReference(event.target.value)}
              placeholder={t("From the bank's message")}
              disabled={saving}
            />
          </label>
        )}
        <div className="reject-modal-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={close}
            disabled={saving}
          >
            {t("Not yet")}
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={submit}
            disabled={saving}
          >
            <Icon size={17} aria-hidden="true" />
            {saving
              ? t("Recording…")
              : cliq
                ? t("Yes, mark as paid")
                : t("Yes, record payment")}
          </button>
        </div>
      </div>
    </div>
  );
}
