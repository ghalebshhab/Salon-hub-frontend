import { CalendarDays, Eye, RefreshCw, Settings2, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { DASHBOARD_RANGES, rangeAllowed } from "../model/dashboardModel.js";
import { greeting, timeLabel } from "../model/dashboardFormat.js";
import t from "../../../shared/i18n/t.js";

export default function DashboardHeader({
  data,
  range,
  onRangeChange,
  historyDays = null,
  onRefresh,
  refreshing,
  workspaceActions = false,
  metaActions = null,
}) {
  const firstName = data.profile?.firstName || t("Owner");
  const salonName = data.salon?.name || data.salon?.salonName || t("My salon");
  const isOpen =
    String(data.salon?.state || data.salon?.openningStatus).toUpperCase() ===
    "OPEN";
  const closeTime = String(data.salon?.closeTime || "").slice(0, 5);
  const salonId = data.salon?.salonId ?? data.salon?.id;
  const publicSalonPath =
    workspaceActions && salonId != null ? `/salons/${salonId}` : null;
  const updated = timeLabel(data.fetchedAt);

  return (
    <>
      <header className="owner-dashboard-header">
        <div>
          <span className="eyebrow">{t("Salon workspace")}</span>
          <h1>
            {greeting()}, {firstName}
          </h1>
          <p>
            {t("How your salon is doing: money, bookings, team and customers.")}
          </p>
        </div>
        <div className="owner-header-actions">
          {workspaceActions ? (
            <Link
              className="owner-select"
              to="/owner/my-salon"
              aria-label={t("Open {salonName} workspace", { salonName })}
            >
              <Store size={15} aria-hidden="true" />
              {salonName}
            </Link>
          ) : (
            <span className="owner-select">
              <Store size={15} aria-hidden="true" />
              {salonName}
            </span>
          )}
          <select
            aria-label={t("Date range")}
            value={range}
            onChange={(event) => onRangeChange(event.target.value)}
          >
            {DASHBOARD_RANGES.map((item) => {
              // Ranges longer than the plan's history are shown but locked.
              const locked = !rangeAllowed(item.label, historyDays);
              return (
                <option key={item.key} value={item.label} disabled={locked}>
                  {locked
                    ? t("{label} (upgrade)", { label: t(item.label) })
                    : t(item.label)}
                </option>
              );
            })}
          </select>
          {publicSalonPath ? (
            <Link className="btn btn-primary" to={publicSalonPath}>
              <Eye size={16} aria-hidden="true" />
              {t("View public salon")}
            </Link>
          ) : (
            <Link className="btn btn-primary" to="/owner/my-salon">
              <Eye size={16} aria-hidden="true" />
              {t("View salon")}
            </Link>
          )}
        </div>
      </header>
      <div className="owner-meta-row">
        <span>
          <span
            className={`owner-open-dot ${isOpen ? "" : "is-closed"}`}
            aria-hidden="true"
          />
          {isOpen
            ? t("Open now{value}", {
                value: closeTime
                  ? t(" · closes at {closeTime}", { closeTime })
                  : "",
              })
            : t("Salon is closed now")}
        </span>
        {updated && (
          <span aria-live="polite">
            {refreshing
              ? t("Updating…")
              : t("Updated at {updated}", { updated })}
          </span>
        )}
        <button
          className={`owner-icon-button ${refreshing ? "is-refreshing" : ""}`}
          type="button"
          title={t("Refresh dashboard")}
          aria-label={t("Refresh dashboard")}
          disabled={refreshing}
          onClick={onRefresh}
        >
          <RefreshCw size={15} aria-hidden="true" />
        </button>
        <Link
          className="owner-icon-button"
          title={t("Manage salon")}
          aria-label={t("Manage salon")}
          to="/owner/my-salon/edit"
        >
          <Settings2 size={15} aria-hidden="true" />
        </Link>
        {workspaceActions && (
          <Link
            className="owner-icon-button"
            title={t("Manage bookings")}
            aria-label={t("Manage bookings")}
            to="/owner/bookings"
          >
            <CalendarDays size={15} aria-hidden="true" />
          </Link>
        )}
        {metaActions}
      </div>
    </>
  );
}
