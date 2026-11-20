import { Link } from "react-router-dom";
import {
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock,
  MapPin,
  MessageSquareText,
  Phone,
  RotateCcw,
  Store,
  Timer,
  UserRound,
  XCircle,
} from "lucide-react";
import AnswerDeadline from "../AnswerDeadline.jsx";
import CustomerLiveCard from "../live/CustomerLiveCard.jsx";
import PaymentStrip from "../../../payments/components/PaymentStrip.jsx";
import BookingStatusBadge from "./BookingStatusBadge.jsx";
import { toHourMinute } from "../../model/booking.js";
import {
  formatDuration,
  formatPrice,
  getDateParts,
} from "../../model/customerBookings.js";

function DateTile({ booking, live }) {
  const parts = getDateParts(booking.bookingDate);
  if (!parts) return <span className="mb-date" aria-hidden="true" />;
  return (
    <div className={`mb-date ${live ? "is-live" : ""}`} aria-hidden="true">
      <span className="mb-date-month">{parts.month}</span>
      <strong className="mb-date-day">{parts.day}</strong>
      <span className="mb-date-weekday">{live ? "Today" : parts.weekday}</span>
    </div>
  );
}

/** One short sentence that tells the customer what happens next. */
function StatusNote({ booking, live }) {
  const employee = booking.assignedEmployeeName;
  switch (booking.status) {
    case "PENDING":
      return (
        <p className="mb-note tone-warning">
          Your request is with the salon.{" "}
          {employee
            ? `Your time with ${employee} is held until the salon decides.`
            : "The salon will confirm and choose your professional."}{" "}
          We will notify you.
        </p>
      );
    case "ACCEPTED":
      if (live) return null;
      return booking.customerConfirmedAt ? (
        <p className="mb-note tone-success">
          <CheckCircle2 size={16} aria-hidden="true" /> You told the salon you
          are coming{employee ? ` to see ${employee}` : ""}. On the day, open
          this page to share your trip.
        </p>
      ) : (
        <p className="mb-note tone-success">
          Confirmed{employee ? ` with ${employee}` : ""}. On the day, open this
          page to share your trip and follow your service live.
        </p>
      );
    case "REJECTED":
      return (
        <p className="mb-note tone-danger">
          The salon could not take this time. You can choose another time.
        </p>
      );
    case "EXPIRED":
      return (
        <p className="mb-note tone-danger">
          The salon did not answer in time, so this request expired. Nothing was
          charged.
        </p>
      );
    case "NO_SHOW":
      return (
        <p className="mb-note tone-danger">
          The salon marked this visit as missed. If you were there, contact the
          salon.
        </p>
      );
    default:
      return null;
  }
}

/** Asks the customer to confirm a confirmed appointment, so the salon can plan. */
function AttendancePrompt({ booking, confirming, onConfirm }) {
  return (
    <div className="mb-attendance" role="group" aria-label="Confirm your visit">
      <CalendarCheck2 size={20} aria-hidden="true" />
      <div>
        <strong>Are you still coming?</strong>
        <span>
          Tell the salon now. If your plans changed, cancel so another customer
          can take the time.
        </span>
      </div>
      <button
        className="btn btn-primary btn-small"
        type="button"
        disabled={confirming}
        onClick={() => onConfirm(booking.id)}
      >
        {confirming ? "Saving…" : "Yes, I'm coming"}
      </button>
    </div>
  );
}

function RescheduleProposal({ booking, proposal, responding, onDecision }) {
  return (
    <div className="mb-reschedule" role="group" aria-label="New time proposed">
      <div className="mb-reschedule-head">
        <CalendarClock size={20} aria-hidden="true" />
        <div>
          <strong>The salon proposed a new time</strong>
          <span>
            {proposal.proposedDate} · {toHourMinute(proposal.proposedTime)}
          </span>
        </div>
      </div>
      {proposal.note && <p className="mb-reschedule-note">{proposal.note}</p>}
      <small>Your current time stays until you accept.</small>
      <div className="mb-actions">
        <button
          className="btn btn-primary btn-small"
          type="button"
          disabled={responding}
          onClick={() => onDecision(booking.id, proposal.id, true)}
        >
          Accept new time
        </button>
        <button
          className="btn btn-secondary btn-small"
          type="button"
          disabled={responding}
          onClick={() => onDecision(booking.id, proposal.id, false)}
        >
          Keep my time
        </button>
      </div>
    </div>
  );
}

