import { ExternalLink, Filter, MoreHorizontal, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { bookingStatus, initials } from "../model/dashboardModel.js";
import { dashboardStatusClass, money } from "../model/dashboardFormat.js";

export default function BookingsTable({ bookings, query, statusFilter, showFilters, onQueryChange, onFilterChange, onToggleFilters, onSelectBooking, onClear }) {
  const filtered = bookings.filter((booking) => {
    const status = bookingStatus(booking);
    const matchesStatus = statusFilter === "ALL" || status === statusFilter;
    const haystack = [booking.id, booking.customerName, booking.customerEmail, booking.customerPhoneNumber, booking.assignedEmployeeName].join(" ").toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  });
  return (
    <section className="owner-panel owner-bookings">
      <div className="owner-panel-heading owner-bookings-heading"><div><span className="eyebrow">Operations</span><h2>Recent bookings</h2><p>Customers, assigned employees, ratings, and completed booking value.</p></div><Link className="text-link" to="/owner/bookings">View all <ExternalLink size={14} /></Link></div>
      <div className="owner-toolbar"><div className="owner-search"><Search size={16} /><input aria-label="Search bookings" placeholder="Search customer, booking, employee" value={query} onChange={(event) => onQueryChange(event.target.value)} /></div><button className="owner-filter-button" type="button" onClick={onToggleFilters}><Filter size={15} />Filters</button>{showFilters && <select className="owner-filter-select" value={statusFilter} onChange={(event) => onFilterChange(event.target.value)} aria-label="Booking status filter">{["ALL", "PENDING", "ACCEPTED", "COMPLETED", "CANCELLED", "REJECTED"].map((item) => <option value={item} key={item}>{item === "ALL" ? "All statuses" : item}</option>)}</select>}</div>
      <div className="owner-table-wrap"><table className="owner-table"><thead><tr><th>Booking</th><th>Customer</th><th>Appointment</th><th>Assigned employee</th><th>Status</th><th>Booking value</th><th>Rating</th><th /></tr></thead><tbody>{filtered.slice(0, 12).map((booking) => <tr key={booking.id} onClick={() => onSelectBooking(booking)}><td><strong>#{booking.id}</strong><small>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "—"}</small></td><td><div className="table-person"><span className="owner-avatar">{initials(booking.customerName)}</span><span><strong>{booking.customerName || "Customer"}</strong><small>{booking.customerEmail || booking.customerPhoneNumber}</small></span></div></td><td><strong>{booking.bookingDate} · {String(booking.bookingTime).slice(0, 5)}</strong><small>{(booking.services || []).map((service) => service.name).join(", ")} · {booking.totalDurationMinutes} min</small></td><td>{booking.assignedEmployeeName || "Unassigned"}</td><td><span className={dashboardStatusClass(bookingStatus(booking))}>{bookingStatus(booking)}</span></td><td><strong>{money(booking.totalPrice)}</strong><small>Payment not tracked</small></td><td>{booking.rating || "—"}</td><td><MoreHorizontal size={17} /></td></tr>)}</tbody></table></div>
      {!filtered.length && <div className="owner-empty"><Search size={24} /><strong>No bookings match these filters.</strong><button className="text-link" type="button" onClick={onClear}>Clear filters</button></div>}
    </section>
  );
}



