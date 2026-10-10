import { useState } from "react";

import { createReviewApi } from "../api/reviewApi.js";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../shared/notifications/toast.jsx";

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
      showErrorToast("Booking was not found.", "Review failed");
      return;
    }

    if (rating < 1 || rating > 5) {
      showWarningToast(
        "Please choose a rating between 1 and 5.",
        "Invalid rating",
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
          "Thank you for sharing your experience.",
          "Review added",
        );

        if (onReviewCreated) {
          onReviewCreated(response.data);
        }

        onClose();
      } else {
        showErrorToast(
          response.message || "Could not add review.",
          "Review failed",
        );
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.response?.data?.message || "Could not add review.",
        "Review failed",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { rating, setRating, comment, setComment, submitting, submitReview };
}
