import {
  ArrowLeftRight,
  Banknote,
  CreditCard,
  HandCoins,
  ReceiptText,
  Smartphone,
} from "lucide-react";
import {
  formatMoney,
  getMethodLabel,
  getPaymentStatus,
  hasReceipt,
  isCliq,
  needsCliqTransfer,
} from "../model/payment.js";
import t from "../../../shared/i18n/t.js";

const ICONS = {
  CASH: Banknote,
  CARD_POSTPAID: CreditCard,
  CARD_PREPAID: CreditCard,
  CLIQ: Smartphone,
};

/**
 * One payment line for a booking card: method, amount, status, and the
 * actions that fit the viewer. Renders nothing for bookings made before
 * payments existed.
 *
 * - `canCollect`: staff may record cash. A CliQ transfer also needs
 *   `canConfirmCliq`, because only the salon owner sees the salon's bank.
 * - `onChangeMethod`: the customer may switch between cash and CliQ.
 */
export default function PaymentStrip({
  payment,
  canCollect = false,
  canConfirmCliq = false,
  collecting = false,
  onCollect,
  onReceipt,
  onChangeMethod,
}) {
  if (!payment) return null;
  const status = getPaymentStatus(payment.status);
  const Icon = ICONS[payment.method] || Banknote;
  const cliq = isCliq(payment.method);
  const collectable =
    canCollect && payment.collectable && (!cliq || canConfirmCliq);
  const showReceipt = Boolean(onReceipt && hasReceipt(payment));
  const showTransfer = !canCollect && needsCliqTransfer(payment);

  return (
    <div className={`pay-strip tone-${status.tone}`}>
      <span className="pay-strip-icon" aria-hidden="true">
        <Icon size={17} />
      </span>
      <div className="pay-strip-body">
        <span className="pay-strip-method">
          {getMethodLabel(payment.method)}
        </span>
        <strong className="pay-strip-amount">
          {formatMoney(payment.amountFils, payment.currency)}
        </strong>
      </div>
      <span className={`pay-pill tone-${status.tone}`}>{t(status.label)}</span>
      {showTransfer && (
        <p className="pay-cliq-details">
          {t("Send {amount} by CliQ to", {
            amount: formatMoney(payment.amountFils, payment.currency),
          })}{" "}
          <strong dir="ltr">{payment.cliqAlias}</strong>
          {payment.cliqName && <> ({payment.cliqName})</>}.{" "}
          {t("The salon marks it as paid when the money arrives.")}
        </p>
      )}
      {(collectable || showReceipt || onChangeMethod) && (
        <div className="pay-strip-actions">
          {collectable && (
            <button
              className="btn btn-primary btn-small"
              type="button"
              onClick={onCollect}
              disabled={collecting}
            >
              {cliq ? (
                <Smartphone size={16} aria-hidden="true" />
              ) : (
                <HandCoins size={16} aria-hidden="true" />
              )}
              {cliq ? t("Paid by CliQ") : t("Cash received")}
            </button>
          )}
          {onChangeMethod && (
            <button
              className="btn btn-secondary btn-small"
              type="button"
              onClick={onChangeMethod}
            >
              <ArrowLeftRight size={16} aria-hidden="true" />
              {t("Change payment method")}
            </button>
          )}
          {showReceipt && (
            <button
              className="btn btn-secondary btn-small"
              type="button"
              onClick={onReceipt}
            >
              <ReceiptText size={16} aria-hidden="true" />
              {t("Receipt")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
