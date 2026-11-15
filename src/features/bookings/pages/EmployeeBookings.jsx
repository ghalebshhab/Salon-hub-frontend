import useEmployeeBookings from "../hooks/useEmployeeBookings.js";
import useHighlightedBooking from "../hooks/useHighlightedBooking.js";
import StaffLiveCard from "../components/live/StaffLiveCard.jsx";
import {
  formatDateLabel,
  formatDuration,
  getStatusLabel,
  getTodayDate,
  isLiveToday,
  toHourMinute,
} from "../model/booking.js";

import { CalendarDays, Clock, MapPin, Phone, Scissors } from "lucide-react";

function AppointmentCard({
  booking,
  getStatusClass,
  highlighted,
  onStatusChange,
}) {
  const live = isLiveToday(booking);
  return (
    <article
      id={`booking-${booking.id}`}
      className={`employee-booking-card ${highlighted ? "is-highlighted" : ""}`}
    >
      <div className="employee-booking-header">
        <div className="employee-booking-icon" aria-hidden="true">
          {(booking.customerName || "C").charAt(0).toUpperCase()}
        </div>
        <div>
          <h3>{booking.customerName || "Customer"}</h3>
          <p>
            {toHourMinute(booking.bookingTime)} ·{" "}
            {formatDuration(booking.totalDurationMinutes)}
          </p>
        </div>
        <span className={getStatusClass(booking.status)}>
          {getStatusLabel(booking.status)}
        </span>
      </div>

      {live && (
        <StaffLiveCard booking={booking} onStatusChange={onStatusChange} />
      )}

      <div className="booking-info-grid">
        <p>
          <CalendarDays size={16} aria-hidden="true" />
          {formatDateLabel(booking.bookingDate)}
        </p>
        <p>
          <Clock size={16} aria-hidden="true" />
          {toHourMinute(booking.bookingTime)}
        </p>
        <p>
          <Phone size={16} aria-hidden="true" />
          <a href={`tel:${booking.customerPhoneNumber}`}>
            {booking.customerPhoneNumber}
          </a>
        </p>
        <p>
          <MapPin size={16} aria-hidden="true" />
          {booking.customerLocation}
        </p>
      </div>

      <div className="booking-services">
        <strong>
          <Scissors size={16} aria-hidden="true" />
          Services
        </strong>
        <div>
          {booking.services?.map((service) => (
            <span className="service-chip" key={service.id}>
              {service.name} · {formatDuration(service.durationMinutes)}
            </span>
          ))}
        </div>
      </div>

      {booking.note && (
        <p className="booking-note">
          <strong>Customer note:</strong> {booking.note}
        </p>
      )}
      {booking.ownerNote && (
        <p className="booking-note">
          <strong>Owner note:</strong> {booking.ownerNote}
        </p>
      )}
    </article>
  );
}

function Group({ title, empty, bookings, ...cardProps }) {
  return (
    <section className="employee-agenda-group" aria-label={title}>
      <h2>
        {title} <span>{bookings.length}</span>
      </h2>
      {bookings.length === 0 ? (
        <p className="employee-agenda-empty">{empty}</p>
      ) : (
        <div className="employee-bookings-grid">
          {bookings.map((booking) => (
            <AppointmentCard
              key={booking.id}
              booking={booking}
              highlighted={cardProps.highlightedId === booking.id}
              getStatusClass={cardProps.getStatusClass}
              onStatusChange={cardProps.onStatusChange}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const ACTIVE = ["PENDING", "ACCEPTED", "IN_PROGRESS"];
const byTime = (a, b) =>
  `${a.bookingDate}T${a.bookingTime}`.localeCompare(
    `${b.bookingDate}T${b.bookingTime}`,
  );

function EmployeeBookings() {
  const { bookings, loading, refetch, getStatusClass } = useEmployeeBookings();
  const highlightedId = useHighlightedBooking(!loading);

  if (loading) {
    return <div className="loading">Loading your appointments...</div>;
  }

  const today = getTodayDate();
  const todays = bookings
    .filter((booking) => booking.bookingDate === today)
    .sort(byTime);
  const upcoming = bookings
    .filter(
      (booking) =>
        booking.bookingDate > today && ACTIVE.includes(booking.status),
    )
    .sort(byTime);
  const past = bookings
    .filter(
      (booking) => !todays.includes(booking) && !upcoming.includes(booking),
    )
    .sort((a, b) => byTime(b, a))
    .slice(0, 20);
  const cardProps = { getStatusClass, highlightedId, onStatusChange: refetch };

  return (
    <section className="container section employee-agenda">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Employee area</span>
          <h1>My appointments</h1>
          <p>
            See who is coming, follow their trip to the salon, and start or
            finish each service.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No assigned bookings yet</h3>
          <p>
            When the salon assigns you a booking, you get a notification and it
            appears here.
          </p>
        </div>
      ) : (
        <>
          <Group
            title="Today"
            empty="No appointments today."
            bookings={todays}
            {...cardProps}
          />
          <Group
            title="Upcoming"
            empty="Nothing scheduled after today."
            bookings={upcoming}
            {...cardProps}
          />
          <Group
            title="Earlier"
            empty="No earlier appointments."
            bookings={past}
            {...cardProps}
          />
        </>
      )}
    </section>
  );
}

export default EmployeeBookings;
