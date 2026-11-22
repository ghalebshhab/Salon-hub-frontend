import { Printer, ReceiptText, X } from "lucide-react";
import { useEffect, useId } from "react";
import useBookingReceipt from "../hooks/useBookingReceipt.js";
import {
  TRANSACTION_LABELS,
  formatMoney,
  getMethodLabel,
  getPaymentStatus,
} from "../model/payment.js";
import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";

const DATE_TIME = new Intl.DateTimeFormat(dateLocale(), {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const formatDateTime = (value) =>
  value ? DATE_TIME.format(new Date(value)) : "—";

/**
 * Paper-style receipt. Customers and employees see the lines and the total;
 * the owner also sees the commission, the net amount and the ledger.
 */
export default function ReceiptDialog({ bookingId, onClose }) {
  const id = useId();
  const { receipt, loading, error } = useBookingReceipt(bookingId);

  useEffect(() => {
    if (!bookingId) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bookingId, onClose]);

  if (!bookingId) return null;
  const status = receipt ? getPaymentStatus(receipt.status) : null;
  const currency = receipt?.currency;

  return (
    <div className="reject-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="receipt-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="receipt-toolbar no-print">
          <button
            className="icon-button"
            type="button"
            onClick={() => window.print()}
            aria-label={t("Print receipt")}
            disabled={!receipt}
          >
            <Printer size={17} aria-hidden="true" />
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label={t("Close receipt")}
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        {loading && (
          <div className="receipt-body" aria-busy="true">
            <span className="skeleton-block receipt-skeleton" />
            <span className="skeleton-block receipt-skeleton short" />
            <span className="skeleton-block receipt-skeleton" />
          </div>
        )}

        {!loading && error && (
          <div className="receipt-body">
            <h2 id={`${id}-title`}>{t("Receipt")}</h2>
            <p className="accept-warning" role="alert">
              {error}
            </p>
          </div>
        )}

        {!loading && receipt && (
          <div className="receipt-body">
            <header className="receipt-head">
              <ReceiptText size={22} aria-hidden="true" />
              <h2 id={`${id}-title`}>{receipt.salonName}</h2>
              <p>
                {receipt.receiptNumber
                  ? t("Receipt {receiptNumber}", {
                      receiptNumber: receipt.receiptNumber,
                    })
                  : t("Booking #{bookingId}", { bookingId: receipt.bookingId })}
              </p>
              <span className={`pay-pill tone-${status.tone}`}>
                {t(status.label)}
              </span>
            </header>

            <dl className="receipt-meta">
              <div>
                <dt>{t("Guest")}</dt>
                <dd>{receipt.customerName}</dd>
              </div>
              <div>
                <dt>{t("Appointment")}</dt>
                <dd>
                  {receipt.bookingDate} ·{" "}
                  {receipt.bookingTime?.toString().slice(0, 5)}
                </dd>
              </div>
              <div>
                <dt>{t("Method")}</dt>
                <dd>{getMethodLabel(receipt.method)}</dd>
              </div>
              {receipt.paidAt && (
                <div>
                  <dt>{t("Paid")}</dt>
                  <dd>{formatDateTime(receipt.paidAt)}</dd>
                </div>
              )}
              {receipt.confirmedByName && (
                <div>
                  <dt>{t("Received by")}</dt>
                  <dd>{receipt.confirmedByName}</dd>
                </div>
              )}
            </dl>

            <table className="receipt-lines">
              <caption className="sr-only">{t("Services")}</caption>
              <tbody>
                {receipt.lines.map((line, index) => (
                  <tr key={`${line.name}-${index}`}>
                    <th scope="row">
                      {line.name}
                      <small>
                        {t("{durationMinutes} min", {
                          durationMinutes: line.durationMinutes,
                        })}
                      </small>
                    </th>
                    <td>{formatMoney(line.amountFils, currency)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {receipt.refundedFils > 0 && (
                  <tr>
                    <th scope="row">{t("Refunded")}</th>
                    <td>−{formatMoney(receipt.refundedFils, currency)}</td>
                  </tr>
                )}
                <tr className="receipt-total">
                  <th scope="row">{t("Total")}</th>
                  <td>{formatMoney(receipt.amountFils, currency)}</td>
                </tr>
                {receipt.netFils !== null && receipt.netFils !== undefined && (
                  <>
                    <tr className="receipt-owner">
                      <th scope="row">{t("SalonHub commission")}</th>
                      <td>−{formatMoney(receipt.commissionFils, currency)}</td>
                    </tr>
                    <tr className="receipt-owner">
                      <th scope="row">{t("Your net")}</th>
                      <td>{formatMoney(receipt.netFils, currency)}</td>
                    </tr>
                  </>
                )}
              </tfoot>
            </table>

            {receipt.transactions?.length > 0 && (
              <section
                className="receipt-ledger"
                aria-label={t("Payment history")}
              >
                <h3>{t("History")}</h3>
                <ol>
                  {receipt.transactions.map((entry, index) => (
                    <li key={`${entry.type}-${index}`}>
                      <span>
                        <strong>
                          {TRANSACTION_LABELS[entry.type] || entry.type}
                        </strong>
                        <small>
                          {formatDateTime(entry.createdAt)} · {entry.actorName}
                        </small>
                        {entry.note && <small>{t(entry.note)}</small>}
                      </span>
                      {entry.amountFils > 0 && (
                        <em>{formatMoney(entry.amountFils, currency)}</em>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <p className="receipt-foot">{t("Thank you for visiting.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
