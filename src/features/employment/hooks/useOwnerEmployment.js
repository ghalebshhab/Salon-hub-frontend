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
  acceptLeaveRequestApi,
  cancelEmploymentRequestApi,
  getOwnedSalonEmploymentRequestsApi,
  getOwnedSalonLeaveRequestsApi,
  inviteEmploymentCandidateApi,
  rejectEmploymentRequestApi,
} from "../api/employmentApi.js";
import useEmploymentCandidateSearch from "./useEmploymentCandidateSearch.js";

export default function useOwnerEmployment() {
  const { user } = useAuth();
  const [rejection, setRejection] = useState({ requestId: null, reason: "" });
  const [acting, setActing] = useState(false);
  const candidateSearch = useEmploymentCandidateSearch();

  const loader = useCallback(async (signal) => {
    const [employment, leave] = await Promise.all([
      getOwnedSalonEmploymentRequestsApi({ signal }).then(requireData),
      getOwnedSalonLeaveRequestsApi({ signal }).then(requireData),
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
      showSuccessToast(response.message || "Employment workflow updated.");
      refetch();
      return true;
    } catch (error) {
      showApiErrorToast(error, fallback);
      return false;
    } finally {
      setActing(false);
    }
  };

  const inviteCandidate = (userId) =>
    perform(
      () =>
        inviteEmploymentCandidateApi(
          user?.ownedSalonId ?? user?.salonId,
          userId,
        ),
      "The invitation could not be sent.",
    );

  const acceptRequest = (requestId) =>
    perform(
      () => acceptEmploymentRequestApi(requestId),
      "The join request could not be accepted.",
    );

  const cancelInvitation = (requestId) =>
    perform(
      () => cancelEmploymentRequestApi(requestId),
      "The invitation could not be cancelled.",
    );

  const submitRejection = async () => {
    if (!rejection.reason.trim()) {
      showErrorToast("Add a reason before rejecting this request.");
      return;
    }
    const completed = await perform(
      () =>
        rejectEmploymentRequestApi(
          rejection.requestId,
          rejection.reason.trim(),
        ),
      "The join request could not be rejected.",
    );
    if (completed) setRejection({ requestId: null, reason: "" });
  };

  const acceptLeave = (requestId) =>
    perform(
      () => acceptLeaveRequestApi(requestId),
      "The leave request could not be accepted.",
    );

  return {
    requests: data.requests,
    leaveRequests: data.leaveRequests,
    candidates: candidateSearch.candidates,
    candidatesLoading: candidateSearch.loading,
    candidatesSearching: candidateSearch.searching,
    loading,
    acting,
    searchInput: candidateSearch.searchInput,
    setSearchInput: candidateSearch.setSearchInput,
    clearSearch: candidateSearch.clearSearch,
    rejection,
    setRejection,
    inviteCandidate,
    acceptRequest,
    cancelInvitation,
    submitRejection,
    acceptLeave,
  };
}
