import {
  canEmployeePerformServices,
  getTodayDate,
  toHourMinute,
} from "../model/booking.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";

import { getSalonByIdApi } from "../../salons/api/salonApi.js";
import { getActiveSalonServicesApi } from "../../services/api/salonServicesApi.js";
import { getSalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";
import { getPaymentOptionsApi } from "../../payments/api/paymentApi.js";
import {
  createBookingApi,
  getBookingAvailabilityApi,
} from "../api/bookingApi.js";
import t from "../../../shared/i18n/t.js";

export const BOOKING_STEPS = [
  { key: "services", label: t("Service") },
  { key: "professional", label: t("Professional") },
  { key: "time", label: t("Date & time") },
  { key: "review", label: t("Review") },
];

const DEFAULT_PAYMENT_OPTIONS = {
  methods: ["CASH"],
  defaultMethod: "CASH",
  freeCancelHours: 24,
};

const MAX_NOTE = 1000;
const MAX_LOCATION = 255;

/**
 * State for the booking wizard: services → professional → date & time → review.
 * An empty `selectedEmployeeId` means "the salon assigns a professional".
 */
export default function useCreateBooking() {
  const { salonId } = useParams();
  const location = useLocation();
  const preselectedServiceId = location.state?.selectedServiceId;
  // The salon page's menu can send several services for one visit.
  const preselectedServiceIds = location.state?.selectedServiceIds;
  // "Book with" on the salon's team section chooses the professional.
  const preselectedEmployeeId = location.state?.selectedEmployeeId;

  const [step, setStep] = useState(0);
  const [selectedServiceIds, setSelectedServiceIds] = useState(() => {
    if (Array.isArray(preselectedServiceIds)) {
      return preselectedServiceIds.map(Number).filter(Number.isFinite);
    }
    return preselectedServiceId ? [Number(preselectedServiceId)] : [];
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(() =>
    preselectedEmployeeId ? String(preselectedEmployeeId) : "",
  );
  const [bookingDate, setBookingDate] = useState(() => getTodayDate());
  const [bookingTime, setBookingTime] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);

  const loader = useCallback(
    async (signal) => {
      const [salon, services, employees, paymentOptions] = await Promise.all([
        getSalonByIdApi(salonId, { signal }).then(requireData),
        getActiveSalonServicesApi(salonId, { signal }).then(requireData),
        getSalonEmployeesApi(salonId, { signal })
          .then(requireData)
          .catch(() => []),
        // Cash always works; never block booking when the options fail to load.
        getPaymentOptionsApi(salonId, { signal })
          .then(requireData)
          .catch(() => null),
      ]);
      return {
        salon,
        paymentOptions: paymentOptions || DEFAULT_PAYMENT_OPTIONS,
        services: services || [],
        // The public list only contains active employees and has no status
        // field; keep the check for responses that do include one.
        employees: (employees || []).filter(
          (employee) => !employee.status || employee.status === "ACTIVE",
        ),
      };
    },
    [salonId],
  );
  // No toast: a salon that cannot load gets the full error page instead.
  const {
    data,
    loading,
    error: salonError,
    refetch: reloadSalon,
  } = useQuery(loader, { initialData: {} });
  const {
    salon = null,
    services = [],
    employees = [],
    paymentOptions = DEFAULT_PAYMENT_OPTIONS,
  } = data;
  const [chosenPaymentMethod, setPaymentMethod] = useState(null);
  // A salon's missed-visit rule can limit this customer to "Card now", or
  // to no online method at all; never fall back to cash in that case.
  const restricted = Boolean(paymentOptions.restricted);
  const paymentMethods = restricted
    ? paymentOptions.methods || []
    : paymentOptions.methods?.length
      ? paymentOptions.methods
      : DEFAULT_PAYMENT_OPTIONS.methods;
  const paymentRestriction = restricted
    ? {
        message:
          paymentOptions.restrictionMessage ||
          t("This salon limits online booking for your account."),
        blocked: paymentMethods.length === 0,
      }
    : null;
  const paymentMethod = paymentMethods.includes(chosenPaymentMethod)
    ? chosenPaymentMethod
    : paymentOptions.defaultMethod || paymentMethods[0];

  const selectedServices = useMemo(
    () =>
      services.filter((service) =>
        selectedServiceIds.includes(Number(service.id)),
      ),
    [services, selectedServiceIds],
  );
  const eligibleEmployees = useMemo(
    () =>
      employees.filter((employee) =>
        canEmployeePerformServices(employee, selectedServiceIds),
      ),
    [employees, selectedServiceIds],
  );
  const selectedEmployee = useMemo(
    () =>
      employees.find(
        (employee) => Number(employee.id) === Number(selectedEmployeeId),
      ) || null,
    [employees, selectedEmployeeId],
  );
  const totalPrice = selectedServices.reduce(
    (total, service) => total + Number(service.price || 0),
    0,
  );
  const totalDuration = selectedServices.reduce(
    (total, service) => total + Number(service.durationMinutes || 0),
    0,
  );

  const availabilityReady =
    step >= 2 &&
    Boolean(bookingDate) &&
    selectedServiceIds.length > 0 &&
    selectedServices.length === selectedServiceIds.length;
  const availabilityLoader = useCallback(
    async (signal) => {
      if (!availabilityReady) return null;
      const response = await getBookingAvailabilityApi(
        {
          salonId: Number(salonId),
          serviceIds: selectedServiceIds,
          bookingDate,
          employeeId: selectedEmployeeId ? Number(selectedEmployeeId) : null,
        },
        { signal },
      );
      return requireData(response, t("Unable to load available times"));
    },
    [
      availabilityReady,
      bookingDate,
      salonId,
      selectedEmployeeId,
      selectedServiceIds,
    ],
  );
  const {
    data: availability,
    error: availabilityQueryError,
    loading: availabilityQueryLoading,
    refetch: reloadAvailability,
  } = useQuery(availabilityLoader, { initialData: null });
  const availabilityLoading = availabilityReady && availabilityQueryLoading;
  const availabilityError = availabilityQueryError
    ? availabilityQueryError?.response?.data?.message ||
      availabilityQueryError?.message ||
      t("Unable to load available times")
    : "";
  const availableSlots = availability?.slots || [];

  const toggleService = (serviceId) => {
    const id = Number(serviceId);
    const nextIds = selectedServiceIds.includes(id)
      ? selectedServiceIds.filter((item) => item !== id)
      : [...selectedServiceIds, id];
    setSelectedServiceIds(nextIds);
    setBookingTime("");
    // Keep the chosen professional only if they can still do every service.
    if (
      selectedEmployee &&
      !canEmployeePerformServices(selectedEmployee, nextIds)
    ) {
      setSelectedEmployeeId("");
    }
  };

  const chooseEmployee = (employeeId) => {
    setSelectedEmployeeId(employeeId ? String(employeeId) : "");
    setBookingTime("");
  };

  const chooseDate = (value) => {
    setBookingDate(value);
    setBookingTime("");
  };

  /** Shortcut when the chosen professional has no time: let the salon assign. */
  const switchToSalonAssigns = () => chooseEmployee("");

  const stepError = (index) => {
    if (index === 0 && selectedServices.length === 0) {
      return t("Choose at least one service.");
    }
    if (index === 0 && eligibleEmployees.length === 0) {
      return t(
        "No professional at this salon can do all the selected services together. Remove one service to continue.",
      );
    }
    if (index === 2 && !bookingTime) {
      return t("Choose a time to continue.");
    }
    if (index === 3) {
      if (paymentRestriction?.blocked) {
        return paymentRestriction.message;
      }
      if (customerLocation.trim().length === 0) {
        return t("Tell the salon where you are coming from.");
      }
      if (customerLocation.trim().length > MAX_LOCATION) {
        return t("Keep the area under {MAX_LOCATION} characters.", {
          MAX_LOCATION,
        });
      }
      if (note.trim().length > MAX_NOTE) {
        return t("Keep the note under {MAX_NOTE} characters.", { MAX_NOTE });
      }
    }
    return "";
  };

  const canContinue = !stepError(step);

  const goNext = () => {
    const error = stepError(step);
    if (error) {
      showErrorToast(error);
      return;
    }
    setStep((current) => Math.min(current + 1, BOOKING_STEPS.length - 1));
  };
  const goBack = () => setStep((current) => Math.max(current - 1, 0));
  const goToStep = (index) => {
    // Only allow jumping back, or forward over steps that are already valid.
    for (let i = 0; i < index; i += 1) {
      if (stepError(i)) return;
    }
    setStep(index);
  };

  const submit = async () => {
    for (let i = 0; i < BOOKING_STEPS.length; i += 1) {
      const error = stepError(i);
      if (error) {
        setStep(i);
        setSubmitError(error);
        return;
      }
    }
    setSubmitError("");
    try {
      setSubmitting(true);
      const response = await createBookingApi({
        salonId: Number(salonId),
        serviceIds: selectedServiceIds,
        assignedEmployeeId: selectedEmployeeId
          ? Number(selectedEmployeeId)
          : null,
        customerPhoneNumber: customerPhoneNumber.trim() || null,
        customerLocation: customerLocation.trim(),
        bookingDate,
        bookingTime: toHourMinute(bookingTime),
        note: note.trim() || null,
        paymentMethod,
      });
      if (response.success) {
        setCreatedBooking(response.data);
        return;
      }
      const message = response.message || t("The request could not be sent.");
      setSubmitError(message);
      // The time was taken while the customer was deciding: go back and refresh.
      if (/no longer available|opening hours|not working/i.test(message)) {
        setBookingTime("");
        setStep(2);
        reloadAvailability();
      }
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          t("The request could not be sent."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    salon,
    salonError,
    reloadSalon,
    services,
    loading,
    step,
    goNext,
    goBack,
    goToStep,
    canContinue,
    selectedServiceIds,
    selectedServices,
    toggleService,
    eligibleEmployees,
    selectedEmployeeId,
    selectedEmployee,
    chooseEmployee,
    switchToSalonAssigns,
    bookingDate,
    chooseDate,
    bookingTime,
    setBookingTime,
    availability,
    availableSlots,
    availabilityLoading,
    availabilityError,
    reloadAvailability,
    customerPhoneNumber,
    setCustomerPhoneNumber,
    customerLocation,
    setCustomerLocation,
    note,
    setNote,
    totalPrice,
    totalDuration,
    paymentMethods,
    paymentMethod,
    setPaymentMethod,
    paymentRestriction,
    freeCancelHours: paymentOptions.freeCancelHours ?? 24,
    submitting,
    submitError,
    submit,
    createdBooking,
  };
}
