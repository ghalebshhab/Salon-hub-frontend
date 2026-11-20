/** Placeholder blocks in the dashboard's own layout, so nothing jumps on load. */
export default function OwnerDashboardSkeleton() {
  return (
    <main className="owner-dashboard-page">
      <div
        className="owner-dashboard-shell"
        aria-busy="true"
        aria-label="Loading your salon dashboard"
      >
        <div className="owner-skeleton owner-skel-heading" />
        <div className="owner-stats-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="owner-skeleton owner-skel-card" key={index} />
          ))}
        </div>
        <div className="owner-section-grid">
          <div className="owner-skeleton owner-skel-panel" />
          <div className="owner-skeleton owner-skel-panel" />
        </div>
        <div className="owner-skeleton owner-skel-table" />
      </div>
    </main>
  );
}
