import useMyBookings from "../hooks/useMyBookings.js";

import { MessageSquareText } from "lucide-react";
import CreateReviewModal from "../../reviews/components/CreateReviewModal.jsx";
import {
  CalendarDays,
  CalendarClock,
  Clock,
  MapPin,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";

function MyBookings() {
  const {
    bookings,
    loading,
    handleCancel,
    handleRescheduleDecision,
    respondingProposalId,
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
          {bookings.map((booking) => {
            const pendingReschedule = booking.rescheduleProposals?.find(
              (proposal) => proposal.status === "PENDING",
            );
            return (
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

                {booking.status === "ACCEPTED" && (
                  <p className="booking-decision accepted">
                    The salon accepted your request. Your appointment is
                    confirmed.
                  </p>
                )}
                {booking.status === "REJECTED" && (
                  <p className="booking-decision rejected">
                    The salon could not accept this time. Check the salon’s note
                    below and choose another time if you’d like to try again.
                  </p>
                )}
                {booking.status === "PENDING" && (
                  <p className="booking-decision pending">
                    Your request was sent to the salon. We’ll show the decision
                    here.
                  </p>
                )}

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

                {booking.assignedEmployeeName && (
                  <p className="booking-note">
                    <UserRound size={15} />
                    <strong>Your service provider:</strong>{" "}
                    {booking.assignedEmployeeName}
                    {booking.assignedEmployeeSpecialty
                      ? ` • ${booking.assignedEmployeeSpecialty}`
                      : ""}
                  </p>
                )}

                <div className="booking-summary-row">
                  <span>Total Price: {booking.totalPrice} JD</span>
                  <span>
                    Total Duration: {booking.totalDurationMinutes} min
                  </span>
                </div>

                {booking.note && (
                  <p className="booking-note">
                    <strong>Your note:</strong> {booking.note}
                  </p>
                )}

                {booking.ownerNote && (
                  <p className="booking-note">
                    <strong>Update from the salon:</strong> {booking.ownerNote}
                  </p>
                )}

                {pendingReschedule && (
                  <div className="reschedule-decision-card">
                    <div>
                      <CalendarClock size={20} />
                      <div>
                        <strong>The salon proposed a new appointment</strong>
                        <p>
                          {pendingReschedule.proposedDate} •{" "}
                          {pendingReschedule.proposedTime
                            ?.toString()
                            .slice(0, 5)}
                        </p>
                      </div>
                    </div>
                    {pendingReschedule.note && <p>{pendingReschedule.note}</p>}
                    <small>
                      Your current appointment stays unchanged until you accept.
                    </small>
                    <div className="service-actions">
                      <button
                        className="btn btn-primary btn-small"
                        type="button"
                        disabled={respondingProposalId === pendingReschedule.id}
                        onClick={() =>
                          handleRescheduleDecision(
                            booking.id,
                            pendingReschedule.id,
                            true,
                          )
                        }
                      >
                        Accept new time
                      </button>
                      <button
                        className="btn btn-secondary btn-small"
                        type="button"
                        disabled={respondingProposalId === pendingReschedule.id}
                        onClick={() =>
                          handleRescheduleDecision(
                            booking.id,
                            pendingReschedule.id,
                            false,
                          )
                        }
                      >
                        Keep original time
                      </button>
                    </div>
                  </div>
                )}

                {booking.rescheduleProposals?.length > 0 && (
                  <div className="reschedule-history">
                    <strong>Reschedule history</strong>
                    {booking.rescheduleProposals.map((proposal) => (
                      <div
                        className="reschedule-history-item"
                        key={proposal.id}
                      >
                        <span>
                          {proposal.proposedDate} •{" "}
                          {proposal.proposedTime?.toString().slice(0, 5)}
                        </span>
                        <span
                          className={`reschedule-status ${proposal.status.toLowerCase()}`}
                        >
                          {proposal.status}
                        </span>
                      </div>
                    ))}
                  </div>
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
            );
          })}
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
