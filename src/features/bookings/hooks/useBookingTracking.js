import { useCallback, useEffect, useRef, useState } from "react";
import { getBookingTrackingApi } from "../api/bookingApi.js";

export const TRACKING_POLL_MS = 15000;

/**
 * Loads one booking's live state and refreshes it while the page is visible.
 * `run(apiCall)` performs an action that returns the new tracking state and
 * applies it at once, so buttons feel instant without waiting for the next poll.
 */
export default function useBookingTracking(
  bookingId,
  { enabled = true, intervalMs = TRACKING_POLL_MS } = {},
) {
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const mountedRef = useRef(true);

  const refresh = useCallback(
    async (signal) => {
      if (!bookingId) return;
      try {
        const response = await getBookingTrackingApi(bookingId, { signal });
        if (!mountedRef.current || signal?.aborted) return;
        if (response.success) {
          setTracking(response.data);
          setError("");
        } else {
          setError(response.message || "Live status is not available.");
        }
      } catch (requestError) {
        if (requestError?.code === "ERR_CANCELED" || signal?.aborted) return;
        if (mountedRef.current) {
          setError(
            requestError?.response?.data?.message ||
              "Live status is not available right now.",
          );
        }
      }
    },
    [bookingId],
  );

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled || !bookingId) return undefined;
    const controller = new AbortController();
    const tick = () => {
      if (document.visibilityState === "visible") refresh(controller.signal);
    };
    // First load right away (from a timer callback, not the effect body).
    const first = window.setTimeout(() => refresh(controller.signal), 0);
    const timer = window.setInterval(tick, intervalMs);
    document.addEventListener("visibilitychange", tick);
    return () => {
      mountedRef.current = false;
      controller.abort();
      window.clearTimeout(first);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [bookingId, enabled, intervalMs, refresh]);

  const run = useCallback(async (apiCall) => {
    setBusy(true);
    try {
      const response = await apiCall();
      if (response?.success) {
        setTracking(response.data);
        setError("");
        return { ok: true, message: response.message };
      }
      const message = response?.message || "The action could not be completed.";
      setError(message);
      return { ok: false, message };
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "The action could not be completed.";
      setError(message);
      return { ok: false, message };
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  }, []);

  return { tracking, error, busy, refresh, run, setTracking };
}
