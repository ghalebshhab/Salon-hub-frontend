import { CalendarClock } from "lucide-react";
import { getTodayDate } from "../model/booking.js";

export default function RescheduleBookingDialog({
  booking,
  date,
  time,
  note,
  slots,
  loading,
  error,
  saving,
  onDateChange,
  onTimeChange,
  onNoteChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="reject-modal-overlay" role="presentation">
      <div
        className="reject-modal reschedule-modal"
        role="dialog"
        aria-modal="true"
      >
        <button
          className="reject-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close reschedule dialog"
        >
          ×
        </button>
        <div className="reject-modal-icon">
          <CalendarClock size={30} />
        </div>
        <span className="eyebrow">Reschedule appointment</span>
        <h2>Offer another available time</h2>
        <p className="reject-modal-subtitle">
          The original appointment stays unchanged until the customer accepts
          this proposal.
        </p>
        <div className="reject-booking-summary">
          <div>
            <strong>Current appointment</strong>
            <span>
              {booking.bookingDate} •{" "}
              {booking.bookingTime?.toString().slice(0, 5)}
            </span>
          </div>
          <div>
            <strong>Duration</strong>
            <span>{booking.totalDurationMinutes} minutes</span>
          </div>
        </div>
        <div className="reject-input-group">
          <label htmlFor="reschedule-date">New date</label>
          <input
            id="reschedule-date"
            type="date"
            min={getTodayDate()}
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </div>
        <div className="reject-input-group">
          <label>Available times</label>
          {loading ? (
            <p className="booking-time-message">Loading available times…</p>
          ) : error ? (
            <p className="booking-time-message error">{error}</p>
          ) : slots.length === 0 ? (
            <p className="booking-time-message">
              No other appointment time is available on this date.
            </p>
          ) : (
            <div className="booking-time-slots compact">
              {slots.map((slot) => {
                const slotTime = slot.time?.toString().slice(0, 5);
                return (
                  <button
                    className={`booking-time-slot ${time === slotTime ? "selected" : ""}`}
                    key={slotTime}
                    type="button"
                    onClick={() => onTimeChange(slotTime)}
                  >
                    <strong>{slotTime}</strong>
                    <span>
                      {slot.eligibleEmployees?.length || 0} employee
                      {slot.eligibleEmployees?.length === 1 ? "" : "s"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="reject-input-group">
          <label htmlFor="reschedule-note">Message to customer</label>
          <textarea
            id="reschedule-note"
            maxLength={1000}
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="Explain why you are offering another appointment time."
          />
        </div>
        <div className="reject-modal-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSubmit}
            disabled={saving || !time}
          >
            {saving ? "Sending…" : "Send proposal"}
          </button>
        </div>
      </div>
    </div>
  );
}
