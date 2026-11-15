import {
  BellRing,
  CheckCircle2,
  Navigation,
  Send,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateLabel, toHourMinute } from "../../model/booking.js";

const NEXT_STEPS = [
  {
    icon: Send,
    title: "Request sent",
    text: "The salon has your request now.",
  },
  {
    icon: UserCheck,
    title: "The salon confirms",
    text: "The owner confirms the time and the professional who will serve you.",
  },
  {
    icon: BellRing,
    title: "You get a notification",
    text: "You and your professional are told as soon as it is confirmed.",
  },
  {
    icon: Navigation,
    title: "On the day",
    text: "Tap “I'm on my way” so the salon knows when you arrive, and follow your service live.",
  },
];

export default function BookingSent({ booking, salon }) {
  return (
    <section
      className="container section bk-sent"
      aria-labelledby="bk-sent-title"
    >
      <div className="bk-sent-card">
        <span className="bk-sent-icon" aria-hidden="true">
          <CheckCircle2 />
        </span>
        <span className="eyebrow">Request sent</span>
        <h1 id="bk-sent-title">You're on {salon.name}'s list</h1>
        <p>
          {formatDateLabel(booking.bookingDate)} at{" "}
          {toHourMinute(booking.bookingTime)}
          {booking.assignedEmployeeName
            ? ` with ${booking.assignedEmployeeName}`
            : " — the salon will assign your professional"}
          .
        </p>

        <ol className="bk-sent-steps">
          {NEXT_STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className={index === 0 ? "is-done" : ""}>
              <span aria-hidden="true">
                <Icon size={18} />
              </span>
              <div>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
            </li>
          ))}
        </ol>

        <div className="bk-sent-actions">
          <Link
            className="btn btn-primary"
            to={`/my-bookings?bookingId=${booking.id}`}
          >
            Track my booking
          </Link>
          <Link
            className="btn btn-secondary"
            to={`/salons/${salon.salonId ?? salon.id}`}
          >
            Back to the salon
          </Link>
        </div>
      </div>
    </section>
  );
}
