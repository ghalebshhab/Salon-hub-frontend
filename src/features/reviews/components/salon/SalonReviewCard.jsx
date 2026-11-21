import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import StarRating from "../StarRating.jsx";
import {
  COMMENT_PREVIEW_LENGTH,
  avatarTone,
  fullDate,
  relativeDate,
  reviewerInitials,
  reviewerName,
} from "../../model/salonReviews.js";

/** One guest review. Every review comes from a completed booking. */
export default function SalonReviewCard({ review, featured = false }) {
  const [expanded, setExpanded] = useState(false);
  const comment = review.comment?.trim() || "";
  const long = comment.length > COMMENT_PREVIEW_LENGTH;
  const shown =
    long && !expanded
      ? `${comment.slice(0, COMMENT_PREVIEW_LENGTH).trimEnd()}…`
      : comment;

  return (
    <article className={`rv-card${featured ? " is-featured" : ""}`}>
      <header className="rv-card-head">
        <span
          className={`rv-avatar tone-${avatarTone(review.customerId ?? review.customerName)}`}
          aria-hidden="true"
        >
          {reviewerInitials(review.customerName)}
        </span>
        <div className="rv-card-who">
          <h3>{reviewerName(review.customerName)}</h3>
          <span className="rv-verified">
            <BadgeCheck size={14} aria-hidden="true" />
            Verified visit
          </span>
        </div>
        <time
          className="rv-card-date"
          dateTime={review.createdAt}
          title={fullDate(review.createdAt)}
        >
          {relativeDate(review.createdAt)}
        </time>
      </header>

      <StarRating value={review.rating} size={featured ? 18 : 15} />

      {comment ? (
        <p className="rv-card-comment">
          {featured ? <q>{shown}</q> : shown}
          {long && (
            <button
              type="button"
              className="rv-more"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      ) : (
        <p className="rv-card-comment is-empty">Rated without a comment.</p>
      )}
    </article>
  );
}
