import {
  AlertTriangle,
  CalendarCheck2,
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
import t from "../../../shared/i18n/t.js";
import { serviceName } from "../../services/model/serviceText.js";

/**
 * What the owner should know about the customer before the visit: whether
 * they confirmed after the reminder, and how often they missed a visit.
 */
function CustomerSignals({ booking }) {
  const missed = Number(booking.customerNoShowCount || 0);
  const confirmed =
    booking.status === "ACCEPTED" && Boolean(booking.customerConfirmedAt);
  if (!confirmed && !missed) return null;
  return (
    <div className="booking-signals">
      {confirmed && (
        <span className="booking-signal is-good">
          <CalendarCheck2 size={14} aria-hidden="true" />
          {t("Customer confirmed they are coming")}
        </span>
      )}
      {missed > 0 && (
        <span className="booking-signal is-warning">
          <AlertTriangle size={14} aria-hidden="true" />
          {missed === 1
            ? t("Missed 1 visit at your salon")
            : t("Missed {missed} visits at your salon", { missed })}
        </span>
      )}
    </div>
  );
}

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
          <h3>{booking.customerName || t("Customer")}</h3>
          <p>{booking.customerEmail}</p>
        </div>
        <span className={statusClass}>{getStatusLabel(booking.status)}</span>
      </div>

      <CustomerSignals booking={booking} />

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
        <strong>{t("Requested services:")}</strong>
        <div>
          {booking.services?.map((service) => (
            <span className="service-chip" key={service.id}>
              {t("{name} - {price} JD", {
                name: serviceName(service),
                price: service.price,
              })}
            </span>
          ))}
        </div>
      </div>

      <div className="booking-assigned-employee-box">
        <div>
          <strong>
            <UserRound size={15} />
            {t("Assigned employee")}
          </strong>
          <p>
            {booking.assignedEmployeeName
              ? `${booking.assignedEmployeeName} • ${
                  booking.assignedEmployeeSpecialty || t("Employee")
                }${booking.status === "PENDING" ? ` (${t("requested by the customer")})` : ""}`
              : t("Customer asked you to assign someone")}
          </p>
        </div>
        {canManage && (
          <select
            value={booking.assignedEmployeeId || ""}
            onChange={(event) => onAssign(booking, event.target.value)}
            aria-label={t("Assign employee to {value}", {
              value: booking.customerName || t("customer"),
            })}
          >
            <option value="">{t("Assign employee")}</option>
            {eligibleEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName} - {employee.specialty || t("Employee")}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="booking-summary-row">
        <span>
          {t("Total Price: {totalPrice} JD", {
            totalPrice: booking.totalPrice,
          })}
        </span>
        <span>
          {t("Total Duration: {totalDurationMinutes} min", {
            totalDurationMinutes: booking.totalDurationMinutes,
          })}
        </span>
      </div>

      <PaymentStrip
        payment={booking.payment}
        canCollect={Boolean(onCashReceived)}
        onCollect={() => onCashReceived(booking)}
        onReceipt={onReceipt ? () => onReceipt(booking) : undefined}
      />

      {booking.note && (
        <p className="booking-note">
          <strong>{t("Customer note:")}</strong> {t(booking.note)}
        </p>
      )}
      {booking.ownerNote && (
        <p className="booking-note">
          <strong>{t("Your note:")}</strong> {booking.ownerNote}
        </p>
      )}

      {booking.rescheduleProposals?.length > 0 && (
        <div className="reschedule-history">
          <strong>{t("Reschedule history")}</strong>
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
              {proposal.note && <p>{t(proposal.note)}</p>}
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
            ? t("Waiting for customer decision")
            : t("Propose new date and time")}
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
            {booking.assignedEmployeeId ? t("Accept") : t("Assign and accept")}
          </button>
          <button
            className="btn btn-danger btn-small"
            type="button"
            onClick={() => onReject(booking)}
          >
            <XCircle size={16} />
            {t("Reject")}
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
            {t("Mark Completed")}
          </button>
          {onNoShow && canMarkNoShow(booking) && (
            <button
              className="btn btn-ghost-danger btn-small"
              type="button"
              onClick={() => onNoShow(booking)}
            >
              <UserX size={16} />
              {t("Customer did not come")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
