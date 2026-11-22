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
import t from "../../../shared/i18n/t.js";
import { serviceName } from "../../services/model/serviceText.js";
import { dateLocale } from "../../../shared/i18n/language.js";

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
          <span className="eyebrow">{t("Operations")}</span>
          <h2>{t("Bookings in this period")}</h2>
          <p>{t("Newest first. Select a row to see the details.")}</p>
        </div>
        <Link className="text-link" to="/owner/bookings">
          {t("View all")} <ExternalLink size={14} />
        </Link>
      </div>
      <div className="owner-toolbar">
        <div className="owner-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            aria-label={t("Search bookings")}
            placeholder={t("Search customer, booking, employee")}
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
          {t("Filters")}
        </button>
        {showFilters && (
          <select
            className="owner-filter-select"
            value={statusFilter}
            onChange={(event) => onFilterChange(event.target.value)}
            aria-label={t("Booking status filter")}
          >
            <option value="ALL">{t("All statuses")}</option>
            {BOOKING_FILTER_STATUSES.map((item) => (
              <option value={item} key={item}>
                {t(getOwnerStatusLook(item).label)}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="owner-table-wrap">
        <table className="owner-table">
          <thead>
            <tr>
              <th>{t("Booking")}</th>
              <th>{t("Customer")}</th>
              <th>{t("Appointment")}</th>
              <th>{t("Assigned employee")}</th>
              <th>{t("Status")}</th>
              <th>{t("Booking value")}</th>
              <th>{t("Rating")}</th>
              <th>
                <span className="sr-only">{t("Details")}</span>
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
                      ? new Date(booking.createdAt).toLocaleDateString(
                          dateLocale(),
                        )
                      : "—"}
                  </small>
                </td>
                <td>
                  <div className="table-person">
                    <span className="owner-avatar">
                      {initials(booking.customerName)}
                    </span>
                    <span>
                      <strong>{booking.customerName || t("Customer")}</strong>
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
                    {(booking.services || []).map(serviceName).join(", ")}
                    {t("· {totalDurationMinutes} min", {
                      totalDurationMinutes: booking.totalDurationMinutes,
                    })}
                  </small>
                </td>
                <td>{booking.assignedEmployeeName || t("Unassigned")}</td>
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
                    aria-label={t("Open booking #{id}", { id: booking.id })}
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
          {t("Showing {TABLE_LIMIT} of {length} bookings.", {
            TABLE_LIMIT,
            length: filtered.length,
          })}
          <Link className="text-link" to="/owner/bookings">
            {t("See all in booking management")}
          </Link>
        </p>
      )}
      {!filtered.length && (
        <div className="owner-empty">
          <Search size={24} aria-hidden="true" />
          {bookings.length ? (
            <>
              <strong>{t("No bookings match these filters.")}</strong>
              <button className="text-link" type="button" onClick={onClear}>
                {t("Clear filters")}
              </button>
            </>
          ) : (
            <strong>{t("No bookings in this period.")}</strong>
          )}
        </div>
      )}
    </section>
  );
}
