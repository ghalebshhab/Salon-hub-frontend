import { ArrowRight, Flame, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../payments/model/payment.js";
import t from "../../../shared/i18n/t.js";

/** Jordan's week starts on Saturday. ISO weekday numbers: 1 Monday … 7 Sunday. */
const WEEK = [
  [6, "Sat"],
  [7, "Sun"],
  [1, "Mon"],
  [2, "Tue"],
  [3, "Wed"],
  [4, "Thu"],
  [5, "Fri"],
];
const DEFAULT_FIRST_HOUR = 9;
const DEFAULT_LAST_HOUR = 21;

const hourLabel = (hour) => `${String(hour).padStart(2, "0")}:00`;

function BusyHours({ points }) {
  const counts = new Map(
    points.map((point) => [`${point.dayOfWeek}-${point.hour}`, point.bookings]),
  );
  const hours = points.map((point) => point.hour);
  const first = Math.min(DEFAULT_FIRST_HOUR, ...hours);
  const last = Math.max(DEFAULT_LAST_HOUR, ...hours);
  const columns = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const max = Math.max(1, ...points.map((point) => point.bookings));
  const busiest = points.reduce(
    (top, point) => (point.bookings > (top?.bookings || 0) ? point : top),
    null,
  );
  const busiestDay = t(WEEK.find(([day]) => day === busiest?.dayOfWeek)?.[1]);

  return (
    <article className="owner-panel owner-busy-hours">
      <div className="owner-panel-heading">
        <div>
          <span className="eyebrow">{t("Busy hours")}</span>
          <h2>{t("When customers come")}</h2>
          <p>
            {busiest
              ? t(
                  "Busiest time: {busiestDay} at {value}, {bookings} {value2}.",
                  {
                    busiestDay,
                    value: hourLabel(busiest.hour),
                    bookings: busiest.bookings,
                    value2: busiest.bookings === 1 ? t("visit") : t("visits"),
                  },
                )
              : t("Confirmed and completed visits by day and start hour.")}
          </p>
        </div>
        <Flame size={18} aria-hidden="true" />
      </div>
      {points.length ? (
        <div className="busy-scroll">
          <table className="busy-table">
            <caption className="sr-only">
              {t("Number of visits by weekday and start hour")}
            </caption>
            <thead>
              <tr>
                <td />
                {columns.map((hour) => (
                  <th scope="col" key={hour}>
                    {String(hour).padStart(2, "0")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEEK.map(([day, label]) => (
                <tr key={day}>
                  <th scope="row">{t(label)}</th>
                  {columns.map((hour) => {
                    const count = counts.get(`${day}-${hour}`) || 0;
                    const level = count ? Math.ceil((count / max) * 4) : 0;
                    return (
                      <td
                        key={hour}
                        className={`busy-cell level-${level}`}
                        title={`${t(label)} ${hourLabel(hour)}: ${count} ${count === 1 ? t("visit") : t("visits")}`}
                      >
                        <span className="sr-only">{count}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="busy-legend" aria-hidden="true">
            <span>{t("Quiet")}</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <i className={`busy-cell level-${level}`} key={level} />
            ))}
            <span>{t("Busy")}</span>
          </div>
        </div>
      ) : (
        <p className="owner-panel-empty">
          {t(
            "Busy hours show here after customers book visits in this period.",
          )}
        </p>
      )}
    </article>
  );
}

function PaymentHealth({ payments, currency }) {
  const total = payments.paidFils + payments.unpaidFils;
  const paidShare = total ? Math.round((payments.paidFils / total) * 100) : 0;
  return (
    <article className="owner-panel owner-payment-health">
      <div className="owner-panel-heading">
        <div>
          <span className="eyebrow">{t("Payments")}</span>
          <h2>{t("Completed visits")}</h2>
          <p>{t("Money received and money still open for this period.")}</p>
        </div>
      </div>
      {total ? (
        <>
          <div
            className="pay-split"
            role="meter"
            aria-label={t("Share of completed visit value that is paid")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={paidShare}
          >
            <span style={{ width: `${paidShare}%` }} />
          </div>
          <dl className="pay-split-list">
            <div>
              <dt>
                <i className="dot is-paid" aria-hidden="true" />
                {t("Paid")}
              </dt>
              <dd>
                {formatMoney(payments.paidFils, currency)}
                <small>
                  {t("{paidCount} visits", { paidCount: payments.paidCount })}
                </small>
              </dd>
            </div>
            <div>
              <dt>
                <i className="dot is-unpaid" aria-hidden="true" />
                {t("Not paid yet")}
              </dt>
              <dd>
                {formatMoney(payments.unpaidFils, currency)}
                <small>
                  {t("{unpaidCount} visits", {
                    unpaidCount: payments.unpaidCount,
                  })}
                </small>
              </dd>
            </div>
            {payments.refundedFils > 0 && (
              <div>
                <dt>{t("Refunded")}</dt>
                <dd>{formatMoney(payments.refundedFils, currency)}</dd>
              </div>
            )}
          </dl>
        </>
      ) : (
        <p className="owner-panel-empty">
          {t("No payment records for completed visits in this period.")}
        </p>
      )}
      <Link className="text-link owner-panel-link" to="/owner/payments">
        {t("Open payments")} <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </article>
  );
}

/** Shown in place of the insights when the salon's plan does not include them. */
function LockedInsights() {
  return (
    <section className="owner-panel owner-insights-locked">
      <Lock size={20} aria-hidden="true" />
      <div>
        <span className="eyebrow">{t("Pro and Business")}</span>
        <h2>{t("Busy hours, returning customers and payment health")}</h2>
        <p>
          {t(
            "See when customers come, how many come back and which visits are not paid yet. Upgrade your plan to turn on these insights.",
          )}
        </p>
        <Link className="btn btn-primary" to="/owner/plan">
          {t("See plans")} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

/** Server-counted insights: busy hours and the payment state of visits. */
export default function OwnerInsights({ insights }) {
  if (!insights) return null;
  if (!insights.advanced) return <LockedInsights />;
  return (
    <section className="owner-section-grid">
      <BusyHours points={insights.busyHours} />
      <PaymentHealth
        payments={insights.payments}
        currency={insights.currency}
      />
    </section>
  );
}