function MoreDetails({ booking }) {
  const history = booking.rescheduleProposals || [];
  const hasDetails =
    booking.customerPhoneNumber ||
    booking.customerLocation ||
    booking.note ||
    history.length > 0;
  if (!hasDetails) return null;

  return (
    <details className="mb-details">
      <summary>
        Booking details
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <dl className="mb-details-grid">
        <div>
          <dt>Booking number</dt>
          <dd>#{booking.id}</dd>
        </div>
        {booking.customerPhoneNumber && (
          <div>
            <dt>
              <Phone size={14} aria-hidden="true" /> Phone
            </dt>
            <dd>{booking.customerPhoneNumber}</dd>
          </div>
        )}
        {booking.customerLocation && (
          <div>
            <dt>
              <MapPin size={14} aria-hidden="true" /> Your area
            </dt>
            <dd>{booking.customerLocation}</dd>
          </div>
        )}
        {booking.note && (
          <div className="is-wide">
            <dt>Your note</dt>
            <dd>{booking.note}</dd>
          </div>
        )}
      </dl>
      {history.length > 0 && (
        <div className="mb-history">
          <strong>Time changes</strong>
          <ul>
            {history.map((proposal) => (
              <li key={proposal.id}>
                <span>
                  {proposal.proposedDate} ·{" "}
                  {toHourMinute(proposal.proposedTime)}
                </span>
                <span
                  className={`mb-history-status is-${proposal.status.toLowerCase()}`}
                >
                  {proposal.status.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </details>
  );
}

/** A customer's booking as a clear, scannable card. */
export default function CustomerBookingCard({
  booking,
  live,
  highlighted,
  cancellable,
  pendingProposal,
  respondingProposalId,
  confirming = false,
  onCancel,
  onConfirmAttendance,
  onReview,
  onReceipt,
  onRescheduleDecision,
}) {
  const services = booking.services || [];
  const canBookAgain = [
    "COMPLETED",
    "REJECTED",
    "CANCELLED",
    "EXPIRED",
    "NO_SHOW",
  ].includes(booking.status);
  const hasActions =
    cancellable || booking.status === "COMPLETED" || canBookAgain;

  return (
    <article
      id={`booking-${booking.id}`}
      className={`mb-card ${highlighted ? "is-highlighted" : ""} ${live ? "is-live" : ""}`}
      aria-labelledby={`booking-${booking.id}-title`}
    >
      <DateTile booking={booking} live={live} />

      <div className="mb-card-main">
        <header className="mb-card-head">
          <div className="mb-card-title">
            <h2 id={`booking-${booking.id}-title`}>
              <Link to={`/salons/${booking.salonId}`}>
                <Store size={17} aria-hidden="true" />
                {booking.salonName}
              </Link>
            </h2>
            <ul className="mb-meta">
              <li>
                <Clock size={15} aria-hidden="true" />
                {toHourMinute(booking.bookingTime)}
              </li>
              {booking.totalDurationMinutes > 0 && (
                <li>
                  <Timer size={15} aria-hidden="true" />
                  {formatDuration(booking.totalDurationMinutes)}
                </li>
              )}
              {booking.assignedEmployeeName && (
                <li>
                  <UserRound size={15} aria-hidden="true" />
                  {booking.assignedEmployeeName}
                  {booking.assignedEmployeeSpecialty && (
                    <span className="mb-meta-soft">
                      {" "}
                      · {booking.assignedEmployeeSpecialty}
                    </span>
                  )}
                </li>
              )}
            </ul>
          </div>
          <BookingStatusBadge status={booking.status} />
        </header>

        {live && <CustomerLiveCard booking={booking} />}
        <StatusNote booking={booking} live={live} />
        <AnswerDeadline booking={booking} audience="customer" />

        {booking.status === "ACCEPTED" &&
          !booking.customerConfirmedAt &&
          !live &&
          onConfirmAttendance && (
            <AttendancePrompt
              booking={booking}
              confirming={confirming}
              onConfirm={onConfirmAttendance}
            />
          )}

        {pendingProposal && (
          <RescheduleProposal
            booking={booking}
            proposal={pendingProposal}
            responding={respondingProposalId === pendingProposal.id}
            onDecision={onRescheduleDecision}
          />
        )}

        {booking.ownerNote && (
          <blockquote className="mb-salon-note">
            <span>Message from the salon</span>
            {booking.ownerNote}
          </blockquote>
        )}

        {services.length > 0 && (
          <div className="mb-services">
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <span>{service.name}</span>
                  <span>{formatPrice(service.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mb-total">
              <span>Total</span>
              <strong>{formatPrice(booking.totalPrice)}</strong>
            </div>
          </div>
        )}

        <PaymentStrip payment={booking.payment} onReceipt={onReceipt} />
        <MoreDetails booking={booking} />

        {hasActions && (
          <footer className="mb-actions mb-card-foot">
            {booking.status === "COMPLETED" && (
              <button
                className="btn btn-primary btn-small"
                type="button"
                onClick={() => onReview(booking)}
              >
                <MessageSquareText size={16} aria-hidden="true" />
                Write a review
              </button>
            )}
            {canBookAgain && (
              <Link
                className="btn btn-secondary btn-small"
                to={`/salons/${booking.salonId}/book`}
              >
                <RotateCcw size={16} aria-hidden="true" />
                Book again
              </Link>
            )}
            {cancellable && (
              <button
                className="btn btn-ghost-danger btn-small mb-cancel"
                type="button"
                onClick={() => onCancel(booking.id)}
              >
                <XCircle size={16} aria-hidden="true" />
                Cancel booking
              </button>
            )}
          </footer>
        )}
      </div>
    </article>
  );
}
