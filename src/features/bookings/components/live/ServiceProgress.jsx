import { formatClock } from "../../model/booking.js";

/** Progress bar for a running service with the expected end time. */
export default function ServiceProgress({ tracking, who }) {
  const percent = tracking.progressPercent ?? 0;
  const overdue = tracking.remainingMinutes === 0 && percent >= 100;
  return (
    <div className="live-progress">
      <div className="live-progress-head">
        <strong>
          {overdue
            ? "Finishing up"
            : `${tracking.remainingMinutes ?? "—"} min left`}
        </strong>
        <span>Ends around {formatClock(tracking.expectedEndAt)}</span>
      </div>
      <div
        className="live-progress-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`${who} service progress`}
      >
        <span
          style={{ transform: `scaleX(${Math.min(percent, 100) / 100})` }}
        />
      </div>
      <small>Started at {formatClock(tracking.serviceStartedAt)}</small>
    </div>
  );
}
