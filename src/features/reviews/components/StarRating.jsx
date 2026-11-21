import { Star } from "lucide-react";

/**
 * Read-only stars with part fill (4.5 shows four and a half stars).
 * Screen readers hear one label, not five buttons.
 */
export default function StarRating({ value = 0, size = 16, className = "" }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span
      className={`star-rating ${className}`.trim()}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((position) => {
        const fill = Math.max(0, Math.min(1, rating - (position - 1)));
        return (
          <span className="star-rating-star" key={position} aria-hidden="true">
            <Star size={size} className="star-rating-empty" />
            <span
              className="star-rating-fill"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} fill="currentColor" />
            </span>
          </span>
        );
      })}
    </span>
  );
}
