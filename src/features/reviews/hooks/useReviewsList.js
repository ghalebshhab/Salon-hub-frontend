import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback } from "react";

import {
  getSalonReviewsApi,
  getSalonReviewSummaryApi,
} from "../api/reviewApi.js";

import { showErrorToast } from "../../../shared/notifications/toast.jsx";

export default function useReviewsList({ salonId }) {
  const loader = useCallback(
    async (signal) => {
      const [reviews, summary] = await Promise.all([
        getSalonReviewsApi(salonId, { signal }).then(requireData),
        getSalonReviewSummaryApi(salonId, { signal }).then(requireData),
      ]);
      return {
        reviews: reviews || [],
        summary: summary || { averageRating: 0, totalReviews: 0 },
      };
    },
    [salonId],
  );
  const { data, loading } = useQuery(loader, {
    initialData: {},
    onError: showErrorToast,
  });
  const { reviews = [], summary = { averageRating: 0, totalReviews: 0 } } =
    data;

  return { loading, reviews, summary };
}
