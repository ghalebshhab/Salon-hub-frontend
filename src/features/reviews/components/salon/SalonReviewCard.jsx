import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { memberProfilePath } from "../../../community/model/communityRoutes.js";
import StarRating from "../StarRating.jsx";
import {
  COMMENT_PREVIEW_LENGTH,
  avatarTone,
  fullDate,
  relativeDate,
  reviewerInitials,
  reviewerName,
} from "../../model/salonReviews.js";
import t from "../../../../shared/i18n/t.js";

/** One guest review. Every review comes from a completed booking. */
/** The reviewer's circle: their photo or initials. */
function ReviewerAvatar({ review }) {
  const tone = avatarTone(review.customerId ?? review.customerName);
  return (
    <span className={`rv-avatar tone-${tone}`} aria-hidden="true">
      {review.customerProfilePictureUrl ? (
        <img src={review.customerProfilePictureUrl} alt="" loading="lazy" />
      ) : (
        reviewerInitials(review.customerName)
      )}
    </span>
  );
}

export default function SalonReviewCard({ review, featured = false }) {
  const [expanded, setExpanded] = useState(false);
  const comment = review.comment?.trim() || "";
  const long = comment.length > COMMENT_PREVIEW_LENGTH;
  const name = reviewerName(review.customerName);
  const profilePath = review.customerId
    ? memberProfilePath(review.customerId)
    : null;
  const shown =
    long && !expanded
      ? `${comment.slice(0, COMMENT_PREVIEW_LENGTH).trimEnd()}…`
      : comment;

  return (
    <article className={`rv-card${featured ? " is-featured" : ""}`}>
      <header className="rv-card-head">
        {profilePath ? (
          <Link
            className="rv-avatar-link"
            to={profilePath}
            tabIndex={-1}
            aria-hidden="true"
          >
            <ReviewerAvatar review={review} />
          </Link>
        ) : (
          <ReviewerAvatar review={review} />
        )}
        <div className="rv-card-who">
          <h3>
            {profilePath ? (
              <Link
                className="rv-name-link"
                to={profilePath}
                title={t("View {name}'s profile", { name })}
              >
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>
          <span className="rv-verified">
            <BadgeCheck size={14} aria-hidden="true" />
            {t("Verified visit")}
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
              {expanded ? t("Show less") : t("Read more")}
            </button>
          )}
        </p>
      ) : (
        <p className="rv-card-comment is-empty">
          {t("Rated without a comment.")}
        </p>
      )}
    </article>
  );
}
