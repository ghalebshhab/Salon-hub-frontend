import { useCallback } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import { getMySubscriptionApi } from "../api/subscriptionApi.js";

/** The owner's plan. `data` stays null while it loads or when it fails. */
export default function useMySubscription() {
  const loader = useCallback((signal) => getMySubscriptionApi(signal), []);
  return useQuery(loader, {
    initialData: null,
    errorMessage: "Your plan could not be loaded.",
  });
}
