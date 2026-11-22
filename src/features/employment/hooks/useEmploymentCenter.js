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
import { confirmAction } from "../../../shared/confirm/confirmStore.js";
import t from "../../../shared/i18n/t.js";

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
      showSuccessToast(response.message || t("Employment request updated."));
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
      t("The invitation could not be accepted."),
    );

  const cancelRequest = async (requestId) =>
    (await confirmAction({
      title: t("Cancel this employment request?"),
      message: t("The salon will no longer see this request."),
      confirmText: t("Cancel request"),
      cancelText: t("Keep it"),
      danger: true,
    })) &&
    perform(
      () => cancelEmploymentRequestApi(requestId),
      t("The employment request could not be cancelled."),
    );

  const submitRejection = async () => {
    if (!rejection.reason.trim()) {
      showErrorToast(t("Add a reason before rejecting the invitation."));
      return;
    }
    const completed = await perform(
      () =>
        rejectEmploymentRequestApi(
          rejection.requestId,
          rejection.reason.trim(),
        ),
      t("The invitation could not be rejected."),
    );
    if (completed) setRejection({ requestId: null, reason: "" });
  };

  const requestLeave = async () => {
    const confirmed = await confirmAction({
      title: t("Ask to leave the salon?"),
      message: t(
        "Your owner will get a leave request. You stay in the team until they approve it.",
      ),
      confirmText: t("Send leave request"),
      danger: true,
    });
    if (!confirmed) return;
    const completed = await perform(
      () => createLeaveRequestApi(leaveReason.trim() || null),
      t("The leave request could not be sent."),
    );
    if (completed) setLeaveReason("");
  };

  const cancelLeave = async (requestId) =>
    (await confirmAction({
      title: t("Cancel your leave request?"),
      message: t("You will stay in the salon team."),
      confirmText: t("Cancel request"),
      cancelText: t("Keep it"),
    })) &&
    perform(
      () => cancelLeaveRequestApi(requestId),
      t("The leave request could not be cancelled."),
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
