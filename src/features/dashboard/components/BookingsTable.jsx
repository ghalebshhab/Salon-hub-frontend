import { ChevronRight, ExternalLink, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { bookingStatus, initials } from "../model/dashboardModel.js";
import {
  BOOKING_FILTER_STATUSES,
  getOwnerStatusLook,
  money,
  paymentLabel,
} from "../model/dashboardFormat.js";
import OwnerStatusPill from "./OwnerStatusPill.jsx";

/** Rows shown here; the full list lives in booking management. */
const TABLE_LIMIT = 12;

export default function BookingsTable({
  bookings,
  query,
  statusFilter,
  showFilters,
  onQueryChange,
  onFilterChange,
  onToggleFilters,
  onSelectBooking,
  onClear,
}) {
  const filtered = bookings.filter((booking) => {
    const status = bookingStatus(booking);
    const matchesStatus = statusFilter === "ALL" || status === statusFilter;
    const haystack = [
      booking.id,
      booking.customerName,
      booking.customerEmail,
      booking.customerPhoneNumber,
      booking.assignedEmployeeName,
    ]
      .join(" ")
      .toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  });
  return (
    <section className="owner-panel owner-bookings">
      <div className="owner-panel-heading owner-bookings-heading">
        <div>
          <span className="eyebrow">Operations</span>
          <h2>Bookings in this period</h2>
          <p>Newest first. Select a row to see the details.</p>
        </div>
        <Link className="text-link" to="/owner/bookings">
          View all <ExternalLink size={14} />
        </Link>
      </div>
      <div className="owner-toolbar">
        <div className="owner-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search bookings"
            placeholder="Search customer, booking, employee"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
        <button
          className="owner-filter-button"
          type="button"
          aria-expanded={showFilters}
          onClick={onToggleFilters}
        >
          <Filter size={15} aria-hidden="true" />
          Filters
        </button>
        {showFilters && (
          <select
            className="owner-filter-select"
            value={statusFilter}
            onChange={(event) => onFilterChange(event.target.value)}
            aria-label="Booking status filter"
          >
            <option value="ALL">All statuses</option>
            {BOOKING_FILTER_STATUSES.map((item) => (
              <option value={item} key={item}>
                {getOwnerStatusLook(item).label}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="owner-table-wrap">
        <table className="owner-table">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Customer</th>
              <th>Appointment</th>
              <th>Assigned employee</th>
              <th>Status</th>
              <th>Booking value</th>
              <th>Rating</th>
              <th>
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, TABLE_LIMIT).map((booking) => (
              <tr key={booking.id} onClick={() => onSelectBooking(booking)}>
                <td>
                  <strong>#{booking.id}</strong>
                  <small>
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleDateString()
                      : "—"}
                  </small>
                </td>
                <td>
                  <div className="table-person">
                    <span className="owner-avatar">
                      {initials(booking.customerName)}
                    </span>
                    <span>
                      <strong>{booking.customerName || "Customer"}</strong>
                      <small>
                        {booking.customerEmail || booking.customerPhoneNumber}
                      </small>
                    </span>
                  </div>
                </td>
                <td>
                  <strong>
                    {booking.bookingDate} ·{" "}
                    {String(booking.bookingTime).slice(0, 5)}
                  </strong>
                  <small>
                    {(booking.services || [])
                      .map((service) => service.name)
                      .join(", ")}{" "}
                    · {booking.totalDurationMinutes} min
                  </small>
                </td>
                <td>{booking.assignedEmployeeName || "Unassigned"}</td>
                <td>
                  <OwnerStatusPill status={bookingStatus(booking)} />
                </td>
                <td>
                  <strong>{money(booking.totalPrice)}</strong>
                  <small>{paymentLabel(booking.payment)}</small>
                </td>
                <td>{booking.rating || "—"}</td>
                <td>
                  <button
                    className="owner-row-button"
                    type="button"
                    aria-label={`Open booking #${booking.id}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectBooking(booking);
                    }}
                  >
                    <ChevronRight size={17} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > TABLE_LIMIT && (
        <p className="owner-table-more">
          Showing {TABLE_LIMIT} of {filtered.length} bookings.{" "}
          <Link className="text-link" to="/owner/bookings">
            See all in booking management
          </Link>
        </p>
      )}
      {!filtered.length && (
        <div className="owner-empty">
          <Search size={24} aria-hidden="true" />
          {bookings.length ? (
            <>
              <strong>No bookings match these filters.</strong>
              <button className="text-link" type="button" onClick={onClear}>
                Clear filters
              </button>
            </>
          ) : (
            <strong>No bookings in this period.</strong>
          )}
        </div>
      )}
    </section>
  );
}
