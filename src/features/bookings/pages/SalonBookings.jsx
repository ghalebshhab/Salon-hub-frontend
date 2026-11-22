import AcceptBookingDialog from "../components/AcceptBookingDialog.jsx";
import AssignEmployeeDialog from "../components/AssignEmployeeDialog.jsx";
import useHighlightedBooking from "../hooks/useHighlightedBooking.js";
import RejectBookingDialog from "../components/RejectBookingDialog.jsx";
import RescheduleBookingDialog from "../components/RescheduleBookingDialog.jsx";
import SalonBookingCard from "../components/SalonBookingCard.jsx";
import useSalonBookings from "../hooks/useSalonBookings.js";
import { getEligibleEmployees } from "../model/booking.js";
import CashReceivedDialog from "../../payments/components/CashReceivedDialog.jsx";
import ReceiptDialog from "../../payments/components/ReceiptDialog.jsx";
import t from "../../../shared/i18n/t.js";
import { SalonBookingsSkeleton } from "../components/BookingsPageSkeletons.jsx";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function SalonBookings() {
  const manager = useSalonBookings();
  const highlightedId = useHighlightedBooking(!manager.loading);

  if (manager.loading) return <SalonBookingsSkeleton />;

  const replacementEmployees = manager.assignmentBooking
    ? getEligibleEmployees(manager.assignmentBooking, manager.employees)
    : [];

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">{t(PAGE_HEADS.salonBookings.eyebrow)}</span>
          <h1>{t(PAGE_HEADS.salonBookings.title)}</h1>
          <p>{t(PAGE_HEADS.salonBookings.text)}</p>
        </div>
      </div>

      {manager.bookings.length === 0 ? (
        <div className="empty-state">
          <h3>{t("No bookings yet")}</h3>
          <p>
            {t("When customers book your services, they will appear here.")}
          </p>
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
              highlighted={highlightedId === booking.id}
              onStatusChange={manager.loadBookings}
              onAccept={manager.handleAccept}
              onAssign={manager.openAssignment}
              onCashReceived={manager.cash.request}
              onReceipt={manager.openReceipt}
              onComplete={manager.handleComplete}
              onNoShow={manager.handleNoShow}
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

      {manager.acceptingBooking && (
        <AcceptBookingDialog
          booking={manager.acceptingBooking}
          accepting={manager.accepting}
          onClose={manager.closeAccept}
          onSubmit={manager.submitAccept}
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

      <CashReceivedDialog
        booking={manager.cash.target}
        saving={manager.cash.saving}
        onConfirm={manager.cash.confirm}
        onCancel={manager.cash.cancel}
      />
      <ReceiptDialog
        bookingId={manager.receiptBookingId}
        onClose={manager.closeReceipt}
      />
    </section>
  );
}

export default SalonBookings;
