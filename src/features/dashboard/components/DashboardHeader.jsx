import {
  CalendarDays,
  ExternalLink,
  RefreshCw,
  Settings2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardHeader({
  data,
  range,
  onRangeChange,
  onRefresh,
  refreshing,
  workspaceActions = false,
}) {
  const firstName = data.profile?.firstName || "Owner";
  const salonName = data.salon?.name || data.salon?.salonName || "My salon";
  const salonId = data.salon?.salonId ?? data.salon?.id;
  const publicSalonPath = salonId ? `/salons/${salonId}` : "/owner/my-salon";
  const isOpen = String(data.salon?.state || data.salon?.openningStatus).toUpperCase() === "OPEN";
  const closingTime = data.salon?.closeTime || data.salon?.closingTime || "";
  return (
    <>
      <header className="owner-dashboard-header">
        <div>
          <span className="eyebrow">{workspaceActions ? "Owner workspace" : "Salon workspace"}</span>
          <h1>Good morning, {firstName}</h1>
          <p>{workspaceActions ? "One calm view of your salon's performance, people, and next best actions." : "One calm view of your salon's performance, people, and customer experience."}</p>
        </div>
        <div className="owner-header-actions">
          {workspaceActions ? (
            <Link className="owner-select" to="/owner/my-salon" aria-label={`Open ${salonName} workspace`}><span className="owner-live-dot" />{salonName}</Link>
          ) : (
            <button className="owner-select" type="button"><span className="owner-live-dot" />{salonName}</button>
          )}
          <select aria-label="Date range" value={range} onChange={(event) => onRangeChange(event.target.value)}>
            {["Today", "Last 7 days", "Last 30 days", "This month"].map((item) => <option key={item}>{item}</option>)}
          </select>
          {workspaceActions ? (
            <>
              <Link className="btn btn-secondary" to={publicSalonPath}><ExternalLink size={15} />View public salon</Link>
              <Link className="btn btn-secondary" to="/owner/my-salon/edit"><Settings2 size={15} />Manage salon</Link>
              <Link className="btn btn-primary" to="/owner/bookings"><CalendarDays size={16} />Manage bookings</Link>
            </>
          ) : (
            <Link className="btn btn-primary" to="/owner/my-salon"><ExternalLink size={15} />View salon</Link>
          )}
        </div>
      </header>
      <div className="owner-meta-row">
        <span><span className="owner-open-dot" />{isOpen ? `Open now · closes at ${String(closingTime).slice(0, 5)}` : "Salon currently closed"}</span>
        <span>Live backend data</span>
        <button className={`owner-icon-button${refreshing ? " is-refreshing" : ""}`} type="button" title="Refresh dashboard" aria-label="Refresh dashboard" disabled={refreshing} onClick={onRefresh}><RefreshCw size={15} /></button>
        {!workspaceActions && <Link className="owner-icon-button" title="Manage salon" aria-label="Manage salon" to="/owner/my-salon/edit"><Settings2 size={15} /></Link>}
      </div>
    </>
  );
}
