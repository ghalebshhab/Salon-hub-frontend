import {
  CalendarDays,
  Clock3,
  UserRound,
  UsersRound,
  Wallet,
} from "lucide-react";
import { formatDateLabel, formatDuration } from "../../model/booking.js";
import {
  formatMoney,
  getMethodShort,
  toFils,
} from "../../../payments/model/payment.js";

/** Live summary of the request: on the side on desktop, on top of the review on mobile. */
export default function BookingSummary({
  salon,
  services,
  employee,
  bookingDate,
  bookingTime,
  totalPrice,
  totalDuration,
  paymentMethod,
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
                <UsersRound size={13} aria-hidden="true" /> Salon assigns
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
        {step >= 3 && paymentMethod && (
          <div>
            <dt>
              <Wallet size={15} aria-hidden="true" /> Payment
            </dt>
            <dd>{getMethodShort(paymentMethod)}</dd>
          </div>
        )}
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
        <strong>{formatMoney(toFils(totalPrice))}</strong>
      </div>
      <p className="bk-summary-foot">
        {paymentMethod === "CASH" || !paymentMethod
          ? "Pay at the salon. No charge to request."
          : "No charge to request. You pay after the salon confirms."}
      </p>
    </div>
  );
}
