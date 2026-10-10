import useSalonBookings from "../hooks/useSalonBookings.js";

import {
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  XCircle,
  MessageSquareText,
  UserRound,
} from "lucide-react";

function SalonBookings() {
  const {
    bookings,
    employees,
    loading,
    rejectModalOpen,
    selectedBooking,
    rejectReason,
    setRejectReason,
    suggestedTime,
    setSuggestedTime,
    rejecting,
    handleAssignEmployee,
    handleAccept,
    openRejectModal,
    closeRejectModal,
    submitReject,
    handleComplete,
    getStatusClass,
  } = useSalonBookings();

  if (loading) {
    return <div className="loading">Loading salon bookings...</div>;
  }

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Salon appointments</span>
          <h1>Salon Bookings</h1>
          <p>
            Accept, reject, assign employee, or complete customer booking
            requests.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>When customers book your services, they will appear here.</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-card-header">
                <div>
                  <h3>{booking.customerName || "Customer"}</h3>
                  <p>{booking.customerEmail}</p>
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
                <strong>Requested services:</strong>
                <div>
                  {booking.services?.map((service) => (
                    <span className="service-chip" key={service.id}>
                      {service.name} - {service.price} JD
                    </span>
                  ))}
                </div>
              </div>

              <div className="booking-assigned-employee-box">
                <div>
                  <strong>
                    <UserRound size={15} />
                    Assigned employee
                  </strong>
                  <p>
                    {booking.assignedEmployeeName
                      ? `${booking.assignedEmployeeName} • ${
                          booking.assignedEmployeeSpecialty || "Employee"
                        }`
                      : "No employee assigned yet"}
                  </p>
                </div>

                {(booking.status === "PENDING" ||
                  booking.status === "ACCEPTED") && (
                  <select
                    value={booking.assignedEmployeeId || ""}
                    onChange={(e) =>
                      handleAssignEmployee(booking.id, e.target.value)
                    }
                  >
                    <option value="">Assign employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.fullName} - {employee.specialty || "Employee"}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="booking-summary-row">
                <span>Total Price: {booking.totalPrice} JD</span>
                <span>Total Duration: {booking.totalDurationMinutes} min</span>
              </div>

              {booking.note && (
                <p className="booking-note">
                  <strong>Customer note:</strong> {booking.note}
                </p>
              )}

              {booking.ownerNote && (
                <p className="booking-note">
                  <strong>Your note:</strong> {booking.ownerNote}
                </p>
              )}

              {booking.ownerSuggestedTime && (
                <p className="booking-note">
                  <strong>Suggested time:</strong>{" "}
                  {booking.ownerSuggestedTime?.toString().slice(0, 5)}
                </p>
              )}

              {booking.status === "PENDING" && (
                <div className="service-actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => handleAccept(booking)}
                  >
                    <CheckCircle size={16} />
                    Accept
                  </button>

                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => openRejectModal(booking)}
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              )}

              {booking.status === "ACCEPTED" && (
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => handleComplete(booking.id)}
                >
                  <CheckCircle size={16} />
                  Mark Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {rejectModalOpen && (
        <div className="reject-modal-overlay">
          <div className="reject-modal">
            <button className="reject-modal-close" onClick={closeRejectModal}>
              ×
            </button>

            <div className="reject-modal-icon">
              <MessageSquareText size={30} />
            </div>

            <span className="eyebrow">Reject appointment</span>

            <h2>Send a clear reason</h2>

            <p className="reject-modal-subtitle">
              Let the customer know why this booking cannot be accepted and
              suggest another available time.
            </p>

            <div className="reject-booking-summary">
              <div>
                <strong>Customer</strong>
                <span>
                  {selectedBooking?.customerName ||
                    selectedBooking?.customerEmail ||
                    "Customer"}
                </span>
              </div>

              <div>
                <strong>Requested time</strong>
                <span>
                  {selectedBooking?.bookingDate} •{" "}
                  {selectedBooking?.bookingTime?.toString().slice(0, 5)}
                </span>
              </div>
            </div>

            <div className="reject-input-group">
              <label>Reason of rejection</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Example: Sorry, this time is already full. Please choose another time."
              />
            </div>

            <div className="reject-input-group">
              <label>Suggest another time</label>
              <input
                type="time"
                value={suggestedTime}
                onChange={(e) => setSuggestedTime(e.target.value)}
              />
            </div>

            <div className="reject-modal-actions">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={closeRejectModal}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                type="button"
                onClick={submitReject}
                disabled={rejecting}
              >
                {rejecting ? "Sending..." : "Send Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SalonBookings;
