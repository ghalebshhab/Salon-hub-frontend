import { getStatusClass, canCancel } from "../model/booking.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const previousStatuses = useRef(null);
  useEffect(() => {
    const previous = previousStatuses.current;
    if (previous) {
      bookings.forEach((booking) => {
        const oldStatus = previous.get(booking.id);
        if (oldStatus === booking.status) return;
        if (booking.status === "ACCEPTED") {
          showSuccessToast(
            `Your appointment at ${booking.salonName} was accepted.`,
          );
        } else if (booking.status === "REJECTED") {
          showErrorToast(
            `Your appointment at ${booking.salonName} was declined.`,
          );
        }
      });
    }
    previousStatuses.current = new Map(
      bookings.map((booking) => [booking.id, booking.status]),
    );
  }, [bookings]);

  useEffect(() => {
    const intervalId = window.setInterval(() => loadBookings(), 30_000);
    return () => window.clearInterval(intervalId);
  }, [loadBookings]);

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
