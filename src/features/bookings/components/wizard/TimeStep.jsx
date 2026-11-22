import { CalendarSearch, RotateCw, UsersRound } from "lucide-react";
import { useMemo } from "react";
import {
  describeUnavailable,
  formatDateLabel,
  getUpcomingDays,
  groupSlotsByDayPart,
  toHourMinute,
} from "../../model/booking.js";
import t from "../../../../shared/i18n/t.js";

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
        <strong>{t("We could not load the times.")}</strong>
        <span>{error}</span>
        <button
          className="btn btn-secondary btn-small"
          type="button"
          onClick={onRetry}
        >
          <RotateCw size={15} aria-hidden="true" /> {t("Try again")}
        </button>
      </div>
    );
  }
  const who = employee?.fullName || t("The salon");
  const next = availability?.nextAvailableDate;
  return (
    <div className="bk-notice" role="status">
      <CalendarSearch aria-hidden="true" />
      <strong>
        {describeUnavailable(availability?.unavailableReason, who)}
      </strong>
      <span>
        {employee
          ? t(
              "Pick another day, or let the salon assign a free professional for this day.",
            )
          : t("Pick another day to see free times.")}
      </span>
      <div className="bk-notice-actions">
        {next && (
          <button
            className="btn btn-primary btn-small"
            type="button"
            onClick={() => onPickDate(next)}
          >
            {t("Next free day:")} {formatDateLabel(next)}
          </button>
        )}
        {employee && (
          <button
            className="btn btn-secondary btn-small"
            type="button"
            onClick={onSalonAssigns}
          >
            <UsersRound size={15} aria-hidden="true" />{" "}
            {t("Let the salon assign")}
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
        <span className="eyebrow">{t("Step 3")}</span>
        {t("Pick a day and time")}
        <small>
          {employee
            ? t(
                "Times follow the salon hours ({open}–{close}) and {name}'s schedule. Busy times and days off are already hidden.",
                {
                  open: toHourMinute(salon.openTime),
                  close: toHourMinute(salon.closeTime),
                  name: employee.fullName,
                },
              )
            : t(
                "Times follow the salon hours ({open}–{close}). Busy times and days off are already hidden.",
                {
                  open: toHourMinute(salon.openTime),
                  close: toHourMinute(salon.closeTime),
                },
              )}
        </small>
      </div>

      <div className="bk-date-strip" role="listbox" aria-label={t("Day")}>
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
          <small>{t("Other")}</small>
          <CalendarSearch size={18} aria-hidden="true" />
          <input
            type="date"
            aria-label={t("Choose another date")}
            value={dateInStrip ? "" : bookingDate}
            min={days[0].value}
            onChange={(event) =>
              event.target.value && onDateChange(event.target.value)
            }
          />
        </label>
      </div>

      <p className="bk-date-heading">
        {bookingDate ? formatDateLabel(bookingDate) : t("Choose a day")}
        {bookingDate && !dateInStrip && t(" (custom date)")}
      </p>

      {loading ? (
        <div className="bk-slot-skeleton" aria-label={t("Loading free times")}>
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
            <section key={group.key} aria-label={t(group.label)}>
              <h3>{t(group.label)}</h3>
              <div
                className="bk-slots"
                role="radiogroup"
                aria-label={t("{label} times", { label: group.label })}
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
                      {!employee && (
                        <small>{t("{count} free", { count })}</small>
                      )}
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
          {t(
            "Same-day times start at least {minimumLeadMinutes} minutes from now.",
            { minimumLeadMinutes: availability.minimumLeadMinutes },
          )}
        </p>
      )}
    </div>
  );
}
