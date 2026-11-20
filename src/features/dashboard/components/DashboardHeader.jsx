import { CalendarDays, Eye, RefreshCw, Settings2, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { DASHBOARD_RANGES, rangeAllowed } from "../model/dashboardModel.js";
import { greeting, timeLabel } from "../model/dashboardFormat.js";

export default function DashboardHeader({
  data,
  range,
  onRangeChange,
  historyDays = null,
  onRefresh,
  refreshing,
  workspaceActions = false,
}) {
  const firstName = data.profile?.firstName || "Owner";
  const salonName = data.salon?.name || data.salon?.salonName || "My salon";
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
          <span className="eyebrow">Salon workspace</span>
          <h1>
            {greeting()}, {firstName}
          </h1>
          <p>How your salon is doing: money, bookings, team and customers.</p>
        </div>
        <div className="owner-header-actions">
          {workspaceActions ? (
            <Link
              className="owner-select"
              to="/owner/my-salon"
              aria-label={`Open ${salonName} workspace`}
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
            aria-label="Date range"
            value={range}
            onChange={(event) => onRangeChange(event.target.value)}
          >
            {DASHBOARD_RANGES.map((item) => {
              // Ranges longer than the plan's history are shown but locked.
              const locked = !rangeAllowed(item.label, historyDays);
              return (
                <option key={item.key} value={item.label} disabled={locked}>
                  {locked ? `${item.label} (upgrade)` : item.label}
                </option>
              );
            })}
          </select>
          {publicSalonPath ? (
            <Link className="btn btn-primary" to={publicSalonPath}>
              <Eye size={16} aria-hidden="true" />
              View public salon
            </Link>
          ) : (
            <Link className="btn btn-primary" to="/owner/my-salon">
              <Eye size={16} aria-hidden="true" />
              View salon
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
            ? `Open now${closeTime ? ` · closes at ${closeTime}` : ""}`
            : "Salon is closed now"}
        </span>
        {updated && (
          <span aria-live="polite">
            {refreshing ? "Updating…" : `Updated at ${updated}`}
          </span>
        )}
        <button
          className={`owner-icon-button ${refreshing ? "is-refreshing" : ""}`}
          type="button"
          title="Refresh dashboard"
          aria-label="Refresh dashboard"
          disabled={refreshing}
          onClick={onRefresh}
        >
          <RefreshCw size={15} aria-hidden="true" />
        </button>
        <Link
          className="owner-icon-button"
          title="Manage salon"
          aria-label="Manage salon"
          to="/owner/my-salon/edit"
        >
          <Settings2 size={15} aria-hidden="true" />
        </Link>
        {workspaceActions && (
          <Link
            className="owner-icon-button"
            title="Manage bookings"
            aria-label="Manage bookings"
            to="/owner/bookings"
          >
            <CalendarDays size={15} aria-hidden="true" />
          </Link>
        )}
      </div>
    </>
  );
}
