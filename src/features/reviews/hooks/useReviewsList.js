import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback } from "react";

import {
  getSalonReviewsApi,
  getSalonReviewSummaryApi,
} from "../api/reviewApi.js";

const EMPTY_SUMMARY = { averageRating: 0, totalReviews: 0 };

/** The salon's public reviews and its rating summary. */
export default function useReviewsList({ salonId }) {
  const loader = useCallback(
    async (signal) => {
      const [reviews, summary] = await Promise.all([
        getSalonReviewsApi(salonId, { signal }).then(requireData),
        getSalonReviewSummaryApi(salonId, { signal }).then(requireData),
      ]);
      return {
        reviews: reviews || [],
        summary: summary || EMPTY_SUMMARY,
      };
    },
    [salonId],
  );
  const { data, loading, error, refetch } = useQuery(loader, {
    initialData: {},
  });
  const { reviews = [], summary = EMPTY_SUMMARY } = data || {};

  return { loading, error, refetch, reviews, summary };
}
