import { Banknote, CreditCard, HandCoins, ReceiptText } from "lucide-react";
import {
  formatMoney,
  getMethodLabel,
  getPaymentStatus,
  hasReceipt,
  isCardMethod,
} from "../model/payment.js";

/**
 * One payment line for a booking card: method, amount, status, and the
 * actions that fit the viewer. Renders nothing for bookings made before
 * payments existed.
 */
export default function PaymentStrip({
  payment,
  canCollect = false,
  collecting = false,
  onCollect,
  onReceipt,
}) {
  if (!payment) return null;
  const status = getPaymentStatus(payment.status);
  const Icon = isCardMethod(payment.method) ? CreditCard : Banknote;
  const collectable = canCollect && payment.collectable;

  return (
    <div className={`pay-strip tone-${status.tone}`}>
      <span className="pay-strip-icon" aria-hidden="true">
        <Icon size={17} />
      </span>
      <div className="pay-strip-body">
        <span className="pay-strip-method">{getMethodLabel(payment.method)}</span>
        <strong className="pay-strip-amount">
          {formatMoney(payment.amountFils, payment.currency)}
        </strong>
      </div>
      <span className={`pay-pill tone-${status.tone}`}>{status.label}</span>
      {(collectable || (onReceipt && hasReceipt(payment))) && (
        <div className="pay-strip-actions">
          {collectable && (
            <button
              className="btn btn-primary btn-small"
              type="button"
              onClick={onCollect}
              disabled={collecting}
            >
              <HandCoins size={16} aria-hidden="true" />
              Cash received
            </button>
          )}
          {onReceipt && hasReceipt(payment) && (
            <button
              className="btn btn-secondary btn-small"
              type="button"
              onClick={onReceipt}
            >
              <ReceiptText size={16} aria-hidden="true" />
              Receipt
            </button>
          )}
        </div>
      )}
    </div>
  );
}
