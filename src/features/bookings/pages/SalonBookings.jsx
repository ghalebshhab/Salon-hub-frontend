import useSalonBookings from "../hooks/useSalonBookings.js";
import { canEmployeePerformServices } from "../model/booking.js";

import {
  CalendarDays,
  CalendarClock,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  XCircle,
  MessageSquareText,
  UserRound,
} from "lucide-react";

function getEligibleEmployees(booking, employees) {
  const serviceIds =
    booking.services?.map((service) => service.serviceId ?? service.id) || [];
  return employees.filter((employee) =>
    canEmployeePerformServices(employee, serviceIds),
  );
}

function SalonBookings() {
  const {
    bookings,
    employees,
    loading,
    rejectModalOpen,
    selectedBooking,
    rejectReason,
    setRejectReason,
    rejecting,
    assignmentBooking,
    replacementEmployeeId,
    setReplacementEmployeeId,
    assignmentNote,
    setAssignmentNote,
    assigning,
    openAssignment,
    closeAssignment,
    submitAssignment,
    handleAccept,
    openRejectModal,
    closeRejectModal,
    submitReject,
    handleComplete,
    rescheduleBooking,
    rescheduleDate,
    setRescheduleDate,
    rescheduleTime,
    setRescheduleTime,
    rescheduleNote,
    setRescheduleNote,
    rescheduleSlots,
    rescheduleLoading,
    rescheduleError,
    rescheduleSaving,
    openReschedule,
    closeReschedule,
    submitReschedule,
    getStatusClass,
  } = useSalonBookings();
  const replacementEmployees = assignmentBooking
    ? getEligibleEmployees(assignmentBooking, employees)
    : [];

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
          {bookings.map((booking) => {
            const eligibleEmployees = getEligibleEmployees(booking, employees);
            const pendingReschedule = booking.rescheduleProposals?.find(
              (proposal) => proposal.status === "PENDING",
            );
            return (
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
                      onChange={(e) => openAssignment(booking, e.target.value)}
                    >
                      <option value="">Assign employee</option>
                      {eligibleEmployees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.fullName} -{" "}
                          {employee.specialty || "Employee"}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="booking-summary-row">
                  <span>Total Price: {booking.totalPrice} JD</span>
                  <span>
                    Total Duration: {booking.totalDurationMinutes} min
                  </span>
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
                        {proposal.note && <p>{proposal.note}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {(booking.status === "PENDING" ||
                  booking.status === "ACCEPTED") && (
                  <button
                    className="btn btn-secondary btn-small"
                    type="button"
                    onClick={() => openReschedule(booking)}
                    disabled={Boolean(pendingReschedule)}
                  >
                    <CalendarClock size={16} />
                    {pendingReschedule
                      ? "Waiting for customer decision"
                      : "Propose new date and time"}
                  </button>
                )}

                {booking.status === "PENDING" && (
                  <div className="service-actions">
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => handleAccept(booking)}
                      disabled={Boolean(pendingReschedule)}
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
            );
          })}
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
              Let the customer know why this booking cannot be accepted.
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

      {rescheduleBooking && (
        <div className="reject-modal-overlay">
          <div className="reject-modal reschedule-modal">
            <button
              className="reject-modal-close"
              type="button"
              onClick={closeReschedule}
              aria-label="Close reschedule dialog"
            >
              ×
            </button>
            <div className="reject-modal-icon">
              <CalendarClock size={30} />
            </div>
            <span className="eyebrow">Reschedule appointment</span>
            <h2>Offer another available time</h2>
            <p className="reject-modal-subtitle">
              The original appointment stays unchanged until the customer
              accepts this proposal.
            </p>

            <div className="reject-booking-summary">
              <div>
                <strong>Current appointment</strong>
                <span>
                  {rescheduleBooking.bookingDate} •{" "}
                  {rescheduleBooking.bookingTime?.toString().slice(0, 5)}
                </span>
              </div>
              <div>
                <strong>Duration</strong>
                <span>{rescheduleBooking.totalDurationMinutes} minutes</span>
              </div>
            </div>

            <div className="reject-input-group">
              <label htmlFor="reschedule-date">New date</label>
              <input
                id="reschedule-date"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={rescheduleDate}
                onChange={(event) => setRescheduleDate(event.target.value)}
              />
            </div>

            <div className="reject-input-group">
              <label>Available times</label>
              {rescheduleLoading ? (
                <p className="booking-time-message">Loading available times…</p>
              ) : rescheduleError ? (
                <p className="booking-time-message error">{rescheduleError}</p>
              ) : rescheduleSlots.length === 0 ? (
                <p className="booking-time-message">
                  No other appointment time is available on this date.
                </p>
              ) : (
                <div className="booking-time-slots compact">
                  {rescheduleSlots.map((slot) => {
                    const time = slot.time?.toString().slice(0, 5);
                    return (
                      <button
                        className={`booking-time-slot ${rescheduleTime === time ? "selected" : ""}`}
                        key={time}
                        type="button"
                        onClick={() => setRescheduleTime(time)}
                      >
                        <strong>{time}</strong>
                        <span>
                          {slot.eligibleEmployees?.length || 0} employee
                          {slot.eligibleEmployees?.length === 1 ? "" : "s"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="reject-input-group">
              <label htmlFor="reschedule-note">Message to customer</label>
              <textarea
                id="reschedule-note"
                maxLength={1000}
                value={rescheduleNote}
                onChange={(event) => setRescheduleNote(event.target.value)}
                placeholder="Explain why you are offering another appointment time."
              />
            </div>

            <div className="reject-modal-actions">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={closeReschedule}
                disabled={rescheduleSaving}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={submitReschedule}
                disabled={rescheduleSaving || !rescheduleTime}
              >
                {rescheduleSaving ? "Sending…" : "Send proposal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {assignmentBooking && (
        <div className="reject-modal-overlay">
          <div className="reject-modal">
            <button
              className="reject-modal-close"
              type="button"
              onClick={closeAssignment}
              aria-label="Close reassignment dialog"
            >
              ×
            </button>
            <div className="reject-modal-icon">
              <UserRound size={30} />
            </div>
            <span className="eyebrow">Appointment update</span>
            <h2>Assign another employee</h2>
            <p className="reject-modal-subtitle">
              The customer will see this update with the new employee on their
              booking.
            </p>
            <div className="reject-input-group">
              <label htmlFor="replacement-employee">Available employee</label>
              <select
                id="replacement-employee"
                value={replacementEmployeeId}
                onChange={(event) =>
                  setReplacementEmployeeId(event.target.value)
                }
              >
                {replacementEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName} - {employee.specialty || "Employee"}
                  </option>
                ))}
              </select>
            </div>
            <div className="reject-input-group">
              <label htmlFor="assignment-customer-note">
                Update for the customer
              </label>
              <textarea
                id="assignment-customer-note"
                maxLength={1000}
                value={assignmentNote}
                onChange={(event) => setAssignmentNote(event.target.value)}
                placeholder="Explain that the selected employee is unavailable and who will take the appointment."
              />
            </div>
            <div className="reject-modal-actions">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={closeAssignment}
                disabled={assigning}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={submitAssignment}
                disabled={assigning || !replacementEmployeeId}
              >
                {assigning ? "Saving…" : "Assign and update customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SalonBookings;
