import { useCallback, useMemo } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import { getOwnerDashboardApi } from "../api/dashboardApi.js";
import { buildOwnerDashboard } from "../model/dashboardModel.js";

export default function useOwnerDashboard(range, profile) {
  const loader = useCallback((signal) => getOwnerDashboardApi(signal), []);
  const query = useQuery(loader, {
    initialData: null,
    errorMessage: "The owner dashboard could not be loaded.",
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
