import useReviewsList from "../hooks/useReviewsList.js";

import { Star } from "lucide-react";

import ReviewCard from "./ReviewCard.jsx";
import RatingStars from "./RatingStars.jsx";

function ReviewsList({ salonId }) {
  const { loading, reviews, summary } = useReviewsList({ salonId });
  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <div className="reviews-section">
      <div className="reviews-summary-card">
        <div className="reviews-summary-icon">
          <Star size={28} fill="currentColor" />
        </div>

        <div>
          <span className="eyebrow">Customer rating</span>
          <h2>{summary.averageRating || 0}/5</h2>
          <RatingStars
            rating={Math.round(summary.averageRating || 0)}
            readonly
          />
          <p>{summary.totalReviews || 0} customer reviews</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <h3>No reviews yet</h3>
          <p>Completed customer reviews will appear here.</p>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsList;
