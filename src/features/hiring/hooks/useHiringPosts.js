import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback } from "react";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { getOpenHiringPostsApi } from "../api/hiringApi.js";

export default function useHiringPosts() {
  const loader = useCallback(
    async (signal) =>
      requireData(await getOpenHiringPostsApi({ signal })) || [],
    [],
  );
  const { data: posts, loading } = useQuery(loader, {
    initialData: [],
    onError: showErrorToast,
  });

  return { posts, loading };
}
