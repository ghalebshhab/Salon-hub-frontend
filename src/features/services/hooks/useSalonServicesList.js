import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback } from "react";

import { getActiveSalonServicesApi } from "../api/salonServicesApi.js";

/** The salon's active services for its public menu. */
export default function useSalonServicesList({ salonId }) {
  const loader = useCallback(
    async (signal) =>
      requireData(await getActiveSalonServicesApi(salonId, { signal })) || [],
    [salonId],
  );
  const {
    data: services,
    loading,
    error,
    refetch,
  } = useQuery(loader, { initialData: [] });

  return { services: services || [], loading, error, refetch };
}
