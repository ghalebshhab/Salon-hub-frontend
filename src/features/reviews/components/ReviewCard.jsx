import { UserRound } from "lucide-react";
import RatingStars from "./RatingStars.jsx";

function ReviewCard({ review }) {
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-user">
          <div className="review-avatar">
            <UserRound size={20} />
          </div>

          <div>
            <h3>{review.customerName || "Customer"}</h3>
            <p>{formatDate(review.createdAt)}</p>
          </div>
        </div>

        <RatingStars rating={review.rating} readonly size={18} />
      </div>

      <p className="review-comment">
        {review.comment || "No comment provided."}
      </p>
    </div>
  );
}

export default ReviewCard;
