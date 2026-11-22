import { BOOKING_VIEWS } from "../../model/customerBookings.js";
import useI18n from "../../../../shared/i18n/useI18n.js";

/** Upcoming / Past / Cancelled switch with a count on each tab. */
export default function BookingViewTabs({ value, counts, onChange }) {
  const { t, dir } = useI18n();
  const moveFocus = (event, index) => {
    // Arrow keys follow the reading direction.
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    const step = { [forward]: 1, [back]: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next =
      BOOKING_VIEWS[
        (index + step + BOOKING_VIEWS.length) % BOOKING_VIEWS.length
      ];
    onChange(next.key);
    document.getElementById(`mb-tab-${next.key}`)?.focus();
  };

  return (
    <div className="mb-tabs" role="tablist" aria-label={t("Filter bookings")}>
      {BOOKING_VIEWS.map((view, index) => {
        const selected = view.key === value;
        return (
          <button
            key={view.key}
            id={`mb-tab-${view.key}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="mb-panel"
            tabIndex={selected ? 0 : -1}
            className={`mb-tab ${selected ? "is-active" : ""}`}
            onClick={() => onChange(view.key)}
            onKeyDown={(event) => moveFocus(event, index)}
          >
            {t(view.label)}
            <span className="mb-tab-count">{counts[view.key] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
