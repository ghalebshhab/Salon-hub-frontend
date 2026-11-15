import { useCallback, useState } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import {
  addEmployeeTimeOffApi,
  getEmployeeTimeOffApi,
  removeEmployeeTimeOffApi,
} from "../api/salonEmployeesApi.js";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

/**
 * Upcoming time off for one employee. `add` and `remove` resolve to
 * `{ ok, message, affectedBookings }` so the view decides how to tell the owner.
 */
export default function useEmployeeTimeOff(employeeId, { onError } = {}) {
  const [saving, setSaving] = useState(false);
  const loader = useCallback(
    async (signal) =>
      requireData(await getEmployeeTimeOffApi(employeeId, { signal })) || [],
    [employeeId],
  );
  const { data, loading, refetch } = useQuery(loader, {
    initialData: [],
    keepPreviousData: true,
    onError,
  });

  const add = async (timeOff) => {
    try {
      setSaving(true);
      const response = await addEmployeeTimeOffApi(employeeId, timeOff);
      if (!response.success) {
        return {
          ok: false,
          message: response.message || "Could not save the time off.",
        };
      }
      refetch();
      return {
        ok: true,
        message: response.message,
        affectedBookings: response.data?.affectedBookings || 0,
      };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, "Could not save the time off."),
      };
    } finally {
      setSaving(false);
    }
  };

  const remove = async (timeOffId) => {
    try {
      const response = await removeEmployeeTimeOffApi(timeOffId);
      if (!response.success) {
        return {
          ok: false,
          message: response.message || "Could not remove the time off.",
        };
      }
      refetch();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, "Could not remove the time off."),
      };
    }
  };

  return { items: data, loading, saving, add, remove };
}
