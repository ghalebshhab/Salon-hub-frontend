import { useCallback, useState } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import { getApiErrorMessage } from "../../../shared/api/response.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import {
  cancelPlanRequestApi,
  getMySubscriptionApi,
  getSubscriptionPlansApi,
  requestPlanApi,
} from "../api/subscriptionApi.js";

/** The owner's plan page: current plan, the price list and plan requests. */
export default function useOwnerPlan() {
  const subscriptionLoader = useCallback(
    (signal) => getMySubscriptionApi(signal),
    [],
  );
  const subscriptionQuery = useQuery(subscriptionLoader, {
    initialData: null,
    errorMessage: "Your plan could not be loaded.",
  });
  const plansLoader = useCallback(
    (signal) => getSubscriptionPlansApi(signal),
    [],
  );
  const plansQuery = useQuery(plansLoader, {
    initialData: [],
    errorMessage: "The plans could not be loaded.",
  });

  // The answer of a request or a cancel replaces the loaded plan at once,
  // until the plan is loaded again.
  const loaded = subscriptionQuery.data;
  const [answer, setAnswer] = useState({ base: null, value: null });
  const setUpdated = useCallback(
    (value) => setAnswer({ base: loaded, value }),
    [loaded],
  );
  const updated = answer.base === loaded ? answer.value : null;
  const [sending, setSending] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const sendRequest = useCallback(
    async (payload) => {
      setSending(true);
      try {
        const next = await requestPlanApi(payload);
        setUpdated(next);
        showSuccessToast(
          "We turn on your plan when we confirm the payment.",
          "Request sent",
        );
        return true;
      } catch (error) {
        showErrorToast(
          getApiErrorMessage(error, "Your request could not be sent."),
        );
        return false;
      } finally {
        setSending(false);
      }
    },
    [setUpdated],
  );

  const cancelRequest = useCallback(
    async (requestId) => {
      setCancellingId(requestId);
      try {
        setUpdated(await cancelPlanRequestApi(requestId));
        showSuccessToast("Your request is cancelled.", "Cancelled");
      } catch (error) {
        showErrorToast(
          getApiErrorMessage(error, "Your request could not be cancelled."),
        );
      } finally {
        setCancellingId(null);
      }
    },
    [setUpdated],
  );

  return {
    subscription: updated || loaded,
    plans: plansQuery.data || [],
    loading: subscriptionQuery.loading,
    error: subscriptionQuery.error,
    refetch: subscriptionQuery.refetch,
    sending,
    cancellingId,
    sendRequest,
    cancelRequest,
  };
}
