import { useCallback, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import useAuth from "../../../shared/auth/useAuth.js";
import {
  showApiErrorToast,
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import {
  acceptEmploymentRequestApi,
  cancelEmploymentRequestApi,
  cancelLeaveRequestApi,
  createLeaveRequestApi,
  getMyEmploymentRequestsApi,
  getMyLeaveRequestsApi,
  rejectEmploymentRequestApi,
} from "../api/employmentApi.js";

export default function useEmploymentCenter() {
  const { user } = useAuth();
  const [leaveReason, setLeaveReason] = useState("");
  const [rejection, setRejection] = useState({ requestId: null, reason: "" });
  const [acting, setActing] = useState(false);

  const loader = useCallback(async (signal) => {
    const [employment, leave] = await Promise.all([
      getMyEmploymentRequestsApi({ signal }).then(requireData),
      getMyLeaveRequestsApi({ signal }).then(requireData),
    ]);
    return {
      requests: employment?.content || [],
      leaveRequests: leave?.content || [],
    };
  }, []);
  const { data, loading, refetch } = useQuery(loader, {
    initialData: { requests: [], leaveRequests: [] },
    onError: showErrorToast,
  });

  const perform = async (operation, fallback) => {
    try {
      setActing(true);
      const response = await operation();
      if (!response.success) {
        showErrorToast(response.message || fallback);
        return false;
      }
      showSuccessToast(response.message || "Employment request updated.");
      refetch();
      return true;
    } catch (error) {
      showApiErrorToast(error, fallback);
      return false;
    } finally {
      setActing(false);
    }
  };

  const acceptRequest = (requestId) =>
    perform(
      () => acceptEmploymentRequestApi(requestId),
      "The invitation could not be accepted.",
    );

  const cancelRequest = (requestId) =>
    perform(
      () => cancelEmploymentRequestApi(requestId),
      "The employment request could not be cancelled.",
    );

  const submitRejection = async () => {
    if (!rejection.reason.trim()) {
      showErrorToast("Add a reason before rejecting the invitation.");
      return;
    }
    const completed = await perform(
      () =>
        rejectEmploymentRequestApi(
          rejection.requestId,
          rejection.reason.trim(),
        ),
      "The invitation could not be rejected.",
    );
    if (completed) setRejection({ requestId: null, reason: "" });
  };

  const requestLeave = async () => {
    const completed = await perform(
      () => createLeaveRequestApi(leaveReason.trim() || null),
      "The leave request could not be sent.",
    );
    if (completed) setLeaveReason("");
  };

  const cancelLeave = (requestId) =>
    perform(
      () => cancelLeaveRequestApi(requestId),
      "The leave request could not be cancelled.",
    );

  return {
    currentUserId: user?.id,
    role: user?.role,
    requests: data.requests,
    leaveRequests: data.leaveRequests,
    loading,
    acting,
    leaveReason,
    setLeaveReason,
    rejection,
    setRejection,
    acceptRequest,
    cancelRequest,
    submitRejection,
    requestLeave,
    cancelLeave,
  };
}
