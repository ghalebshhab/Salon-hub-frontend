import { useMemo, useState } from "react";
import { MessageSquareQuote, RefreshCw } from "lucide-react";
import useReviewsList from "../hooks/useReviewsList.js";
import ReviewOverview from "./salon/ReviewOverview.jsx";
import SalonReviewCard from "./salon/SalonReviewCard.jsx";
import {
  REVIEWS_PAGE_SIZE,
  REVIEW_SORTS,
  REVIEW_TOOLS_MIN,
  featuredReview,
  happyShare,
  ratingBreakdown,
  visibleReviews,
} from "../model/salonReviews.js";

function ReviewsSkeleton() {
  return (
    <div className="rv" aria-hidden="true">
      <div className="rv-overview is-skeleton">
        <span className="rv-skeleton-line is-big" />
        {[0, 1, 2, 3, 4].map((item) => (
          <span className="rv-skeleton-line" key={item} />
        ))}
      </div>
      <div className="rv-feed">
        {[0, 1].map((item) => (
          <div className="rv-card is-skeleton" key={item}>
            <span className="rv-skeleton-line is-short" />
            <span className="rv-skeleton-line" />
            <span className="rv-skeleton-line" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Guest reviews on the salon page: a score card with a star breakdown
 * (the bars filter the list), one highlighted review, then the rest.
 */
function ReviewsList({ salonId }) {
  const { loading, error, refetch, reviews, summary } = useReviewsList({
    salonId,
  });
  const [stars, setStars] = useState(null);
  const [sort, setSort] = useState("newest");
  const [shownCount, setShownCount] = useState(REVIEWS_PAGE_SIZE);

  const breakdown = useMemo(() => ratingBreakdown(reviews), [reviews]);
  const happy = useMemo(() => happyShare(reviews), [reviews]);
  const featured = useMemo(() => featuredReview(reviews), [reviews]);
  const filtered = useMemo(
    () => visibleReviews(reviews, { stars, sort }),
    [reviews, stars, sort],
  );

  if (loading) return <ReviewsSkeleton />;

  if (error && !reviews.length) {
    return (
      <div className="rv-empty" role="alert">
        <h3>The reviews could not be loaded</h3>
        <p>Check your connection and try again.</p>
        <button className="btn btn-secondary" type="button" onClick={refetch}>
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="rv-empty">
        <span className="rv-empty-icon" aria-hidden="true">
          <MessageSquareQuote size={24} />
        </span>
        <h3>No reviews yet</h3>
        <p>
          Guests can review the salon after a completed visit. Book a visit and
          be the first to share how it went.
        </p>
      </div>
    );
  }

  // The highlight shows only in the default view, and not twice.
  const showFeatured = featured && !stars && sort === "newest";
  const rest = showFeatured
    ? filtered.filter((review) => review.id !== featured.id)
    : filtered;
  const page = rest.slice(0, shownCount);
  const hidden = rest.length - page.length;
  const showTools = reviews.length >= REVIEW_TOOLS_MIN || stars !== null;

  const pickStars = (value) => {
    setStars(value);
    setShownCount(REVIEWS_PAGE_SIZE);
  };

  return (
    <div className="rv">
      <ReviewOverview
        summary={summary}
        breakdown={breakdown}
        happy={happy}
        activeStars={stars}
        onPickStars={pickStars}
      />

      <div className="rv-feed">
        {showTools && (
          <div className="rv-tools">
            <p className="rv-showing" aria-live="polite">
              {stars ? (
                <>
                  Showing {filtered.length} {stars}-star{" "}
                  {filtered.length === 1 ? "review" : "reviews"}
                  <button
                    type="button"
                    className="rv-clear"
                    onClick={() => pickStars(null)}
                  >
                    Show all
                  </button>
                </>
              ) : (
                `All ${reviews.length} reviews`
              )}
            </p>
            <label className="rv-sort">
              <span className="sr-only">Sort reviews</span>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setShownCount(REVIEWS_PAGE_SIZE);
                }}
              >
                {REVIEW_SORTS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {showFeatured && <SalonReviewCard review={featured} featured />}

        {page.length > 0 && (
          <ul className="rv-list">
            {page.map((review) => (
              <li key={review.id}>
                <SalonReviewCard review={review} />
              </li>
            ))}
          </ul>
        )}

        {hidden > 0 && (
          <button
            type="button"
            className="btn btn-secondary rv-show-more"
            onClick={() => setShownCount((count) => count + REVIEWS_PAGE_SIZE)}
          >
            Show {Math.min(hidden, REVIEWS_PAGE_SIZE)} more{" "}
            {hidden === 1 ? "review" : "reviews"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ReviewsList;
