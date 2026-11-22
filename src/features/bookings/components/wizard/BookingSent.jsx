import {
  BellRing,
  CheckCircle2,
  Navigation,
  Send,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateLabel, toHourMinute } from "../../model/booking.js";
import t from "../../../../shared/i18n/t.js";

const NEXT_STEPS = [
  {
    icon: Send,
    title: t("Request sent"),
    text: t("The salon has your request now."),
  },
  {
    icon: UserCheck,
    title: t("The salon confirms"),
    text: t(
      "The owner confirms the time and the professional who will serve you.",
    ),
  },
  {
    icon: BellRing,
    title: t("You get a notification"),
    text: t("You and your professional are told as soon as it is confirmed."),
  },
  {
    icon: Navigation,
    title: t("On the day"),
    text: t(
      "Tap “I'm on my way” so the salon knows when you arrive, and follow your service live.",
    ),
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
        <span className="eyebrow">{t("Request sent")}</span>
        <h1 id="bk-sent-title">
          {t("You're on {name}'s list", { name: salon.name })}
        </h1>
        <p>
          {booking.assignedEmployeeName
            ? t("{date} at {time} with {employee}.", {
                date: formatDateLabel(booking.bookingDate),
                time: toHourMinute(booking.bookingTime),
                employee: booking.assignedEmployeeName,
              })
            : t("{date} at {time}. The salon will assign your professional.", {
                date: formatDateLabel(booking.bookingDate),
                time: toHourMinute(booking.bookingTime),
              })}
        </p>

        <ol className="bk-sent-steps">
          {NEXT_STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className={index === 0 ? "is-done" : ""}>
              <span aria-hidden="true">
                <Icon size={18} />
              </span>
              <div>
                <strong>{t(title)}</strong>
                <small>{t(text)}</small>
              </div>
            </li>
          ))}
        </ol>

        <div className="bk-sent-actions">
          <Link
            className="btn btn-primary"
            to={`/my-bookings?bookingId=${booking.id}`}
          >
            {t("Track my booking")}
          </Link>
          <Link
            className="btn btn-secondary"
            to={`/salons/${salon.salonId ?? salon.id}`}
          >
            {t("Back to the salon")}
          </Link>
        </div>
      </div>
    </section>
  );
}
