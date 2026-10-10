import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback } from "react";

import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { getAllSalonsApi } from "../api/salonApi.js";

export default function useSalonShowcase() {
  const getImages = (salon) => {
    return salon?.Images || salon?.images || [];
  };

  const formatTime = (time) => {
    if (!time) return "—";
    return time.toString().slice(0, 5);
  };

  const loader = useCallback(
    async (signal) => requireData(await getAllSalonsApi({ signal })) || [],
    [],
  );
  const { data: salons, loading } = useQuery(loader, {
    initialData: [],
    onError: showErrorToast,
  });

  return { getImages, formatTime, salons, loading };
}
