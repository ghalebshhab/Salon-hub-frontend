import { canCancel } from "../model/booking.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";

import {
  acceptBookingRescheduleApi,
  cancelMyBookingApi,
  confirmAttendanceApi,
  getMyBookingsApi,
  rejectBookingRescheduleApi,
} from "../api/bookingApi.js";
import { confirmAction } from "../../../shared/confirm/confirmStore.js";

export default function useMyBookings() {
  const [respondingProposalId, setRespondingProposalId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const loader = useCallback(
    async (signal) => requireData(await getMyBookingsApi({ signal })) || [],
    [],
  );
  const {
    data: bookings,
    loading,
    refetch: loadBookings,
  } = useQuery(loader, {
    initialData: [],
    onError: showErrorToast,
    keepPreviousData: true,
  });

  const previousStatuses = useRef(null);
  useEffect(() => {
    const previous = previousStatuses.current;
    if (previous) {
      bookings.forEach((booking) => {
        const oldBooking = previous.get(booking.id);
        if (!oldBooking) return;
        if (
          oldBooking.status !== booking.status &&
          booking.status === "ACCEPTED"
        ) {
          showSuccessToast(
            `Your appointment at ${booking.salonName} was accepted.`,
          );
        } else if (
          oldBooking.status !== booking.status &&
          booking.status === "REJECTED"
        ) {
          showErrorToast(
            `Your appointment at ${booking.salonName} was declined.`,
          );
        } else if (
          oldBooking.assignedEmployeeId !== booking.assignedEmployeeId &&
          booking.assignedEmployeeName
        ) {
          showSuccessToast(
            `Your service provider for ${booking.salonName} is now ${booking.assignedEmployeeName}. See the booking update for details.`,
          );
        }
      });
    }
    previousStatuses.current = new Map(
      bookings.map((booking) => [booking.id, booking]),
    );
  }, [bookings]);

  useEffect(() => {
    const hasBookingsNeedingUpdates = bookings.some((booking) => {
      if (booking.status === "PENDING") return true;
      if (booking.status !== "ACCEPTED") return false;
      const appointmentDate = new Date(
        `${booking.bookingDate}T${booking.bookingTime}`,
      );
      return appointmentDate > new Date();
    });
    if (!hasBookingsNeedingUpdates) return;

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") loadBookings();
    };
    const intervalId = window.setInterval(refreshWhenVisible, 30_000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [bookings, loadBookings]);

  const handleCancel = async (bookingId) => {
    const confirmCancel = await confirmAction({
      title: "Cancel this booking?",
      message: "The salon will be told that you cancelled.",
      confirmText: "Cancel booking",
      cancelText: "Keep booking",
      danger: true,
    });

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
      showErrorToast(error?.message || "Failed to cancel booking");
    }
  };

  const handleConfirmAttendance = async (bookingId) => {
    setConfirmingId(bookingId);
    try {
      const response = await confirmAttendanceApi(bookingId);
      if (!response.success) {
        showErrorToast(response.message || "Could not confirm your visit.");
        return;
      }
      showSuccessToast(response.message || "The salon knows you are coming.");
      loadBookings();
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Could not confirm your visit.",
      );
    } finally {
      setConfirmingId(null);
    }
  };

  const handleRescheduleDecision = async (bookingId, proposalId, accept) => {
    try {
      setRespondingProposalId(proposalId);
      const response = accept
        ? await acceptBookingRescheduleApi(bookingId, proposalId)
        : await rejectBookingRescheduleApi(bookingId, proposalId);
      if (!response.success) {
        showErrorToast(response.message || "Could not save your decision.");
        return;
      }
      showSuccessToast(response.message || "Your decision was saved.");
      loadBookings();
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Could not save your decision.",
      );
    } finally {
      setRespondingProposalId(null);
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
    handleConfirmAttendance,
    confirmingId,
    handleRescheduleDecision,
    respondingProposalId,
    reviewModalOpen,
    selectedReviewBooking,
    openReviewModal,
    closeReviewModal,
    handleReviewCreated,
    canCancel,
  };
}
