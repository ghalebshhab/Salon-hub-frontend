import {
  CalendarClock,
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  UserRound,
  UserX,
  XCircle,
} from "lucide-react";
import {
  canMarkNoShow,
  getStatusLabel,
  isLiveToday,
} from "../model/booking.js";
import AnswerDeadline from "./AnswerDeadline.jsx";
import StaffLiveCard from "./live/StaffLiveCard.jsx";
import PaymentStrip from "../../payments/components/PaymentStrip.jsx";

export default function SalonBookingCard({
  booking,
  eligibleEmployees,
  statusClass,
  highlighted = false,
  onAccept,
  onAssign,
  onCashReceived,
  onComplete,
  onReceipt,
  onNoShow,
  onReject,
  onReschedule,
  onStatusChange,
}) {
  const pendingReschedule = booking.rescheduleProposals?.find(
    (proposal) => proposal.status === "PENDING",
  );
  const canManage = ["PENDING", "ACCEPTED"].includes(booking.status);
  const live = isLiveToday(booking);

  return (
    <div
      className={`booking-card ${highlighted ? "is-highlighted" : ""}`}
      id={`booking-${booking.id}`}
    >
      <div className="booking-card-header">
        <div>
          <h3>{booking.customerName || "Customer"}</h3>
          <p>{booking.customerEmail}</p>
        </div>
        <span className={statusClass}>{getStatusLabel(booking.status)}</span>
      </div>

      <AnswerDeadline booking={booking} audience="owner" />

      {live && (
        <StaffLiveCard booking={booking} onStatusChange={onStatusChange} />
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
                }${booking.status === "PENDING" ? " (requested by the customer)" : ""}`
              : "Customer asked you to assign someone"}
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

      <PaymentStrip
        payment={booking.payment}
        canCollect={Boolean(onCashReceived)}
        onCollect={() => onCashReceived(booking)}
        onReceipt={onReceipt ? () => onReceipt(booking) : undefined}
      />

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
            {booking.assignedEmployeeId ? "Accept" : "Assign and accept"}
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

      {booking.status === "ACCEPTED" && !live && (
        <div className="service-actions">
          <button
            className="btn btn-secondary btn-small"
            type="button"
            onClick={() => onComplete(booking.id)}
          >
            <CheckCircle size={16} />
            Mark Completed
          </button>
          {onNoShow && canMarkNoShow(booking) && (
            <button
              className="btn btn-ghost-danger btn-small"
              type="button"
              onClick={() => onNoShow(booking)}
            >
              <UserX size={16} />
              Customer did not come
            </button>
          )}
        </div>
      )}
    </div>
  );
}
