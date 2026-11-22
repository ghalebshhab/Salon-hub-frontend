import { formatClock } from "../../model/booking.js";
import t from "../../../../shared/i18n/t.js";

/** Progress bar for a running service with the expected end time. */
export default function ServiceProgress({ tracking, who }) {
  const percent = tracking.progressPercent ?? 0;
  const overdue = tracking.remainingMinutes === 0 && percent >= 100;
  return (
    <div className="live-progress">
      <div className="live-progress-head">
        <strong>
          {overdue
            ? t("Finishing up")
            : t("{value} min left", {
                value: tracking.remainingMinutes ?? "—",
              })}
        </strong>
        <span>
          {t("Ends around")} {formatClock(tracking.expectedEndAt)}
        </span>
      </div>
      <div
        className="live-progress-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={t("{who} service progress", { who })}
      >
        <span
          style={{ transform: `scaleX(${Math.min(percent, 100) / 100})` }}
        />
      </div>
      <small>
        {t("Started at")} {formatClock(tracking.serviceStartedAt)}
      </small>
    </div>
  );
}
