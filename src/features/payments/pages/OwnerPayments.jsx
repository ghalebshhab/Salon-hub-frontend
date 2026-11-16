import {
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  HandCoins,
  Percent,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import CashReceivedDialog from "../components/CashReceivedDialog.jsx";
import PaymentSettingsPanel from "../components/PaymentSettingsPanel.jsx";
import useOwnerPayments from "../hooks/useOwnerPayments.js";
import {
  REPORT_PERIODS,
  formatMoney,
  formatRate,
} from "../model/payment.js";

function Kpi({ icon: Icon, label, value, detail, tone = "", featured = false }) {
  return (
    <article className={`pay-kpi ${featured ? "is-featured" : ""} ${tone}`}>
      <span className="pay-kpi-icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <span className="pay-kpi-label">{label}</span>
      <strong className="pay-kpi-value">{value}</strong>
      {detail && <small className="pay-kpi-detail">{detail}</small>}
    </article>
  );
}

function KpiSkeleton() {
  return (
    <div className="pay-kpis" aria-busy="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className="skeleton-block pay-kpi-skeleton" />
      ))}
    </div>
  );
}

export default function OwnerPayments() {
  const {
    salon,
    period,
    setPeriod,
    range,
    summary,
    summaryLoading,
    summaryRefreshing,
    summaryError,
    outstanding,
    outstandingLoading,
    page,
    setPage,
    hasNextPage,
    cash,
    refresh,
  } = useOwnerPayments();
  const currency = summary?.currency || "JOD";

  return (
    <main className="container section pay-page">
      <header className="pay-page-head">
        <div>
          <span className="eyebrow">Money</span>
          <h1>Payments</h1>
          <p>
            What your salon received, what guests still owe, and how they can
            pay.
          </p>
        </div>
        <div className="pay-page-tools">
          <div className="pay-periods" role="group" aria-label="Period">
            {REPORT_PERIODS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={period === item.key ? "is-active" : ""}
                aria-pressed={period === item.key}
                onClick={() => setPeriod(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={refresh}
            aria-label="Refresh payments"
            disabled={summaryRefreshing}
          >
            <RefreshCw
              size={17}
              aria-hidden="true"
              className={summaryRefreshing ? "spin" : ""}
            />
          </button>
        </div>
      </header>

      <p className="pay-range">
        <CalendarDays size={15} aria-hidden="true" />
        {range.from === range.to ? range.from : `${range.from} → ${range.to}`}
      </p>

      {summaryLoading ? (
        <KpiSkeleton />
      ) : summaryError || !summary ? (
        <div className="empty-state">
          <Wallet size={28} aria-hidden="true" />
          <h3>Payments are not available</h3>
          <p>
            {summaryError?.response?.data?.message ||
              summaryError?.message ||
              "Payments show here when your salon is active and approved."}
          </p>
          <button className="btn btn-primary" type="button" onClick={refresh}>
            Try again
          </button>
        </div>
      ) : (
        <section className="pay-kpis" aria-label="Payment summary">
          <Kpi
            featured
            icon={CircleDollarSign}
            label="Collected"
            value={formatMoney(summary.collectedFils, currency)}
            detail={`${summary.paidCount} paid appointment${summary.paidCount === 1 ? "" : "s"}`}
          />
          <Kpi
            icon={Banknote}
            label="Cash"
            value={formatMoney(summary.cashFils, currency)}
          />
          <Kpi
            icon={CreditCard}
            label="Card"
            value={formatMoney(summary.cardFils, currency)}
            detail={summary.cardFils === 0 ? "Not connected yet" : null}
          />
          <Kpi
            icon={HandCoins}
            tone={summary.outstandingCount > 0 ? "tone-warning" : ""}
            label="Still unpaid"
            value={formatMoney(summary.outstandingFils, currency)}
            detail={`${summary.outstandingCount} finished appointment${summary.outstandingCount === 1 ? "" : "s"}, all time`}
          />
          <Kpi
            icon={Percent}
            label="Your net"
            value={formatMoney(summary.netFils, currency)}
            detail={`Commission ${formatRate(summary.commissionRateBps)} · refunds ${formatMoney(summary.refundedFils, currency)}`}
          />
        </section>
      )}

      <div className="pay-layout">
        <section className="pay-panel" aria-labelledby="pay-unpaid-title">
          <header className="pay-panel-head">
            <span className="pay-panel-icon is-warning" aria-hidden="true">
              <HandCoins size={18} />
            </span>
            <div>
              <h2 id="pay-unpaid-title">Finished but not paid</h2>
              <p>Confirm cash here when a guest pays after the visit.</p>
            </div>
          </header>

          {outstandingLoading ? (
            <div className="pay-panel-skeleton" aria-busy="true">
              <span className="skeleton-block" />
              <span className="skeleton-block" />
            </div>
          ) : outstanding.length === 0 ? (
            <div className="pay-empty">
              <strong>All settled</strong>
              <p>Every finished appointment is paid.</p>
            </div>
          ) : (
            <ul className="pay-unpaid-list">
              {outstanding.map((booking) => (
                <li key={booking.id}>
                  <div className="pay-unpaid-who">
                    <strong>{booking.customerName || "Guest"}</strong>
                    <small>
                      {booking.bookingDate} ·{" "}
                      {booking.bookingTime?.toString().slice(0, 5)}
                      {booking.assignedEmployeeName
                        ? ` · ${booking.assignedEmployeeName}`
                        : ""}
                    </small>
                  </div>
                  <span className="pay-unpaid-amount">
                    {formatMoney(booking.payment?.amountFils, currency)}
                  </span>
                  <div className="pay-unpaid-actions">
                    <Link
                      className="btn btn-secondary btn-small"
                      to={`/owner/bookings?bookingId=${booking.id}`}
                    >
                      Open
                    </Link>
                    {booking.payment?.collectable && (
                      <button
                        className="btn btn-primary btn-small"
                        type="button"
                        onClick={() => cash.request(booking)}
                      >
                        <HandCoins size={15} aria-hidden="true" />
                        Cash received
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {(page > 0 || hasNextPage) && (
            <nav className="pay-pager" aria-label="Unpaid pages">
              <button
                className="icon-button"
                type="button"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={17} aria-hidden="true" />
              </button>
              <span>Page {page + 1}</span>
              <button
                className="icon-button"
                type="button"
                disabled={!hasNextPage}
                onClick={() => setPage(page + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={17} aria-hidden="true" />
              </button>
            </nav>
          )}
        </section>

        {salon?.id ? (
          <PaymentSettingsPanel salonId={salon.id} />
        ) : (
          <section className="pay-panel">
            <div className="pay-panel-skeleton" aria-busy="true">
              <span className="skeleton-block" />
              <span className="skeleton-block" />
            </div>
          </section>
        )}
      </div>

      <CashReceivedDialog
        booking={cash.target}
        saving={cash.saving}
        onConfirm={cash.confirm}
        onCancel={cash.cancel}
      />
    </main>
  );
}
