import { getStatusClass } from "../model/booking.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";

import {
  acceptBookingApi,
  assignEmployeeToBookingApi,
  completeBookingApi,
  getMySalonBookingsApi,
  rejectBookingApi,
} from "../api/bookingApi.js";
import { getMySalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";

export default function useSalonBookings() {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [suggestedTime, setSuggestedTime] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const loader = useCallback(async (signal) => {
    const [bookings, employees] = await Promise.all([
      getMySalonBookingsApi({ signal }).then(requireData),
      getMySalonEmployeesApi({ signal })
        .then(requireData)
        .catch(() => []),
    ]);
    return {
      bookings: bookings || [],
      employees: (employees || []).filter(
        (employee) => employee.status === "ACTIVE",
      ),
    };
  }, []);
  const {
    data,
    loading,
    refetch: loadBookings,
  } = useQuery(loader, { initialData: {}, onError: showErrorToast });
  const { bookings = [], employees = [] } = data;

  const handleAssignEmployee = async (bookingId, employeeId) => {
    if (!employeeId) return;

    try {
      const response = await assignEmployeeToBookingApi(bookingId, employeeId);

      if (response.success) {
        showSuccessToast("Employee assigned successfully.", "Assigned");
        loadBookings();
      } else {
        showErrorToast(
          response.message || "Could not assign employee.",
          "Failed",
        );
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Could not assign employee.", "Failed");
    }
  };

  const handleAccept = async (booking) => {
    try {
      const response = await acceptBookingApi(booking.id, {
        ownerNote: "Accepted, please come on time.",
        ownerSuggestedTime: null,
        assignedEmployeeId: booking.assignedEmployeeId || null,
      });

      if (response.success) {
        showSuccessToast(response.message || "Booking accepted");
        loadBookings();
      } else {
        showErrorToast(response.message || "Failed to accept booking");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to accept booking");
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setRejectReason("");
    setSuggestedTime("");
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setSelectedBooking(null);
    setRejectReason("");
    setSuggestedTime("");
    setRejecting(false);
  };

  const submitReject = async () => {
    if (!selectedBooking) return;

    if (!rejectReason.trim()) {
      showErrorToast("Please write the rejection reason");
      return;
    }

    try {
      setRejecting(true);

      const response = await rejectBookingApi(selectedBooking.id, {
        ownerNote: rejectReason.trim(),
        ownerSuggestedTime: suggestedTime || null,
      });

      if (response.success) {
        showSuccessToast("Rejection sent to customer");
        closeRejectModal();
        loadBookings();
      } else {
        showErrorToast(response.message || "Failed to reject booking");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to reject booking");
    } finally {
      setRejecting(false);
    }
  };

  const handleComplete = async (bookingId) => {
    const confirmComplete = window.confirm(
      "Are you sure this booking is completed?",
    );

    if (!confirmComplete) return;

    try {
      const response = await completeBookingApi(bookingId);

      if (response.success) {
        showSuccessToast(response.message || "Booking completed");
        loadBookings();
      } else {
        showErrorToast(response.message || "Failed to complete booking");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to complete booking");
    }
  };

  return {
    bookings,
    employees,
    loading,
    rejectModalOpen,
    selectedBooking,
    rejectReason,
    setRejectReason,
    suggestedTime,
    setSuggestedTime,
    rejecting,
    handleAssignEmployee,
    handleAccept,
    openRejectModal,
    closeRejectModal,
    submitReject,
    handleComplete,
    getStatusClass,
  };
}
