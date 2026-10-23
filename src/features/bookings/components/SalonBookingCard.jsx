import {
  CalendarClock,
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";

export default function SalonBookingCard({
  booking,
  eligibleEmployees,
  statusClass,
  onAccept,
  onAssign,
  onComplete,
  onReject,
  onReschedule,
}) {
  const pendingReschedule = booking.rescheduleProposals?.find(
    (proposal) => proposal.status === "PENDING",
  );
  const canManage = ["PENDING", "ACCEPTED"].includes(booking.status);

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div>
          <h3>{booking.customerName || "Customer"}</h3>
          <p>{booking.customerEmail}</p>
        </div>
        <span className={statusClass}>{booking.status}</span>
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
        {canManage && (
          <select
            value={booking.assignedEmployeeId || ""}
            onChange={(event) => onAssign(booking, event.target.value)}
            aria-label={`Assign employee to ${booking.customerName || "customer"}`}
          >
            <option value="">Assign employee</option>
            {eligibleEmployees.map((employee) => (
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

      {booking.rescheduleProposals?.length > 0 && (
        <div className="reschedule-history">
          <strong>Reschedule history</strong>
          {booking.rescheduleProposals.map((proposal) => (
            <div className="reschedule-history-item" key={proposal.id}>
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

      {canManage && (
        <button
          className="btn btn-secondary btn-small"
          type="button"
          onClick={() => onReschedule(booking)}
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
            type="button"
            onClick={() => onAccept(booking)}
            disabled={Boolean(pendingReschedule)}
          >
            <CheckCircle size={16} />
            Accept
          </button>
          <button
            className="btn btn-danger btn-small"
            type="button"
            onClick={() => onReject(booking)}
          >
            <XCircle size={16} />
            Reject
          </button>
        </div>
      )}

      {booking.status === "ACCEPTED" && (
        <button
          className="btn btn-secondary btn-small"
          type="button"
          onClick={() => onComplete(booking.id)}
        >
          <CheckCircle size={16} />
          Mark Completed
        </button>
      )}
    </div>
  );
}
