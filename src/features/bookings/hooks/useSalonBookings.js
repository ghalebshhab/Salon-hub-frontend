import { getStatusClass } from "../model/booking.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useEffect, useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";

import {
  acceptBookingApi,
  assignEmployeeToBookingApi,
  completeBookingApi,
  getMySalonBookingsApi,
  getBookingRescheduleAvailabilityApi,
  proposeBookingRescheduleApi,
  rejectBookingApi,
} from "../api/bookingApi.js";
import { getMySalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";

export default function useSalonBookings() {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [assignmentBooking, setAssignmentBooking] = useState(null);
  const [replacementEmployeeId, setReplacementEmployeeId] = useState("");
  const [assignmentNote, setAssignmentNote] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleNote, setRescheduleNote] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");
  const [rescheduleSaving, setRescheduleSaving] = useState(false);

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

  const openAssignment = (booking, employeeId) => {
    if (!employeeId) return;
    const employee = employees.find(
      (item) => Number(item.id) === Number(employeeId),
    );
    const note = booking.assignedEmployeeName
      ? `${booking.assignedEmployeeName} is unavailable for your appointment, so we’ve assigned ${employee?.fullName || "another qualified employee"} instead.`
      : `We’ve assigned ${employee?.fullName || "an employee"} to your appointment.`;
    setAssignmentBooking(booking);
    setReplacementEmployeeId(String(employeeId));
    setAssignmentNote(note);
  };

  const closeAssignment = () => {
    if (assigning) return;
    setAssignmentBooking(null);
    setReplacementEmployeeId("");
    setAssignmentNote("");
  };

  const submitAssignment = async () => {
    if (!assignmentBooking || !replacementEmployeeId) return;
    if (!assignmentNote.trim()) {
      showErrorToast("Add a short update for the customer.");
      return;
    }

    try {
      setAssigning(true);
      const response = await assignEmployeeToBookingApi(
        assignmentBooking.id,
        replacementEmployeeId,
        { ownerNote: assignmentNote.trim() },
      );

      if (response.success) {
        showSuccessToast("Employee assigned and customer update saved.");
        setAssignmentBooking(null);
        setReplacementEmployeeId("");
        setAssignmentNote("");
        loadBookings();
      } else {
        showErrorToast(
          response.message || "Could not assign employee.",
          "Failed",
        );
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Could not assign employee.",
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleAccept = async (booking) => {
    try {
      const response = await acceptBookingApi(booking.id, {
        ownerNote: "Accepted, please come on time.",
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
      showErrorToast(error?.message || "Failed to accept booking");
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setSelectedBooking(null);
    setRejectReason("");
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
      showErrorToast(error?.message || "Failed to reject booking");
    } finally {
      setRejecting(false);
    }
  };

  const openReschedule = (booking) => {
    setRescheduleBooking(booking);
    setRescheduleDate(booking.bookingDate || "");
    setRescheduleTime("");
    setRescheduleNote("");
    setRescheduleSlots([]);
    setRescheduleError("");
  };

  const closeReschedule = () => {
    if (rescheduleSaving) return;
    setRescheduleBooking(null);
    setRescheduleDate("");
    setRescheduleTime("");
    setRescheduleNote("");
    setRescheduleSlots([]);
    setRescheduleError("");
  };

  useEffect(() => {
    if (!rescheduleBooking || !rescheduleDate) {
      return undefined;
    }

    const controller = new AbortController();
    const loadRescheduleAvailability = async () => {
      try {
        setRescheduleLoading(true);
        setRescheduleError("");
        setRescheduleTime("");
        const response = await getBookingRescheduleAvailabilityApi(
          rescheduleBooking.id,
          rescheduleDate,
          { signal: controller.signal },
        );
        if (!response.success) {
          setRescheduleSlots([]);
          setRescheduleError(
            response.message || "Could not load appointment times.",
          );
          return;
        }
        const slots = (response.data?.slots || []).filter(
          (slot) =>
            !(
              rescheduleDate === rescheduleBooking.bookingDate &&
              slot.time?.toString().slice(0, 5) ===
                rescheduleBooking.bookingTime?.toString().slice(0, 5)
            ),
        );
        setRescheduleSlots(slots);
      } catch (error) {
        if (error?.code !== "ERR_CANCELED") {
          setRescheduleSlots([]);
          setRescheduleError(
            error?.response?.data?.message ||
              error?.message ||
              "Could not load appointment times.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setRescheduleLoading(false);
      }
    };

    loadRescheduleAvailability();
    return () => controller.abort();
  }, [rescheduleBooking, rescheduleDate]);

  const changeRescheduleDate = (value) => {
    setRescheduleDate(value);
    setRescheduleTime("");
    setRescheduleSlots([]);
    setRescheduleError("");
  };

  const submitReschedule = async () => {
    if (!rescheduleBooking || !rescheduleDate || !rescheduleTime) {
      showErrorToast("Choose a new date and available time.");
      return;
    }

    try {
      setRescheduleSaving(true);
      const response = await proposeBookingRescheduleApi(rescheduleBooking.id, {
        proposedDate: rescheduleDate,
        proposedTime: rescheduleTime,
        note: rescheduleNote.trim() || null,
      });
      if (!response.success) {
        showErrorToast(response.message || "Could not send the proposal.");
        return;
      }
      showSuccessToast(response.message || "Reschedule proposal sent.");
      setRescheduleBooking(null);
      setRescheduleDate("");
      setRescheduleTime("");
      setRescheduleNote("");
      setRescheduleSlots([]);
      loadBookings();
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Could not send the proposal.",
      );
    } finally {
      setRescheduleSaving(false);
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
      showErrorToast(error?.message || "Failed to complete booking");
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
    rejecting,
    assignmentBooking,
    replacementEmployeeId,
    setReplacementEmployeeId,
    assignmentNote,
    setAssignmentNote,
    assigning,
    openAssignment,
    closeAssignment,
    submitAssignment,
    handleAccept,
    openRejectModal,
    closeRejectModal,
    submitReject,
    handleComplete,
    rescheduleBooking,
    rescheduleDate,
    setRescheduleDate: changeRescheduleDate,
    rescheduleTime,
    setRescheduleTime,
    rescheduleNote,
    setRescheduleNote,
    rescheduleSlots,
    rescheduleLoading,
    rescheduleError,
    rescheduleSaving,
    openReschedule,
    closeReschedule,
    submitReschedule,
    getStatusClass,
  };
}
