import { CalendarSearch, RefreshCw, Sparkles } from "lucide-react";
import { useMemo } from "react";
import {
  describeUnavailable,
  formatDateLabel,
  getUpcomingDays,
  groupSlotsByDayPart,
  toHourMinute,
} from "../../model/booking.js";

function NoTimes({
  availability,
  employee,
  onPickDate,
  onSalonAssigns,
  onRetry,
  error,
}) {
  if (error) {
    return (
      <div className="bk-notice is-error" role="alert">
        <strong>We could not load the times.</strong>
        <span>{error}</span>
        <button
          className="btn btn-secondary btn-small"
          type="button"
          onClick={onRetry}
        >
          <RefreshCw size={15} aria-hidden="true" /> Try again
        </button>
      </div>
    );
  }
  const who = employee?.fullName || "The salon";
  const next = availability?.nextAvailableDate;
  return (
    <div className="bk-notice" role="status">
      <CalendarSearch aria-hidden="true" />
      <strong>
        {describeUnavailable(availability?.unavailableReason, who)}
      </strong>
      <span>
        {employee
          ? "Pick another day, or let the salon assign a free professional for this day."
          : "Pick another day to see free times."}
      </span>
      <div className="bk-notice-actions">
        {next && (
          <button
            className="btn btn-primary btn-small"
            type="button"
            onClick={() => onPickDate(next)}
          >
            Next free day: {formatDateLabel(next)}
          </button>
        )}
        {employee && (
          <button
            className="btn btn-secondary btn-small"
            type="button"
            onClick={onSalonAssigns}
          >
            <Sparkles size={15} aria-hidden="true" /> Let the salon assign
          </button>
        )}
      </div>
    </div>
  );
}

export default function TimeStep({
  salon,
  bookingDate,
  onDateChange,
  bookingTime,
  onTimeChange,
  availability,
  slots,
  loading,
  error,
  employee,
  onSalonAssigns,
  onRetry,
}) {
  const days = useMemo(() => getUpcomingDays(14), []);
  const groups = useMemo(() => groupSlotsByDayPart(slots), [slots]);
  const dateInStrip = days.some((day) => day.value === bookingDate);

  return (
    <div className="bk-fieldset">
      <div className="bk-step-title">
        <span className="eyebrow">Step 3</span>
        Pick a day and time
        <small>
          Times follow the salon hours ({toHourMinute(salon.openTime)}–
          {toHourMinute(salon.closeTime)})
          {employee ? ` and ${employee.fullName}'s schedule` : ""}. Busy times
          and days off are already hidden.
        </small>
      </div>

      <div className="bk-date-strip" role="listbox" aria-label="Day">
        {days.map((day) => (
          <button
            key={day.value}
            type="button"
            role="option"
            aria-selected={bookingDate === day.value}
            className={`bk-date ${bookingDate === day.value ? "is-selected" : ""}`}
            onClick={() => onDateChange(day.value)}
          >
            <small>{day.weekday}</small>
            <strong>{day.day}</strong>
            <small>{day.month}</small>
          </button>
        ))}
        <label className="bk-date bk-date-other">
          <small>Other</small>
          <CalendarSearch size={18} aria-hidden="true" />
          <input
            type="date"
            aria-label="Choose another date"
            value={dateInStrip ? "" : bookingDate}
            min={days[0].value}
            onChange={(event) =>
              event.target.value && onDateChange(event.target.value)
            }
          />
        </label>
      </div>

      <p className="bk-date-heading">
        {bookingDate ? formatDateLabel(bookingDate) : "Choose a day"}
        {bookingDate && !dateInStrip && " (custom date)"}
      </p>

      {loading ? (
        <div className="bk-slot-skeleton" aria-label="Loading free times">
          {Array.from({ length: 8 }, (_, index) => (
            <span key={index} className="skeleton-block" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <NoTimes
          availability={availability}
          employee={employee}
          error={error}
          onPickDate={onDateChange}
          onSalonAssigns={onSalonAssigns}
          onRetry={onRetry}
        />
      ) : (
        <div className="bk-slot-groups">
          {groups.map((group) => (
            <section key={group.key} aria-label={group.label}>
              <h3>{group.label}</h3>
              <div
                className="bk-slots"
                role="radiogroup"
                aria-label={`${group.label} times`}
              >
                {group.slots.map((slot) => {
                  const time = toHourMinute(slot.time);
                  const count = slot.eligibleEmployees?.length || 0;
                  const selected = toHourMinute(bookingTime) === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`bk-slot ${selected ? "is-selected" : ""}`}
                      onClick={() => onTimeChange(time)}
                    >
                      <strong>{time}</strong>
                      {!employee && <small>{count} free</small>}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
      {availability && (
        <p className="bk-hint">
          Same-day times start at least {availability.minimumLeadMinutes}{" "}
          minutes from now.
        </p>
      )}
    </div>
  );
}
