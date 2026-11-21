import { useCallback } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { getSalonReviewSummaryApi } from "../api/reviewApi.js";

/** Average rating and review count for the salon hero. Quiet on errors. */
export default function useSalonRating(salonId) {
  const loader = useCallback(
    (signal) => getSalonReviewSummaryApi(salonId, { signal }).then(requireData),
    [salonId],
  );
  const { data, loading } = useQuery(loader, { initialData: null });
  return {
    loading,
    average: Number(data?.averageRating) || 0,
    total: Number(data?.totalReviews) || 0,
  };
}
