import { useCallback, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { getMyHiringApplicationsApi } from "../../hiring/api/hiringApi.js";

export default function useMyApplications() {
  const [filter, setFilter] = useState("all");
  const loader = useCallback(
    (signal) =>
      getMyHiringApplicationsApi({ signal }).then((response) =>
        requireData(response),
      ),
    [],
  );
  const {
    data: applications,
    loading,
    error,
  } = useQuery(loader, {
    initialData: [],
    onError: showErrorToast,
  });

  return {
    applications,
    loading,
    error,
    filter,
    setFilter,
  };
}
