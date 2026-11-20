import { useCallback, useMemo } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import {
  getOwnerDashboardApi,
  getOwnerDashboardSummaryApi,
} from "../api/dashboardApi.js";
import { buildOwnerDashboard, rangeRequest } from "../model/dashboardModel.js";

/** Loads the period's bookings and the server totals together for one range. */
export default function useOwnerDashboard(range, profile) {
  const loader = useCallback(
    async (signal) => {
      const request = rangeRequest(range);
      const [dashboard, summary] = await Promise.all([
        getOwnerDashboardApi(signal, request.bookings),
        // Without the server totals (for example a range longer than the
        // plan allows) the page counts from the bookings instead.
        getOwnerDashboardSummaryApi(signal, request.summary).catch((error) => {
          if (signal?.aborted) throw error;
          return null;
        }),
      ]);
      return { ...dashboard, summary, fetchedAt: new Date().toISOString() };
    },
    [range],
  );
  const query = useQuery(loader, {
    initialData: null,
    errorMessage: "The owner dashboard could not be loaded.",
    // A refresh or a new range keeps the dashboard on screen meanwhile.
    keepPreviousData: true,
  });
  const dashboard = useMemo(
    () =>
      query.data && profile
        ? buildOwnerDashboard({ ...query.data, profile }, range)
        : null,
    [profile, query.data, range],
  );
  return { ...query, data: dashboard };
}
