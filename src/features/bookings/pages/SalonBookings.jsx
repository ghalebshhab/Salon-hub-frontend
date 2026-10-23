import AssignEmployeeDialog from "../components/AssignEmployeeDialog.jsx";
import RejectBookingDialog from "../components/RejectBookingDialog.jsx";
import RescheduleBookingDialog from "../components/RescheduleBookingDialog.jsx";
import SalonBookingCard from "../components/SalonBookingCard.jsx";
import useSalonBookings from "../hooks/useSalonBookings.js";
import { getEligibleEmployees } from "../model/booking.js";

function SalonBookings() {
  const manager = useSalonBookings();

  if (manager.loading) {
    return <div className="loading">Loading salon bookings...</div>;
  }

  const replacementEmployees = manager.assignmentBooking
    ? getEligibleEmployees(manager.assignmentBooking, manager.employees)
    : [];

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

      {manager.bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>When customers book your services, they will appear here.</p>
        </div>
      ) : (
        <div className="booking-list">
          {manager.bookings.map((booking) => (
            <SalonBookingCard
              booking={booking}
              eligibleEmployees={getEligibleEmployees(
                booking,
                manager.employees,
              )}
              statusClass={manager.getStatusClass(booking.status)}
              onAccept={manager.handleAccept}
              onAssign={manager.openAssignment}
              onComplete={manager.handleComplete}
              onReject={manager.openRejectModal}
              onReschedule={manager.openReschedule}
              key={booking.id}
            />
          ))}
        </div>
      )}

      {manager.rejectModalOpen && (
        <RejectBookingDialog
          booking={manager.selectedBooking}
          reason={manager.rejectReason}
          rejecting={manager.rejecting}
          onReasonChange={manager.setRejectReason}
          onClose={manager.closeRejectModal}
          onSubmit={manager.submitReject}
        />
      )}

      {manager.rescheduleBooking && (
        <RescheduleBookingDialog
          booking={manager.rescheduleBooking}
          date={manager.rescheduleDate}
          time={manager.rescheduleTime}
          note={manager.rescheduleNote}
          slots={manager.rescheduleSlots}
          loading={manager.rescheduleLoading}
          error={manager.rescheduleError}
          saving={manager.rescheduleSaving}
          onDateChange={manager.setRescheduleDate}
          onTimeChange={manager.setRescheduleTime}
          onNoteChange={manager.setRescheduleNote}
          onClose={manager.closeReschedule}
          onSubmit={manager.submitReschedule}
        />
      )}

      {manager.assignmentBooking && (
        <AssignEmployeeDialog
          employees={replacementEmployees}
          employeeId={manager.replacementEmployeeId}
          note={manager.assignmentNote}
          assigning={manager.assigning}
          onEmployeeChange={manager.setReplacementEmployeeId}
          onNoteChange={manager.setAssignmentNote}
          onClose={manager.closeAssignment}
          onSubmit={manager.submitAssignment}
        />
      )}
    </section>
  );
}

export default SalonBookings;
