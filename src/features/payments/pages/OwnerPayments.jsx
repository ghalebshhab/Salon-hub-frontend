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
import { REPORT_PERIODS, formatMoney, formatRate } from "../model/payment.js";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function Kpi({
  icon: Icon,
  label,
  value,
  detail,
  tone = "",
  featured = false,
}) {
  return (
    <article className={`pay-kpi ${featured ? "is-featured" : ""} ${tone}`}>
      <span className="pay-kpi-icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <span className="pay-kpi-label">{t(label)}</span>
      <strong className="pay-kpi-value">{value}</strong>
      {detail && <small className="pay-kpi-detail">{t(detail)}</small>}
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
          <span className="eyebrow">{t(PAGE_HEADS.payments.eyebrow)}</span>
          <h1>{t(PAGE_HEADS.payments.title)}</h1>
          <p>{t(PAGE_HEADS.payments.text)}</p>
        </div>
        <div className="pay-page-tools">
          <div className="pay-periods" role="group" aria-label={t("Period")}>
            {REPORT_PERIODS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={period === item.key ? "is-active" : ""}
                aria-pressed={period === item.key}
                onClick={() => setPeriod(item.key)}
              >
                {t(item.label)}
              </button>
            ))}
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={refresh}
            aria-label={t("Refresh payments")}
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
          <h3>{t("Payments are not available")}</h3>
          <p>
            {summaryError?.response?.data?.message ||
              summaryError?.message ||
              t("Payments show here when your salon is active and approved.")}
          </p>
          <button className="btn btn-primary" type="button" onClick={refresh}>
            {t("Try again")}
          </button>
        </div>
      ) : (
        <section className="pay-kpis" aria-label={t("Payment summary")}>
          <Kpi
            featured
            icon={CircleDollarSign}
            label={t("Collected")}
            value={formatMoney(summary.collectedFils, currency)}
            detail={
              summary.paidCount === 1
                ? t("1 paid appointment")
                : t("{count} paid appointments", { count: summary.paidCount })
            }
          />
          <Kpi
            icon={Banknote}
            label={t("Cash")}
            value={formatMoney(summary.cashFils, currency)}
          />
          <Kpi
            icon={CreditCard}
            label={t("Card")}
            value={formatMoney(summary.cardFils, currency)}
            detail={summary.cardFils === 0 ? t("Not connected yet") : null}
          />
          <Kpi
            icon={HandCoins}
            tone={summary.outstandingCount > 0 ? "tone-warning" : ""}
            label={t("Still unpaid")}
            value={formatMoney(summary.outstandingFils, currency)}
            detail={
              summary.outstandingCount === 1
                ? t("1 finished appointment, all time")
                : t("{count} finished appointments, all time", {
                    count: summary.outstandingCount,
                  })
            }
          />
          <Kpi
            icon={Percent}
            label={t("Your net")}
            value={formatMoney(summary.netFils, currency)}
            detail={t("Commission {rate} · refunds {money}", {
              rate: formatRate(summary.commissionRateBps),
              money: formatMoney(summary.refundedFils, currency),
            })}
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
              <h2 id="pay-unpaid-title">{t("Finished but not paid")}</h2>
              <p>{t("Confirm cash here when a guest pays after the visit.")}</p>
            </div>
          </header>

          {outstandingLoading ? (
            <div className="pay-panel-skeleton" aria-busy="true">
              <span className="skeleton-block" />
              <span className="skeleton-block" />
            </div>
          ) : outstanding.length === 0 ? (
            <div className="pay-empty">
              <strong>{t("All settled")}</strong>
              <p>{t("Every finished appointment is paid.")}</p>
            </div>
          ) : (
            <ul className="pay-unpaid-list">
              {outstanding.map((booking) => (
                <li key={booking.id}>
                  <div className="pay-unpaid-who">
                    <strong>{booking.customerName || t("Guest")}</strong>
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
                      {t("Open")}
                    </Link>
                    {booking.payment?.collectable && (
                      <button
                        className="btn btn-primary btn-small"
                        type="button"
                        onClick={() => cash.request(booking)}
                      >
                        <HandCoins size={15} aria-hidden="true" />
                        {t("Cash received")}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {(page > 0 || hasNextPage) && (
            <nav className="pay-pager" aria-label={t("Unpaid pages")}>
              <button
                className="icon-button"
                type="button"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                aria-label={t("Previous page")}
              >
                <ChevronLeft size={17} aria-hidden="true" />
              </button>
              <span>
                {t("Page")} {page + 1}
              </span>
              <button
                className="icon-button"
                type="button"
                disabled={!hasNextPage}
                onClick={() => setPage(page + 1)}
                aria-label={t("Next page")}
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
