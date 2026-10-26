import { useState } from "react";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "../../../shared/components/Loading.jsx";
import useAuth from "../../../shared/auth/useAuth.js";
import BookingsTable from "../components/BookingsTable.jsx";
import CustomerInsights from "../components/CustomerInsights.jsx";
import DashboardDrawers from "../components/DashboardDrawers.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import PerformancePanels from "../components/PerformancePanels.jsx";
import TeamPerformance from "../components/TeamPerformance.jsx";
import useOwnerDashboard from "../hooks/useOwnerDashboard.js";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [range, setRange] = useState("Last 7 days");
  const [chartMode, setChartMode] = useState("revenue");
  const [employeeSort, setEmployeeSort] = useState("Overall performance");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { data, loading, error, refetch } = useOwnerDashboard(range, user);

  if (loading) return <Loading message="Preparing your salon dashboard…" />;
  if (error || !data) {
    const noSalon = error?.response?.status === 404;
    return (
      <section className="container section">
        <div className="empty-state">
          <Building2 size={30} />
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
          onRefresh={refetch}
          refreshing={loading}
        />
        <DashboardStats summary={data.summary} />
        <PerformancePanels
          data={data}
          range={range}
          chartMode={chartMode}
          onChartModeChange={setChartMode}
        />
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
        <CustomerInsights customers={data.customers} reviews={data.reviews} />
        <footer className="owner-dashboard-footer">
          <span>Salon workspace · private to authenticated owners</span>
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
