import { ChevronDown, Eye, RefreshCw, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardHeader({ data, range, onRangeChange, onRefresh, refreshing }) {
  const firstName = data.profile?.firstName || "Owner";
  const salonName = data.salon?.name || data.salon?.salonName || "My salon";
  const isOpen = String(data.salon?.state || data.salon?.openningStatus).toUpperCase() === "OPEN";
  return (
    <>
      <header className="owner-dashboard-header">
        <div>
          <span className="eyebrow">Salon workspace</span>
          <h1>Good morning, {firstName}</h1>
          <p>One calm view of your salon&apos;s performance, people, and customer experience.</p>
        </div>
        <div className="owner-header-actions">
          <button className="owner-select" type="button"><span className="owner-live-dot" />{salonName}<ChevronDown size={15} /></button>
          <select aria-label="Date range" value={range} onChange={(event) => onRangeChange(event.target.value)}>
            {["Today", "Last 7 days", "Last 30 days", "This month"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <Link className="btn btn-primary" to="/owner/my-salon"><Eye size={16} />View salon</Link>
        </div>
      </header>
      <div className="owner-meta-row">
        <span><span className="owner-open-dot" />{isOpen ? `Open now · closes at ${String(data.salon?.closeTime || "").slice(0, 5)}` : "Salon currently closed"}</span>
        <span>Live backend data</span>
        <button className="owner-icon-button" type="button" title="Refresh dashboard" aria-label="Refresh dashboard" disabled={refreshing} onClick={onRefresh}><RefreshCw size={15} /></button>
        <Link className="owner-icon-button" title="Manage salon" aria-label="Manage salon" to="/owner/my-salon/edit"><Settings2 size={15} /></Link>
      </div>
    </>
  );
}
