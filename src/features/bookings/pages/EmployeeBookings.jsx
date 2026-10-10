import useEmployeeBookings from "../hooks/useEmployeeBookings.js";

import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Scissors,
  UserRound,
} from "lucide-react";

function EmployeeBookings() {
  const { bookings, loading, getStatusClass } = useEmployeeBookings();

  if (loading) {
    return <div className="loading">Loading your appointments...</div>;
  }

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Employee area</span>
          <h1>My Appointments</h1>
          <p>
            Bookings assigned to you by the salon owner or selected by
            customers.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No assigned bookings yet</h3>
          <p>When a booking is assigned to you, it will appear here.</p>
        </div>
      ) : (
        <div className="employee-bookings-grid">
          {bookings.map((booking) => (
            <div className="employee-booking-card" key={booking.id}>
              <div className="employee-booking-header">
                <div className="employee-booking-icon">
                  <UserRound size={22} />
                </div>

                <div>
                  <h3>{booking.customerName || "Customer"}</h3>
                  <p>{booking.salonName}</p>
                </div>

                <span className={getStatusClass(booking.status)}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-info-grid">
                <p>
                  <CalendarDays size={16} />
                  {booking.bookingDate}
                </p>

                <p>
                  <Clock size={16} />
                  {booking.bookingTime?.toString().slice(0, 5)}
                </p>

                <p>
                  <Phone size={16} />
                  {booking.customerPhoneNumber}
                </p>

                <p>
                  <MapPin size={16} />
                  {booking.customerLocation}
                </p>
              </div>

              <div className="booking-services">
                <strong>
                  <Scissors size={16} />
                  Services
                </strong>

                <div>
                  {booking.services?.map((service) => (
                    <span className="service-chip" key={service.id}>
                      {service.name} - {service.price} JD
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default EmployeeBookings;
