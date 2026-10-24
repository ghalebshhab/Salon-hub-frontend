import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  MessageSquareText,
  RefreshCw,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import { BookingSummary, EmptyPrototype, FeatureNote, SectionHeading, StatusPill } from "./PrototypePrimitives.jsx";

function CustomerBookingCard({ booking, onUpdate }) {
  const pendingProposal = booking.rescheduleProposals.find((item) => item.status === "PENDING");
  return (
    <article className="prototype-booking-card">
      <div className="prototype-card-heading">
        <div><span className="eyebrow">Booking #{booking.id}</span><h3>{booking.salonName}</h3></div>
        <StatusPill value={booking.status} />
      </div>
      <p className={`prototype-decision prototype-decision-${booking.status.toLowerCase()}`}>
        {booking.status === "PENDING" && "The request is waiting for the salon’s decision."}
        {booking.status === "ACCEPTED" && "The appointment is confirmed and reserved for you."}
        {booking.status === "REJECTED" && "The salon could not accept this appointment."}
        {booking.status === "CANCELLED" && "This appointment was cancelled and remains in your history."}
        {booking.status === "COMPLETED" && "The service is complete. You can now leave a review."}
      </p>
      <BookingSummary booking={booking} />
      {booking.ownerNote && <p className="prototype-owner-note"><strong>Salon update:</strong> {booking.ownerNote}</p>}
      {pendingProposal && (
        <div className="prototype-reschedule">
          <CalendarClock size={22} />
          <div><strong>New appointment suggested</strong><p>{pendingProposal.proposedDate} at {pendingProposal.proposedTime}</p><small>{pendingProposal.note}</small></div>
          <div className="prototype-card-actions">
            <button className="btn btn-primary btn-small" type="button" onClick={() => onUpdate(booking.id, { bookingDate: pendingProposal.proposedDate, bookingTime: pendingProposal.proposedTime, status: "ACCEPTED", rescheduleProposals: booking.rescheduleProposals.map((item) => ({ ...item, status: item.id === pendingProposal.id ? "ACCEPTED" : item.status })) }, "The proposed time was accepted and the booking is confirmed.")}>Accept new time</button>
            <button className="btn btn-secondary btn-small" type="button" onClick={() => onUpdate(booking.id, { rescheduleProposals: booking.rescheduleProposals.map((item) => ({ ...item, status: item.id === pendingProposal.id ? "REJECTED" : item.status })) }, "The customer kept the original appointment time.")}>Keep original</button>
          </div>
        </div>
      )}
      <div className="prototype-card-actions">
        {["PENDING", "ACCEPTED"].includes(booking.status) && <button className="btn btn-secondary btn-small" type="button" onClick={() => onUpdate(booking.id, { status: "CANCELLED", ownerNote: "Cancelled by the customer." }, "Booking cancelled. The time is available again.")}><XCircle size={16} />Cancel booking</button>}
        {booking.status === "COMPLETED" && <button className="btn btn-primary btn-small" type="button"><MessageSquareText size={16} />Write a review</button>}
      </div>
    </article>
  );
}

export function CustomerBookingsView({ bookings, onUpdate }) {
  const [filter, setFilter] = useState("ALL");
  const filters = ["ALL", "PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"];
  const visible = bookings.filter((item) => filter === "ALL" || item.status === filter);
  return (
    <div className="prototype-view">
      <SectionHeading eyebrow="Customer experience" title="My bookings" description="Preview pending, accepted, rejected, cancelled, completed, assigned, and rescheduled appointments." />
      <div className="prototype-filter-row">
        {filters.map((item) => <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}<span>{bookings.filter((booking) => item === "ALL" || booking.status === item).length}</span></button>)}
      </div>
      <div className="prototype-grid-two">
        {visible.map((booking) => <CustomerBookingCard booking={booking} onUpdate={onUpdate} key={booking.id} />)}
      </div>
    </div>
  );
}

