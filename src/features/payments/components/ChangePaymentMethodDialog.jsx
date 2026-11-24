import { ArrowLeftRight, Banknote, Smartphone } from "lucide-react";
import { useId, useState } from "react";
import { PAYMENT_METHODS, formatMoney } from "../model/payment.js";
import t from "../../../shared/i18n/t.js";
import useOverlayDialog from "../../../shared/hooks/useOverlayDialog.js";

const ICONS = { CASH: Banknote, CLIQ: Smartphone };

/** The customer picks cash or CliQ for an unpaid booking. */
export default function ChangePaymentMethodDialog({
  booking,
  options,
  saving,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useOverlayDialog(onCancel, { locked: saving });
  const id = useId();
  const [chosen, setChosen] = useState(null);
  if (!booking) return null;
  const payment = booking.payment;
  const current = payment?.method;
  const methods = options?.methods || [];
  const others = methods.filter((method) => method !== current);
  const value = chosen && others.includes(chosen) ? chosen : others[0];

  const close = () => {
    setChosen(null);
    onCancel();
  };
  const submit = () => {
    onConfirm(value);
    setChosen(null);
  };

  return (
    <div className="reject-modal-overlay" role="presentation">
      <div
        className="reject-modal pay-cash-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-busy={!options}
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
          <ArrowLeftRight size={28} aria-hidden="true" />
        </div>
        <span className="eyebrow">{t("Change payment method")}</span>
        <h2 id={`${id}-title`}>{t("How do you want to pay?")}</h2>
        <p className="pay-cash-amount">
          {formatMoney(payment?.amountFils, payment?.currency)}
        </p>

        {!options ? (
          <p className="reject-modal-subtitle">{t("Loading…")}</p>
        ) : others.length === 0 ? (
          <p className="reject-modal-subtitle" role="status">
            {t("This salon accepts no other method for this booking.")}
          </p>
        ) : (
          <fieldset className="pay-method-choice">
            <legend className="sr-only">{t("Payment method")}</legend>
            {others.map((method) => {
              const Icon = ICONS[method];
              return (
                <label
                  key={method}
                  className={`pay-option ${value === method ? "is-selected" : ""}`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={`${id}-method`}
                    value={method}
                    checked={value === method}
                    onChange={() => setChosen(method)}
                  />
                  <span className="pay-option-icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="pay-option-body">
                    <strong>{t(PAYMENT_METHODS[method].label)}</strong>
                    <small>
                      {method === "CLIQ" && options.cliqAlias ? (
                        <>
                          {t("Send to")}{" "}
                          <span dir="ltr">{options.cliqAlias}</span>
                          {options.cliqName && <> ({options.cliqName})</>}
                        </>
                      ) : (
                        PAYMENT_METHODS[method].hint
                      )}
                    </small>
                  </span>
                </label>
              );
            })}
          </fieldset>
        )}

        <div className="reject-modal-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={close}
            disabled={saving}
          >
            {t("Keep it")}
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={submit}
            disabled={saving || !value}
          >
            {saving ? t("Saving…") : t("Change method")}
          </button>
        </div>
      </div>
    </div>
  );
}
