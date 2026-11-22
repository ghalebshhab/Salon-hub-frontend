import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { getSalonByIdApi } from "../api/salonApi.js";
import { getSalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";

export default function useSalonDetails() {
  const { salonId } = useParams();
  const loader = useCallback(
    async (signal) => {
      const [salonResponse, employeeResponse] = await Promise.all([
        getSalonByIdApi(salonId, { signal }),
        getSalonEmployeesApi(salonId, { signal }),
      ]);
      return {
        salon: requireData(salonResponse),
        employees: requireData(employeeResponse) || [],
      };
    },
    [salonId],
  );
  // No toast: a salon that cannot load gets the full error page instead.
  const { data, loading, error, refetch } = useQuery(loader);
  return {
    salon: data?.salon || null,
    employees: data?.employees || [],
    loading,
    error,
    refetch,
  };
}
