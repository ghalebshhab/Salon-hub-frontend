import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { getSalonByIdApi } from "../api/salonApi.js";

export default function useSalonDetails() {
  const { salonId } = useParams();
  const loader = useCallback(
    (signal) => getSalonByIdApi(salonId, { signal }).then(requireData),
    [salonId],
  );
  const { data: salon, loading } = useQuery(loader, {
    onError: showErrorToast,
  });
  return { salon, loading };
}
