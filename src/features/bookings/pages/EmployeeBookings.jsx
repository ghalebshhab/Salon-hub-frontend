import useEmployeeBookings from "../hooks/useEmployeeBookings.js";
import useHighlightedBooking from "../hooks/useHighlightedBooking.js";
import StaffLiveCard from "../components/live/StaffLiveCard.jsx";
import CashReceivedDialog from "../../payments/components/CashReceivedDialog.jsx";
import PaymentStrip from "../../payments/components/PaymentStrip.jsx";
import ReceiptDialog from "../../payments/components/ReceiptDialog.jsx";
import {
  formatDateLabel,
  formatDuration,
  getStatusLabel,
  getTodayDate,
  isLiveToday,
  toHourMinute,
} from "../model/booking.js";

import { CalendarDays, Clock, MapPin, Phone, Scissors } from "lucide-react";
import t from "../../../shared/i18n/t.js";
import { serviceName } from "../../services/model/serviceText.js";
import { EmployeeBookingsSkeleton } from "../components/BookingsPageSkeletons.jsx";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function AppointmentCard({
  booking,
  getStatusClass,
  highlighted,
  onStatusChange,
  onCashReceived,
  onReceipt,
}) {
  const live = isLiveToday(booking);
  return (
    <article
      id={`booking-${booking.id}`}
      className={`employee-booking-card ${highlighted ? "is-highlighted" : ""}`}
    >
      <div className="employee-booking-header">
        <div className="employee-booking-icon" aria-hidden="true">
          {(booking.customerName || "C").charAt(0).toUpperCase()}
        </div>
        <div>
          <h3>{booking.customerName || t("Customer")}</h3>
          <p>
            {toHourMinute(booking.bookingTime)} ·{" "}
            {formatDuration(booking.totalDurationMinutes)}
          </p>
        </div>
        <span className={getStatusClass(booking.status)}>
          {getStatusLabel(booking.status)}
        </span>
      </div>

      {live && (
        <StaffLiveCard booking={booking} onStatusChange={onStatusChange} />
      )}

      <div className="booking-info-grid">
        <p>
          <CalendarDays size={16} aria-hidden="true" />
          {formatDateLabel(booking.bookingDate)}
        </p>
        <p>
          <Clock size={16} aria-hidden="true" />
          {toHourMinute(booking.bookingTime)}
        </p>
        <p>
          <Phone size={16} aria-hidden="true" />
          <a href={`tel:${booking.customerPhoneNumber}`}>
            {booking.customerPhoneNumber}
          </a>
        </p>
        <p>
          <MapPin size={16} aria-hidden="true" />
          {booking.customerLocation}
        </p>
      </div>

      <div className="booking-services">
        <strong>
          <Scissors size={16} aria-hidden="true" />
          {t("Services")}
        </strong>
        <div>
          {booking.services?.map((service) => (
            <span className="service-chip" key={service.id}>
              {serviceName(service)} · {formatDuration(service.durationMinutes)}
            </span>
          ))}
        </div>
      </div>

      <PaymentStrip
        payment={booking.payment}
        canCollect
        onCollect={() => onCashReceived(booking)}
        onReceipt={() => onReceipt(booking)}
      />

      {booking.note && (
        <p className="booking-note">
          <strong>{t("Customer note:")}</strong> {t(booking.note)}
        </p>
      )}
      {booking.ownerNote && (
        <p className="booking-note">
          <strong>{t("Owner note:")}</strong> {booking.ownerNote}
        </p>
      )}
    </article>
  );
}

function Group({ title, empty, bookings, ...cardProps }) {
  return (
    <section className="employee-agenda-group" aria-label={t(title)}>
      <h2>
        {t(title)} <span>{bookings.length}</span>
      </h2>
      {bookings.length === 0 ? (
        <p className="employee-agenda-empty">{empty}</p>
      ) : (
        <div className="employee-bookings-grid">
          {bookings.map((booking) => (
            <AppointmentCard
              key={booking.id}
              booking={booking}
              highlighted={cardProps.highlightedId === booking.id}
              getStatusClass={cardProps.getStatusClass}
              onStatusChange={cardProps.onStatusChange}
              onCashReceived={cardProps.onCashReceived}
              onReceipt={cardProps.onReceipt}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const ACTIVE = ["PENDING", "ACCEPTED", "IN_PROGRESS"];
const byTime = (a, b) =>
  `${a.bookingDate}T${a.bookingTime}`.localeCompare(
    `${b.bookingDate}T${b.bookingTime}`,
  );

function EmployeeBookings() {
  const {
    bookings,
    loading,
    refetch,
    getStatusClass,
    cash,
    receiptBookingId,
    openReceipt,
    closeReceipt,
  } = useEmployeeBookings();
  const highlightedId = useHighlightedBooking(!loading);

  if (loading) return <EmployeeBookingsSkeleton />;

  const today = getTodayDate();
  const todays = bookings
    .filter((booking) => booking.bookingDate === today)
    .sort(byTime);
  const upcoming = bookings
    .filter(
      (booking) =>
        booking.bookingDate > today && ACTIVE.includes(booking.status),
    )
    .sort(byTime);
  const past = bookings
    .filter(
      (booking) => !todays.includes(booking) && !upcoming.includes(booking),
    )
    .sort((a, b) => byTime(b, a))
    .slice(0, 20);
  const cardProps = {
    getStatusClass,
    highlightedId,
    onStatusChange: refetch,
    onCashReceived: cash.request,
    onReceipt: openReceipt,
  };

  return (
    <section className="container section employee-agenda">
      <div className="profile-header">
        <div>
          <span className="eyebrow">
            {t(PAGE_HEADS.employeeBookings.eyebrow)}
          </span>
          <h1>{t(PAGE_HEADS.employeeBookings.title)}</h1>
          <p>{t(PAGE_HEADS.employeeBookings.text)}</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>{t("No assigned bookings yet")}</h3>
          <p>
            {t(
              "When the salon assigns you a booking, you get a notification and it appears here.",
            )}
          </p>
        </div>
      ) : (
        <>
          <Group
            title={t("Today")}
            empty={t("No appointments today.")}
            bookings={todays}
            {...cardProps}
          />
          <Group
            title={t("Upcoming")}
            empty={t("Nothing scheduled after today.")}
            bookings={upcoming}
            {...cardProps}
          />
          <Group
            title={t("Earlier")}
            empty={t("No earlier appointments.")}
            bookings={past}
            {...cardProps}
          />
        </>
      )}

      <CashReceivedDialog
        booking={cash.target}
        saving={cash.saving}
        onConfirm={cash.confirm}
        onCancel={cash.cancel}
      />
      <ReceiptDialog bookingId={receiptBookingId} onClose={closeReceipt} />
    </section>
  );
}

export default EmployeeBookings;
