import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import useAuth from "../../../shared/auth/useAuth.js";
import BookingsTable from "../components/BookingsTable.jsx";
import CustomerInsights from "../components/CustomerInsights.jsx";
import DashboardDrawers from "../components/DashboardDrawers.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import PerformancePanels from "../components/PerformancePanels.jsx";
import OwnerDashboardSkeleton from "../components/OwnerDashboardSkeleton.jsx";
import OwnerInsights from "../components/OwnerInsights.jsx";
import TeamPerformance from "../components/TeamPerformance.jsx";
import useOwnerDashboard from "../hooks/useOwnerDashboard.js";
import {
  DASHBOARD_RANGES,
  DEFAULT_RANGE,
  rangeAllowed,
} from "../model/dashboardModel.js";
import useMySubscription from "../../subscriptions/hooks/useMySubscription.js";
import PlanStatusBanner from "../../subscriptions/components/PlanStatusBanner.jsx";

export default function OwnerDashboard() {
  const { user } = useAuth();
  // The range lives in the URL, so a reload or a shared link keeps it.
  const [searchParams, setSearchParams] = useSearchParams();
  const range =
    DASHBOARD_RANGES.find((item) => item.key === searchParams.get("range"))
      ?.label || DEFAULT_RANGE;
  const setRange = (label) => {
    const key = DASHBOARD_RANGES.find((item) => item.label === label)?.key;
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params);
        if (!key || label === DEFAULT_RANGE) next.delete("range");
        else next.set("range", key);
        return next;
      },
      { replace: true },
    );
  };
  // The plan sets how far back the dashboard may look.
  const { data: subscription } = useMySubscription();
  const plan = subscription?.limits;
  const historyDays = plan?.analyticsMaxDays || null;
  const rangeLocked = !rangeAllowed(range, historyDays);
  useEffect(() => {
    if (rangeLocked) setRange(DEFAULT_RANGE);
    // setRange changes on every render; the lock is what matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeLocked]);
  const [chartMode, setChartMode] = useState("revenue");
  const [employeeSort, setEmployeeSort] = useState("Overall performance");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { data, loading, refreshing, error, refetch } = useOwnerDashboard(
    range,
    user,
  );

  if (!error && (loading || !data)) return <OwnerDashboardSkeleton />;
  if (error || !data) {
    const noSalon = error?.response?.status === 404;
    return (
      <section className="container section">
        <div className="empty-state">
          <Building2 size={30} aria-hidden="true" />
          <h1>
            {noSalon ? "Create your salon workspace" : "Dashboard unavailable"}
          </h1>
          <p>
            {noSalon
              ? "The owner dashboard becomes available after you create a salon."
              : error?.response?.data?.message ||
                error?.message ||
                "The dashboard data could not be loaded."}
          </p>
          {noSalon ? (
            <Link className="btn btn-primary" to="/owner/create-salon">
              Create salon
            </Link>
          ) : (
            <button className="btn btn-primary" type="button" onClick={refetch}>
              Try again
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <main className="owner-dashboard-page">
      <div className="owner-dashboard-shell">
        <DashboardHeader
          data={data}
          range={range}
          onRangeChange={setRange}
          historyDays={historyDays}
          onRefresh={refetch}
          refreshing={refreshing}
          workspaceActions
        />
        <PlanStatusBanner subscription={subscription} />
        <DashboardStats summary={data.summary} insights={data.insights} />
        <PerformancePanels
          data={data}
          range={range}
          chartMode={chartMode}
          onChartModeChange={setChartMode}
        />
        <OwnerInsights insights={data.insights} />
        <TeamPerformance
          employees={data.employees}
          sort={employeeSort}
          onSortChange={setEmployeeSort}
          onSelectEmployee={setSelectedEmployee}
        />
        <BookingsTable
          bookings={data.bookings}
          query={query}
          statusFilter={statusFilter}
          showFilters={showFilters}
          onQueryChange={setQuery}
          onFilterChange={setStatusFilter}
          onToggleFilters={() => setShowFilters((value) => !value)}
          onSelectBooking={setSelectedBooking}
          onClear={() => {
            setQuery("");
            setStatusFilter("ALL");
          }}
        />
        <CustomerInsights
          customers={data.customers}
          reviews={data.reviews}
          activity={data.activity}
        />
        <footer className="owner-dashboard-footer">
          <span>Only you can see this page.</span>
          <Link className="text-link" to="/owner/my-salon">
            Manage salon profile
          </Link>
        </footer>
      </div>
      <DashboardDrawers
        employee={selectedEmployee}
        booking={selectedBooking}
        onCloseEmployee={() => setSelectedEmployee(null)}
        onCloseBooking={() => setSelectedBooking(null)}
      />
    </main>
  );
}
