import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { showErrorToast } from "../../../shared/notifications/toast.jsx";

import { getSalonByIdApi } from "../api/salonApi.js";
import { getSalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";
import { getSalonMediaApi } from "../../media/api/mediaApi.js";

export default function useSalonDetails() {
  const { salonId } = useParams();

  const getImages = (salonData) => {
    return salonData?.Images || salonData?.images || [];
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return time.toString().slice(0, 5);
  };

  const loader = useCallback(
    async (signal) => {
      const [salon, employees, mediaPosts] = await Promise.all([
        getSalonByIdApi(salonId, { signal }).then(requireData),
        getSalonEmployeesApi(salonId, { signal })
          .then(requireData)
          .catch(() => []),
        getSalonMediaApi(salonId, { signal })
          .then(requireData)
          .catch(() => []),
      ]);
      return {
        salon,
        employees: employees || [],
        mediaPosts: mediaPosts || [],
      };
    },
    [salonId],
  );
  const { data, loading } = useQuery(loader, {
    initialData: {},
    onError: showErrorToast,
  });
  const { salon = null, employees = [], mediaPosts = [] } = data;

  return {
    salonId,
    salon,
    employees,
    mediaPosts,
    loading,
    getImages,
    formatTime,
  };
}
