import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";

import { getActiveSalonServicesApi } from "../api/salonServicesApi.js";

export default function useSalonServicesList({ salonId }) {
  const navigate = useNavigate();

  const loader = useCallback(
    async (signal) =>
      requireData(await getActiveSalonServicesApi(salonId, { signal })) || [],
    [salonId],
  );
  const { data: services, loading } = useQuery(loader, {
    initialData: [],
    onError: showErrorToast,
  });

  const handleBookNow = (service) => {
    navigate(`/salons/${salonId}/book`, {
      state: {
        selectedServiceId: service.id,
      },
    });
  };

  return { services, loading, handleBookNow };
}
