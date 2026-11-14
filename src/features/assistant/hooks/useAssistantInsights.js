import { useEffect, useState } from "react";
import { getAssistantInsightsApi } from "../api/assistantApi.js";

/**
 * Top salons per governorate and one opportunity for the viewer. Reloads
 * when the session changes, because the opportunity depends on the role.
 */
export default function useAssistantInsights(token) {
  const [state, setState] = useState({ status: "loading", data: null, token });
  if (state.token !== token) {
    setState({ status: "loading", data: null, token });
  }
  useEffect(() => {
    const controller = new AbortController();
    getAssistantInsightsApi({ signal: controller.signal })
      .then((response) =>
        setState({
          status: response?.success === false ? "error" : "ready",
          data: response?.data ?? null,
          token,
        }),
      )
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ status: "error", data: null, token });
        }
      });
    return () => controller.abort();
  }, [token]);
  return state;
}
