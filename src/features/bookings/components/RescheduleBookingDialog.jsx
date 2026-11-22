import { CalendarClock } from "lucide-react";
import { getTodayDate } from "../model/booking.js";
import t from "../../../shared/i18n/t.js";
import { useId } from "react";
import useOverlayDialog from "../../../shared/hooks/useOverlayDialog.js";

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
  const id = useId();
  const dialogRef = useOverlayDialog(onClose, { locked: saving });
  return (
    <div className="reject-modal-overlay" role="presentation">
      <div
        className="reject-modal reschedule-modal"
        ref={dialogRef}
        role="dialog"
        aria-labelledby={`${id}-title`}
        aria-modal="true"
      >
        <button
          className="reject-modal-close"
          type="button"
          onClick={onClose}
          aria-label={t("Close reschedule dialog")}
        >
          ×
        </button>
        <div className="reject-modal-icon">
          <CalendarClock size={30} />
        </div>
        <span className="eyebrow">{t("Reschedule appointment")}</span>
        <h2 id={`${id}-title`}>{t("Offer another available time")}</h2>
        <p className="reject-modal-subtitle">
          {t(
            "The original appointment stays unchanged until the customer accepts this proposal.",
          )}
        </p>
        <div className="reject-booking-summary">
          <div>
            <strong>{t("Current appointment")}</strong>
            <span>
              {booking.bookingDate} •{" "}
              {booking.bookingTime?.toString().slice(0, 5)}
            </span>
          </div>
          <div>
            <strong>{t("Duration")}</strong>
            <span>
              {t("{totalDurationMinutes} minutes", {
                totalDurationMinutes: booking.totalDurationMinutes,
              })}
            </span>
          </div>
        </div>
        <div className="reject-input-group">
          <label htmlFor="reschedule-date">{t("New date")}</label>
          <input
            id="reschedule-date"
            type="date"
            min={getTodayDate()}
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </div>
        <div className="reject-input-group">
          <label>{t("Available times")}</label>
          {loading ? (
            <p className="booking-time-message">
              {t("Loading available times…")}
            </p>
          ) : error ? (
            <p className="booking-time-message error">{error}</p>
          ) : slots.length === 0 ? (
            <p className="booking-time-message">
              {t("No other appointment time is available on this date.")}
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
                      {slot.eligibleEmployees?.length === 1
                        ? t("1 employee")
                        : t("{count} employees", {
                            count: slot.eligibleEmployees?.length || 0,
                          })}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="reject-input-group">
          <label htmlFor="reschedule-note">{t("Message to customer")}</label>
          <textarea
            id="reschedule-note"
            maxLength={1000}
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder={t(
              "Explain why you are offering another appointment time.",
            )}
          />
        </div>
        <div className="reject-modal-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            {t("Cancel")}
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSubmit}
            disabled={saving || !time}
          >
            {saving ? t("Sending…") : t("Send proposal")}
          </button>
        </div>
      </div>
    </div>
  );
}
