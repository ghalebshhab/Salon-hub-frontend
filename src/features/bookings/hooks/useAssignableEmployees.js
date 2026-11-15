import { useCallback } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { getAssignableEmployeesApi } from "../api/bookingApi.js";

/** Qualified employees for one booking, each marked free or busy for its time. */
export default function useAssignableEmployees(bookingId) {
  const loader = useCallback(
    async (signal) =>
      requireData(await getAssignableEmployeesApi(bookingId, { signal })) || [],
    [bookingId],
  );
  const { data, loading, error } = useQuery(loader, { initialData: [] });
  return { employees: data, loading, error };
}
