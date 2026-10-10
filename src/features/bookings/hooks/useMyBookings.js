import { getStatusClass, canCancel } from "../model/booking.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";

import { cancelMyBookingApi, getMyBookingsApi } from "../api/bookingApi.js";

export default function useMyBookings() {
  const loader = useCallback(
    async (signal) => requireData(await getMyBookingsApi({ signal })) || [],
    [],
  );
  const {
    data: bookings,
    loading,
    refetch: loadBookings,
  } = useQuery(loader, { initialData: [], onError: showErrorToast });

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmCancel) return;

    try {
      const response = await cancelMyBookingApi(bookingId);

      if (response.success) {
        showSuccessToast(response.message || "Booking cancelled successfully");
        loadBookings();
      } else {
        showErrorToast(response.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to cancel booking");
    }
  };
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState(null);
  const openReviewModal = (booking) => {
    setSelectedReviewBooking(booking);
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedReviewBooking(null);
    setReviewModalOpen(false);
  };

  const handleReviewCreated = () => {
    loadBookings();
  };

  return {
    bookings,
    loading,
    handleCancel,
    reviewModalOpen,
    selectedReviewBooking,
    openReviewModal,
    closeReviewModal,
    handleReviewCreated,
    getStatusClass,
    canCancel,
  };
}
