import { useMemo, useState } from "react";
import BookingsTable from "../dashboard/components/BookingsTable.jsx";
import CustomerInsights from "../dashboard/components/CustomerInsights.jsx";
import DashboardDrawers from "../dashboard/components/DashboardDrawers.jsx";
import DashboardHeader from "../dashboard/components/DashboardHeader.jsx";
import DashboardStats from "../dashboard/components/DashboardStats.jsx";
import PerformancePanels from "../dashboard/components/PerformancePanels.jsx";
import TeamPerformance from "../dashboard/components/TeamPerformance.jsx";
import { buildOwnerDashboard } from "../dashboard/model/dashboardModel.js";

function dateOffset(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createPrototypeData() {
  const services = [
    { id: 1, name: "Balayage & blowout", price: 85, durationMinutes: 135, isActive: true },
    { id: 2, name: "Cut & style", price: 38, durationMinutes: 90, isActive: true },
    { id: 3, name: "Gel manicure", price: 28, durationMinutes: 75, isActive: true },
    { id: 4, name: "Signature facial", price: 42, durationMinutes: 60, isActive: true },
  ];
  const employees = [
    { id: 501, fullName: "Maya Haddad", email: "maya@salonhub.demo", phoneNumber: "+962 79 410 3321", specialty: "Colorist & stylist", status: "ACTIVE", serviceNames: ["Balayage & blowout", "Cut & style"] },
    { id: 502, fullName: "Lina Saad", email: "lina@salonhub.demo", phoneNumber: "+962 79 511 2280", specialty: "Senior stylist", status: "ACTIVE", serviceNames: ["Cut & style", "Balayage & blowout"] },
    { id: 503, fullName: "Noor Khoury", email: "noor@salonhub.demo", phoneNumber: "+962 78 120 9942", specialty: "Nail artist", status: "ACTIVE", serviceNames: ["Gel manicure"] },
    { id: 504, fullName: "Sara Nasser", email: "sara@salonhub.demo", phoneNumber: "+962 77 610 1184", specialty: "Beauty therapist", status: "ACTIVE", serviceNames: ["Signature facial"] },
  ];
  const people = [
    [2101, 41, "Dana Al-Khatib", "dana@example.com", 501, "Maya Haddad", [services[0]], 85, "COMPLETED", -1],
    [2102, 42, "Leen Omar", "leen@example.com", 503, "Noor Khoury", [services[2]], 28, "ACCEPTED", 1],
    [2103, 43, "Yara Mansour", "yara@example.com", 504, "Sara Nasser", [services[3]], 42, "PENDING", 0],
    [2104, 44, "Mariam Taha", "mariam@example.com", 502, "Lina Saad", [services[1]], 38, "COMPLETED", -2],
    [2105, 45, "Hala Qasem", "hala@example.com", 501, "Maya Haddad", [services[0], services[1]], 123, "COMPLETED", -3],
    [2106, 46, "Nour Ababneh", "nour@example.com", 502, "Lina Saad", [services[1]], 38, "CANCELLED", -4],
    [2107, 41, "Dana Al-Khatib", "dana@example.com", 501, "Maya Haddad", [services[1]], 38, "COMPLETED", -5],
  ];
  const bookings = people.map(([id, customerId, customerName, email, employeeId, employeeName, bookingServices, totalPrice, status, day], index) => ({
    id,
    customerId,
    customerName,
    customerEmail: email,
    customerPhoneNumber: `+962 79 555 01${40 + index}`,
    bookingDate: dateOffset(day),
    bookingTime: `${String(10 + index).padStart(2, "0")}:30`,
    status,
    assignedEmployeeId: employeeId,
    assignedEmployeeName: employeeName,
    services: bookingServices,
    totalPrice,
    totalDurationMinutes: bookingServices.reduce((total, service) => total + service.durationMinutes, 0),
    createdAt: new Date(Date.now() - index * 3_600_000).toISOString(),
  }));
  const reviews = [
    { id: 801, bookingId: 2101, customerName: "Dana Al-Khatib", rating: 5, comment: "Maya understood exactly what I wanted. The result was beautiful.", createdAt: new Date().toISOString() },
    { id: 802, bookingId: 2104, customerName: "Mariam Taha", rating: 4, comment: "Lovely service and a very calm experience.", createdAt: new Date(Date.now() - 86_400_000).toISOString() },
    { id: 803, bookingId: 2105, customerName: "Hala Qasem", rating: 5, comment: "Excellent work and thoughtful recommendations.", createdAt: new Date(Date.now() - 172_800_000).toISOString() },
    { id: 804, bookingId: 2107, customerName: "Dana Al-Khatib", rating: 5, comment: "Consistently professional and friendly.", createdAt: new Date(Date.now() - 259_200_000).toISOString() },
  ];
  return {
    profile: { firstName: "Rania", lastName: "Haddad" },
    salon: { salonId: 1, name: "Maison Rose Salon", state: "OPEN", closeTime: "20:00" },
    services,
    employees,
    bookings,
    reviews,
    reviewSummary: { averageRating: 4.8, totalReviews: 238 },
  };
}

export default function OwnerDashboardPrototype({ onActivity }) {
  const raw = useMemo(() => createPrototypeData(), []);
  const [range, setRange] = useState("Last 7 days");
  const [chartMode, setChartMode] = useState("revenue");
  const [sort, setSort] = useState("Overall performance");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const data = useMemo(() => buildOwnerDashboard(raw, range), [raw, range]);

  return (
    <div className="prototype-owner-dashboard">
      <DashboardHeader data={data} range={range} onRangeChange={setRange} onRefresh={() => onActivity("Dashboard prototype refreshed from its local scenario data.")} refreshing={false} />
      <DashboardStats summary={data.summary} />
      <PerformancePanels data={data} range={range} chartMode={chartMode} onChartModeChange={setChartMode} />
      <TeamPerformance employees={data.employees} sort={sort} onSortChange={setSort} onSelectEmployee={setSelectedEmployee} />
      <BookingsTable bookings={data.bookings} query={query} statusFilter={statusFilter} showFilters={showFilters} onQueryChange={setQuery} onFilterChange={setStatusFilter} onToggleFilters={() => setShowFilters((value) => !value)} onSelectBooking={setSelectedBooking} onClear={() => { setQuery(""); setStatusFilter("ALL"); }} />
      <CustomerInsights customers={data.customers} reviews={data.reviews} />
      <DashboardDrawers employee={selectedEmployee} booking={selectedBooking} onCloseEmployee={() => setSelectedEmployee(null)} onCloseBooking={() => setSelectedBooking(null)} />
    </div>
  );
}
