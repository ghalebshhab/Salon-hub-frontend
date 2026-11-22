import StarRating from "../StarRating.jsx";
import { ratingLabel, roundRating } from "../../model/salonReviews.js";
import t from "../../../../shared/i18n/t.js";

/**
 * The score card: average, label, total and one bar per star value.
 * The bars are buttons that filter the list below.
 */
export default function ReviewOverview({
  summary,
  breakdown,
  happy,
  activeStars,
  onPickStars,
}) {
  const average = roundRating(summary.averageRating);
  const total = Number(summary.totalReviews) || 0;

  return (
    <aside className="rv-overview" aria-label={t("Rating summary")}>
      <div className="rv-score">
        <strong className="rv-score-value">{average.toFixed(1)}</strong>
        <div className="rv-score-copy">
          <span className="rv-score-label">{ratingLabel(average)}</span>
          <StarRating value={average} size={18} />
          <span className="rv-score-total">
            {total} {total === 1 ? t("review") : t("reviews")}
          </span>
        </div>
      </div>

      <ul className="rv-bars">
        {breakdown.map((row) => {
          const active = activeStars === row.stars;
          return (
            <li key={row.stars}>
              <button
                type="button"
                className={`rv-bar${active ? " is-active" : ""}`}
                aria-pressed={active}
                disabled={!row.count}
                onClick={() => onPickStars(active ? null : row.stars)}
              >
                <span className="rv-bar-label">
                  {t("{stars} star", { stars: row.stars })}
                </span>
                <span className="rv-bar-track" aria-hidden="true">
                  <span
                    className="rv-bar-fill"
                    style={{ width: `${row.percent}%` }}
                  />
                </span>
                <span className="rv-bar-count">{row.count}</span>
                <span className="sr-only">
                  {row.count === 1 ? t(" review") : t(" reviews")}
                  {active ? t(", shown now") : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {total > 0 && (
        <p className="rv-happy">
          <strong>{happy}%</strong> {t("of guests gave 4 or 5 stars")}
        </p>
      )}
    </aside>
  );
}
