import useMyBookings from "../hooks/useMyBookings.js";

import { MessageSquareText } from "lucide-react";
import CreateReviewModal from "../../reviews/components/CreateReviewModal.jsx";
import { CalendarDays, Clock, MapPin, Phone, XCircle } from "lucide-react";

function MyBookings() {
  const {
    bookings,
    loading,
    handleCancel,
    reviewModalOpen,
    selectedReviewBooking,
    openReviewModal,
    closeReviewModal,
    handleReviewCreated,
    getStatusClass,
    canCancel,
  } = useMyBookings();

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">My appointments</span>
          <h1>My Bookings</h1>
          <p>Track your salon appointment requests and statuses.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>Go to any salon profile and book a service.</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-card-header">
                <div>
                  <h3>{booking.salonName}</h3>
                  <p>Booking #{booking.id}</p>
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
                <strong>Services:</strong>
                <div>
                  {booking.services?.map((service) => (
                    <span className="service-chip" key={service.id}>
                      {service.name} - {service.price} JD
                    </span>
                  ))}
                </div>
              </div>

              <div className="booking-summary-row">
                <span>Total Price: {booking.totalPrice} JD</span>
                <span>Total Duration: {booking.totalDurationMinutes} min</span>
              </div>

              {booking.note && (
                <p className="booking-note">
                  <strong>Your note:</strong> {booking.note}
                </p>
              )}

              {booking.ownerNote && (
                <p className="booking-note">
                  <strong>Owner note:</strong> {booking.ownerNote}
                </p>
              )}

              {booking.ownerSuggestedTime && (
                <p className="booking-note">
                  <strong>Suggested time:</strong>{" "}
                  {booking.ownerSuggestedTime?.toString().slice(0, 5)}
                </p>
              )}

              {canCancel(booking) && (
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleCancel(booking.id)}
                >
                  <XCircle size={16} />
                  Cancel Booking
                </button>
              )}

              {booking.status === "COMPLETED" && (
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => openReviewModal(booking)}
                >
                  <MessageSquareText size={16} />
                  Write Review
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {reviewModalOpen && (
        <CreateReviewModal
          booking={selectedReviewBooking}
          onClose={closeReviewModal}
          onReviewCreated={handleReviewCreated}
        />
      )}
    </section>
  );
}

export default MyBookings;