function OwnerBookingCard({ booking, employees, onUpdate }) {
  const [employeeId, setEmployeeId] = useState(booking.assignedEmployeeId || "");
  const assign = (value) => {
    setEmployeeId(value);
    const employee = employees.find((item) => Number(item.id) === Number(value));
    if (employee) onUpdate(booking.id, { assignedEmployeeId: employee.id, assignedEmployeeName: employee.fullName, assignedEmployeeSpecialty: employee.specialty, ownerNote: `${employee.fullName} was assigned to your appointment.` }, `${employee.fullName} assigned to booking #${booking.id}.`);
  };
  return (
    <article className="prototype-booking-card">
      <div className="prototype-card-heading"><div><span className="eyebrow">Booking #{booking.id}</span><h3>{booking.customerName}</h3><p>{booking.customerEmail}</p></div><StatusPill value={booking.status} /></div>
      <BookingSummary booking={booking} />
      {booking.note && <p className="prototype-owner-note"><strong>Customer note:</strong> {booking.note}</p>}
      {["PENDING", "ACCEPTED"].includes(booking.status) && (
        <label className="prototype-assignment"><span><UserRoundCheck size={16} />Qualified employee</span><select value={employeeId} onChange={(event) => assign(event.target.value)}><option value="">Assign later</option>{employees.filter((employee) => booking.services.every((service) => employee.services.includes(service.id))).map((employee) => <option value={employee.id} key={employee.id}>{employee.fullName} · {employee.specialty}</option>)}</select></label>
      )}
      <div className="prototype-card-actions">
        {booking.status === "PENDING" && <button className="btn btn-primary btn-small" type="button" onClick={() => onUpdate(booking.id, { status: "ACCEPTED", ownerNote: "Accepted. Please arrive five minutes early." }, `Booking #${booking.id} accepted. The customer is notified.`)}><CheckCircle2 size={16} />Accept</button>}
        {booking.status === "PENDING" && <button className="btn btn-secondary btn-small" type="button" onClick={() => onUpdate(booking.id, { status: "REJECTED", ownerNote: "The requested time is unavailable." }, `Booking #${booking.id} rejected with a reason.`)}><XCircle size={16} />Reject</button>}
        {["PENDING", "ACCEPTED"].includes(booking.status) && !booking.rescheduleProposals.some((item) => item.status === "PENDING") && <button className="btn btn-secondary btn-small" type="button" onClick={() => onUpdate(booking.id, { rescheduleProposals: [...booking.rescheduleProposals, { id: Date.now(), proposedDate: booking.bookingDate, proposedTime: "16:30", status: "PENDING", note: "A qualified employee is available at 16:30." }] }, `A new time was suggested for booking #${booking.id}.`)}><RefreshCw size={16} />Suggest 16:30</button>}
        {booking.status === "ACCEPTED" && <button className="btn btn-primary btn-small" type="button" onClick={() => onUpdate(booking.id, { status: "COMPLETED", ownerNote: "Service completed successfully." }, `Booking #${booking.id} completed. The customer can now review it.`)}><CheckCircle2 size={16} />Complete</button>}
      </div>
    </article>
  );
}

export function OwnerBookingsView({ bookings, employees, onUpdate }) {
  return (
    <div className="prototype-view">
      <SectionHeading eyebrow="Salon owner experience" title="Booking command center" description="Accept or reject requests, assign only employees qualified for every selected service, suggest a time, and complete appointments." />
      <FeatureNote>Every change shown here would create a persistent customer notification in the real connected flow.</FeatureNote>
      <div className="prototype-grid-two">{bookings.map((booking) => <OwnerBookingCard booking={booking} employees={employees} onUpdate={onUpdate} key={booking.id} />)}</div>
    </div>
  );
}

export function EmployeeBookingsView({ bookings }) {
  const assigned = bookings.filter((item) => Number(item.assignedEmployeeId) === 501 && ["ACCEPTED", "COMPLETED"].includes(item.status));
  return (
    <div className="prototype-view">
      <SectionHeading eyebrow="Employee experience" title="My assigned appointments" description="Employees see confirmed and completed work assigned to them, including customer contact details, notes, services, and timing." />
      <div className="prototype-grid-two">
        {assigned.length ? assigned.map((booking) => (
          <article className="prototype-booking-card" key={booking.id}>
            <div className="prototype-card-heading"><div><span className="eyebrow">{booking.salonName}</span><h3>{booking.customerName}</h3><p>{booking.customerPhoneNumber}</p></div><StatusPill value={booking.status} /></div>
            <BookingSummary booking={booking} />
            {booking.note && <p className="prototype-owner-note"><strong>Customer note:</strong> {booking.note}</p>}
          </article>
        )) : <EmptyPrototype title="No assigned appointments" description="When the owner assigns a qualified employee, the booking appears here." />}
      </div>
    </div>
  );
}
