import { CalendarDays, Clock3, Sparkles, UserRound } from "lucide-react";
import { formatDateLabel, formatDuration } from "../../model/booking.js";

/** Live summary of the request: on the side on desktop, on top of the review on mobile. */
export default function BookingSummary({
  salon,
  services,
  employee,
  bookingDate,
  bookingTime,
  totalPrice,
  totalDuration,
  step,
}) {
  return (
    <div className="bk-summary">
      <span className="eyebrow">Your visit</span>
      <h2>{salon.name}</h2>
      <p className="bk-summary-city">{salon.city}</p>

      <ul className="bk-summary-services">
        {services.length === 0 ? (
          <li className="is-empty">No service selected yet</li>
        ) : (
          services.map((service) => (
            <li key={service.id}>
              <span>{service.name}</span>
              <b>{Number(service.price)} JD</b>
            </li>
          ))
        )}
      </ul>

      <dl className="bk-summary-facts">
        <div>
          <dt>
            <UserRound size={15} aria-hidden="true" /> Professional
          </dt>
          <dd>
            {step < 1 ? (
              "—"
            ) : employee ? (
              employee.fullName
            ) : (
              <span className="bk-summary-assign">
                <Sparkles size={13} aria-hidden="true" /> Salon assigns
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt>
            <CalendarDays size={15} aria-hidden="true" /> Day
          </dt>
          <dd>{step < 2 ? "—" : formatDateLabel(bookingDate)}</dd>
        </div>
        <div>
          <dt>
            <Clock3 size={15} aria-hidden="true" /> Time
          </dt>
          <dd>
            {bookingTime
              ? `${bookingTime} · ${formatDuration(totalDuration)}`
              : totalDuration
                ? formatDuration(totalDuration)
                : "—"}
          </dd>
        </div>
      </dl>

      <div className="bk-summary-total">
        <span>Total</span>
        <strong>{totalPrice} JD</strong>
      </div>
      <p className="bk-summary-foot">Pay at the salon. No charge to request.</p>
    </div>
  );
}
