import { useState } from "react";

import { createReviewApi } from "../api/reviewApi.js";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../shared/notifications/toast.jsx";
import t from "../../../shared/i18n/t.js";

export default function useCreateReviewModal({
  booking,
  onClose,
  onReviewCreated,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async () => {
    if (!booking?.id) {
      showErrorToast(t("Booking was not found."), t("Review failed"));
      return;
    }

    if (rating < 1 || rating > 5) {
      showWarningToast(
        t("Please choose a rating between 1 and 5."),
        t("Invalid rating"),
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await createReviewApi({
        bookingId: booking.id,
        rating,
        comment: comment.trim(),
      });

      if (response.success) {
        showSuccessToast(
          t("Thank you for sharing your experience."),
          t("Review added"),
        );

        if (onReviewCreated) {
          onReviewCreated(response.data);
        }

        onClose();
      } else {
        showErrorToast(
          response.message || t("Could not add review."),
          t("Review failed"),
        );
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          t("Could not add review."),
        t("Review failed"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { rating, setRating, comment, setComment, submitting, submitReview };
}
