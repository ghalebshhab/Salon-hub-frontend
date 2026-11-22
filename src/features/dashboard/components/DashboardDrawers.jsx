import { X } from "lucide-react";
import { Link } from "react-router-dom";
import useModalDialog from "../../../shared/hooks/useModalDialog.js";
import { bookingStatus } from "../model/dashboardModel.js";
import { money, paymentLabel } from "../model/dashboardFormat.js";
import OwnerStatusPill from "./OwnerStatusPill.jsx";
import t from "../../../shared/i18n/t.js";
import { serviceName } from "../../services/model/serviceText.js";
import { dateLocale } from "../../../shared/i18n/language.js";

/**
 * A side panel on a native modal <dialog>: focus stays inside, Escape and a
 * click on the backdrop close it, and focus goes back to the opener.
 */
function Drawer({ title, closeLabel, onClose, children }) {
  const dialogRef = useModalDialog(onClose);
  const titleId = `owner-drawer-${closeLabel.replaceAll(" ", "-").toLowerCase()}`;
  return (
    <dialog ref={dialogRef} className="owner-drawer" aria-labelledby={titleId}>
      <button
        className="owner-drawer-close"
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
      >
        <X aria-hidden="true" />
      </button>
      <span className="eyebrow" id={titleId}>
        {t(title)}
      </span>
      {children}
    </dialog>
  );
}

function EmployeeDrawer({ employee, onClose }) {
  return (
    <Drawer
      title={t("Employee details")}
      closeLabel={t("Close employee details")}
      onClose={onClose}
    >
      <div className="drawer-person">
        <span className="owner-avatar owner-avatar-lg" aria-hidden="true">
          {employee.initials}
        </span>
        <div>
          <h2>{employee.name}</h2>
          <p>{employee.specialty}</p>
          <OwnerStatusPill status={employee.status} />
        </div>
      </div>
      <div className="drawer-stats">
        <div>
          <b>{employee.bookings}</b>
          <small>{t("Completed visits")}</small>
        </div>
        <div>
          <b>{employee.services}</b>
          <small>{t("Services done")}</small>
        </div>
        <div>
          <b>{money(employee.revenue)}</b>
          <small>{t("Revenue")}</small>
        </div>
        <div>
          <b>{employee.rating ? employee.rating.toFixed(1) : "—"}</b>
          <small>
            {t("{ratingCount} customer ratings", {
              ratingCount: employee.ratingCount,
            })}
          </small>
        </div>
      </div>
      <h3>{t("Contact")}</h3>
      <p className="drawer-note">
        {employee.email || t("No email")}
        <br />
        {employee.phoneNumber || t("No phone number")}
      </p>
      <h3>{t("Assigned services")}</h3>
      <div className="skill-list">
        {employee.skills.length ? (
          employee.skills.map((skill) => <span key={skill}>{skill}</span>)
        ) : (
          <span>{t("No services assigned")}</span>
        )}
      </div>
      <h3>{t("Performance score")}</h3>
      <p className="drawer-note">
        {t(
          "{score}/100, from completed visits, services, verified ratings and revenue in this period.",
          { score: employee.score },
        )}
      </p>
      <Link
        className="btn btn-primary owner-full-button"
        to={`/owner/employees/${employee.id}/setup`}
      >
        {t("Manage schedule and services")}
      </Link>
    </Drawer>
  );
}

function BookingDrawer({ booking, onClose }) {
  const services = booking.services || [];
  return (
    <Drawer
      title={t("Booking details")}
      closeLabel={t("Close booking details")}
      onClose={onClose}
    >
      <h2>#{booking.id}</h2>
      <p className="drawer-subtitle">
        {t("Requested")}
        {booking.createdAt
          ? new Date(booking.createdAt).toLocaleString(dateLocale())
          : "—"}
      </p>
      <div className="drawer-booking-status">
        <OwnerStatusPill status={bookingStatus(booking)} />
        <strong>{money(booking.totalPrice)}</strong>
      </div>
      <div className="drawer-detail-list">
        <div>
          <small>{t("Customer")}</small>
          <strong>{booking.customerName || t("Customer")}</strong>
          <span>{booking.customerEmail || booking.customerPhoneNumber}</span>
        </div>
        <div>
          <small>{t("Appointment")}</small>
          <strong>
            {booking.bookingDate} · {String(booking.bookingTime).slice(0, 5)}
          </strong>
          <span>
            {services.map(serviceName).join(", ") || t("No services listed")}
            {booking.totalDurationMinutes
              ? t(" · {totalDurationMinutes} min", {
                  totalDurationMinutes: booking.totalDurationMinutes,
                })
              : ""}
          </span>
        </div>
        <div>
          <small>{t("Assigned employee")}</small>
          <strong>
            {booking.assignedEmployeeName || t("Not assigned yet")}
          </strong>
        </div>
        <div>
          <small>{t("Payment")}</small>
          <strong>{paymentLabel(booking.payment)}</strong>
        </div>
        {booking.ownerNote && (
          <div>
            <small>{t("Salon note")}</small>
            <strong>{booking.ownerNote}</strong>
          </div>
        )}
      </div>
      <Link
        className="btn btn-secondary owner-full-button"
        to="/owner/bookings"
      >
        {t("Open in booking management")}
      </Link>
    </Drawer>
  );
}

export default function DashboardDrawers({
  employee,
  booking,
  onCloseEmployee,
  onCloseBooking,
}) {
  return (
    <>
      {employee && (
        <EmployeeDrawer
          key={employee.id}
          employee={employee}
          onClose={onCloseEmployee}
        />
      )}
      {booking && (
        <BookingDrawer
          key={booking.id}
          booking={booking}
          onClose={onCloseBooking}
        />
      )}
    </>
  );
}
