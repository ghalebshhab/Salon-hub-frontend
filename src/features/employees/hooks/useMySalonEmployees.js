import { useCallback } from "react";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import {
  acceptHiringApplicationApi,
  getHiringPostApplicationsApi,
  getOwnerHiringPostsApi,
  rejectHiringApplicationApi,
} from "../../hiring/api/hiringApi.js";

export default function useMySalonEmployees() {
  const loader = useCallback(async (signal) => {
    const posts = requireData(await getOwnerHiringPostsApi({ signal })) || [];
    const groups = await Promise.all(
      posts.map(async (item) => {
        const post = item.hiringPost || item;
        const applications =
          requireData(
            await getHiringPostApplicationsApi(post.id, { signal }),
          ) || [];
        return applications.map((application) => ({
          ...application,
          hiringPostTitle: application.hiringPostTitle || post.title,
        }));
      }),
    );
    return groups.flat();
  }, []);
  const {
    data: applications,
    loading,
    refetch,
  } = useQuery(loader, { initialData: [], onError: showErrorToast });
  const process = async (applicationId, accept) => {
    const rejectionReason = accept
      ? undefined
      : window.prompt("Why are you rejecting this application?");
    if (!accept && !rejectionReason?.trim()) return;
    try {
      const response = accept
        ? await acceptHiringApplicationApi(applicationId)
        : await rejectHiringApplicationApi(
            applicationId,
            rejectionReason.trim(),
          );
      if (!response.success) {
        showErrorToast(response.message || "Could not update application.");
        return;
      }
      showSuccessToast(`Application ${accept ? "accepted" : "rejected"}.`);
      refetch();
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Could not update application.",
      );
    }
  };
  return { applications, loading, handleProcessApplication: process };
}
