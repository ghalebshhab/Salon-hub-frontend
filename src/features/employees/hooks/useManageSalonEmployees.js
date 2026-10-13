import { useCallback } from "react";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { getMySalonEmployeesApi } from "../api/salonEmployeesApi.js";

export default function useManageSalonEmployees() {
  const loader = useCallback(
    (signal) => getMySalonEmployeesApi({ signal }).then(requireData),
    [],
  );
  const { data: employees, loading } = useQuery(loader, {
    initialData: [],
    onError: showErrorToast,
  });

  return { employees, loading };
}
