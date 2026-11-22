import useCreateReviewModal from "../hooks/useCreateReviewModal.js";

import { MessageSquareText, X } from "lucide-react";

import RatingStars from "./RatingStars.jsx";
import t from "../../../shared/i18n/t.js";

function CreateReviewModal({ booking, onClose, onReviewCreated }) {
  const { rating, setRating, comment, setComment, submitting, submitReview } =
    useCreateReviewModal({ booking, onClose, onReviewCreated });
  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <button className="review-modal-close" type="button" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="review-modal-icon">
          <MessageSquareText size={28} />
        </div>

        <span className="eyebrow">{t("Salon review")}</span>
        <h2>{t("How was your appointment?")}</h2>

        <p className="review-modal-subtitle">
          {t("Your review helps other customers choose the right salon.")}
        </p>

        <div className="review-booking-summary">
          <div>
            <strong>{t("Salon")}</strong>
            <span>{booking?.salonName}</span>
          </div>

          <div>
            <strong>{t("Appointment")}</strong>
            <span>
              {booking?.bookingDate} •{" "}
              {booking?.bookingTime?.toString().slice(0, 5)}
            </span>
          </div>
        </div>

        <div className="review-input-group">
          <label>{t("Your rating")}</label>
          <RatingStars rating={rating} onChange={setRating} size={32} />
        </div>

        <div className="review-input-group">
          <label>{t("Your comment")}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t(
              "Example: The service was clean, fast, and professional...",
            )}
          />
        </div>

        <div className="review-modal-actions">
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            {t("Cancel")}
          </button>

          <button
            className="btn btn-primary"
            type="button"
            onClick={submitReview}
            disabled={submitting}
          >
            {submitting ? t("Sending...") : t("Submit Review")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateReviewModal;
