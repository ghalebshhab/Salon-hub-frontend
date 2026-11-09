import { useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getApiErrorMessage,
  requireData,
} from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { getSalonByIdApi } from "../api/salonApi.js";
import { getSalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";

export default function useSalonDetails() {
  const { salonId } = useParams();
  const loader = useCallback(
    (signal) => getSalonByIdApi(salonId, { signal }).then(requireData),
    [salonId],
  );
  const { data, loading } = useQuery(loader, {
    onError: showErrorToast,
  });
  const employeeLoader = useCallback(
    (signal) =>
      getSalonEmployeesApi(salonId, { signal, showLoading: false }).then(
        requireData,
      ),
    [salonId],
  );
  const team = useQuery(employeeLoader);
  return {
    salon: data || null,
    employees: team.data || [],
    employeesLoading: team.loading,
    employeesError: team.error
      ? getApiErrorMessage(team.error, "Could not load the salon team.")
      : "",
    retryEmployees: team.refetch,
    loading,
  };
}
