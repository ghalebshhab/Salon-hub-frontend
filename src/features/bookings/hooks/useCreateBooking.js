import { getTodayDate } from "../model/booking.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";

import { getSalonByIdApi } from "../../salons/api/salonApi.js";
import { getActiveSalonServicesApi } from "../../services/api/salonServicesApi.js";
import { getSalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";
import { createBookingApi } from "../api/bookingApi.js";

export default function useCreateBooking() {
  const { salonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedServiceIdFromState = location.state?.selectedServiceId;

  const [selectedServiceIds, setSelectedServiceIds] = useState(() =>
    selectedServiceIdFromState ? [Number(selectedServiceIdFromState)] : [],
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loader = useCallback(
    async (signal) => {
      const [salon, services, employees] = await Promise.all([
        getSalonByIdApi(salonId, { signal }).then(requireData),
        getActiveSalonServicesApi(salonId, { signal }).then(requireData),
        getSalonEmployeesApi(salonId, { signal })
          .then(requireData)
          .catch(() => []),
      ]);
      return {
        salon,
        services: services || [],
        employees: (employees || []).filter(
          (employee) => employee.status === "ACTIVE",
        ),
      };
    },
    [salonId],
  );
  const { data, loading } = useQuery(loader, {
    initialData: {},
    onError: showErrorToast,
  });
  const { salon = null, services = [], employees = [] } = data;

  const selectedServices = useMemo(() => {
    return services.filter((service) =>
      selectedServiceIds.includes(Number(service.id)),
    );
  }, [services, selectedServiceIds]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce(
      (total, service) => total + Number(service.price || 0),
      0,
    );
  }, [selectedServices]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce(
      (total, service) => total + Number(service.durationMinutes || 0),
      0,
    );
  }, [selectedServices]);

  const handleServiceToggle = (serviceId) => {
    const id = Number(serviceId);

    setSelectedServiceIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  const validateForm = () => {
    if (
      selectedServices.length === 0 ||
      selectedServices.length !== selectedServiceIds.length
    ) {
      showErrorToast("Please choose at least one service");
      return false;
    }

    if (!customerPhoneNumber.trim()) {
      showErrorToast("Phone number is required");
      return false;
    }

    if (!customerLocation.trim()) {
      showErrorToast("Location is required");
      return false;
    }

    if (!bookingDate) {
      showErrorToast("Booking date is required");
      return false;
    }

    if (!bookingTime) {
      showErrorToast("Booking time is required");
      return false;
    }

    if (bookingDate < getTodayDate()) {
      showErrorToast("Please choose today or a future date");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const bookingData = {
        salonId: Number(salonId),
        serviceIds: selectedServiceIds,
        assignedEmployeeId: selectedEmployeeId
          ? Number(selectedEmployeeId)
          : null,
        customerPhoneNumber: customerPhoneNumber.trim(),
        customerLocation: customerLocation.trim(),
        bookingDate,
        bookingTime,
        note: note.trim(),
      };

      const response = await createBookingApi(bookingData);

      if (response.success) {
        showSuccessToast(response.message || "Booking created successfully");
        navigate("/my-bookings");
      } else {
        showErrorToast(response.message || "Failed to create booking");
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.response?.data?.message || "Failed to create booking",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    salon,
    services,
    employees,
    selectedServiceIds,
    selectedEmployeeId,
    setSelectedEmployeeId,
    customerPhoneNumber,
    setCustomerPhoneNumber,
    customerLocation,
    setCustomerLocation,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    note,
    setNote,
    loading,
    submitting,
    selectedServices,
    totalPrice,
    totalDuration,
    handleServiceToggle,
    getTodayDate,
    handleSubmit,
  };
}
