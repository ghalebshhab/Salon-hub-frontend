import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import { getMySalonServicesApi } from "../../services/api/salonServicesApi.js";
import {
  getEmployeeScheduleApi,
  getEmployeeServicesApi,
  updateEmployeeScheduleApi,
  updateEmployeeServicesApi,
} from "../api/salonEmployeesApi.js";

export const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function useManageEmployeeSetup() {
  const { employeeId } = useParams();
  const [serviceDraft, setServiceDraft] = useState(null);
  const [periodDraft, setPeriodDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const loader = useCallback(
    async (signal) => {
      const [capabilities, schedule, services] = await Promise.all([
        getEmployeeServicesApi(employeeId, { signal }).then(requireData),
        getEmployeeScheduleApi(employeeId, { signal }).then(requireData),
        getMySalonServicesApi({ signal }).then(requireData),
      ]);
      return {
        capabilities,
        schedule,
        services: (services || []).filter((service) => service.isActive),
      };
    },
    [employeeId],
  );
  const { data, loading, error, refetch } = useQuery(loader, {
    initialData: {},
    onError: showErrorToast,
  });
  const { capabilities, schedule, services = [] } = data;

  const serviceIds = useMemo(
    () =>
      serviceDraft ??
      capabilities?.services
        ?.filter((service) => service.active)
        .map((s) => s.id) ??
      [],
    [serviceDraft, capabilities],
  );
  const periods = periodDraft ?? schedule?.periods ?? [];

  const setDayPeriods = (dayOfWeek, updater) => {
    setPeriodDraft((current) => {
      const currentPeriods = current ?? schedule?.periods ?? [];
      const next = currentPeriods.filter(
        (period) => period.dayOfWeek !== dayOfWeek,
      );
      const dayPeriods = currentPeriods.filter(
        (period) => period.dayOfWeek === dayOfWeek,
      );
      return [...next, ...updater(dayPeriods)].sort(
        (a, b) =>
          WEEK_DAYS.indexOf(a.dayOfWeek) - WEEK_DAYS.indexOf(b.dayOfWeek),
      );
    });
  };

  const saveServices = async () => {
    setSaving(true);
    try {
      const response = await updateEmployeeServicesApi(employeeId, serviceIds);
      if (!response.success)
        throw new Error(response.message || "Could not save services.");
      showSuccessToast("Employee services updated.");
      setServiceDraft(null);
      refetch();
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error.message ||
          "Could not save services.",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveSchedule = async () => {
    if (periods.length > 28) {
      showErrorToast("An employee schedule can have up to 28 weekly periods.");
      return;
    }
    setSaving(true);
    try {
      const response = await updateEmployeeScheduleApi(employeeId, periods);
      if (!response.success)
        throw new Error(response.message || "Could not save schedule.");
      showSuccessToast("Employee schedule updated.");
      setPeriodDraft(null);
      refetch();
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error.message ||
          "Could not save schedule.",
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    employeeId,
    capabilities,
    schedule,
    services,
    serviceIds,
    periods,
    loading,
    error,
    saving,
    setServiceIds: setServiceDraft,
    setDayPeriods,
    saveServices,
    saveSchedule,
  };
}
