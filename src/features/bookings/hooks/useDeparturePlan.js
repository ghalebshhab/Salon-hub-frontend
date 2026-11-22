import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearDepartureOriginApi,
  getDeparturePlanApi,
  setDepartureOriginApi,
} from "../api/bookingApi.js";
import {
  DEPARTURE_POLL_MS,
  ORIGIN_REFRESH_MS,
  parseLocalTime,
} from "../model/departurePlan.js";
import { readPosition } from "./useTripSharing.js";
import t from "../../../shared/i18n/t.js";

const LOCATION_DENIED = t(
  "Location is off for this site. Turn it on in your browser to get leave alerts.",
);

const apiMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

/**
 * Loads the "Leave on time" plan and refreshes it every minute while the page
 * is visible, so the leave time follows the queue and the traffic.
 *
 * The customer's place is read only after they turn the alerts on. While the
 * alerts are on and the page is open, the place is read again when it is
 * older than ten minutes (no new prompt: permission was already given).
 */
export default function useDeparturePlan(bookingId, { enabled = true } = {}) {
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Server clock minus client clock, so countdowns use the server's time.
  const [clockOffset, setClockOffset] = useState(0);
  const mountedRef = useRef(true);
  const planRef = useRef(null);

  const apply = useCallback((data) => {
    planRef.current = data;
    setPlan(data);
    const serverNow = parseLocalTime(data?.serverTime);
    if (serverNow != null) setClockOffset(serverNow - Date.now());
  }, []);

  const refreshOrigin = useCallback(async () => {
    const current = planRef.current;
    const savedAt = parseLocalTime(current?.originUpdatedAt);
    if (!current?.alertsOn || savedAt == null) return false;
    if (Date.now() - savedAt < ORIGIN_REFRESH_MS || !navigator.geolocation)
      return false;
    try {
      // Never open a location prompt on its own: refresh only when already allowed.
      const permission = await navigator.permissions?.query({
        name: "geolocation",
      });
      if (permission?.state !== "granted") return false;
      const origin = await readPosition();
      const response = await setDepartureOriginApi(bookingId, origin);
      if (mountedRef.current && response.success) apply(response.data);
      return Boolean(response.success);
    } catch {
      return false; // Keep the saved place; the next minute tries again.
    }
  }, [apply, bookingId]);

  const refresh = useCallback(
    async (signal) => {
      if (!bookingId) return;
      try {
        if (await refreshOrigin()) return;
        const response = await getDeparturePlanApi(bookingId, { signal });
        if (!mountedRef.current || signal?.aborted) return;
        if (response.success) {
          apply(response.data);
          setError("");
        } else {
          setError(response.message || t("The leave plan is not available."));
        }
      } catch (requestError) {
        if (requestError?.code === "ERR_CANCELED" || signal?.aborted) return;
        if (mountedRef.current) {
          setError(
            apiMessage(
              requestError,
              t("The leave plan is not available right now."),
            ),
          );
        }
      }
    },
    [apply, bookingId, refreshOrigin],
  );

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled || !bookingId) return undefined;
    const controller = new AbortController();
    const tick = () => {
      if (document.visibilityState === "visible") refresh(controller.signal);
    };
    const first = window.setTimeout(() => refresh(controller.signal), 0);
    const timer = window.setInterval(tick, DEPARTURE_POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      mountedRef.current = false;
      controller.abort();
      window.clearTimeout(first);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [bookingId, enabled, refresh]);

  const run = useCallback(
    async (apiCall) => {
      setBusy(true);
      try {
        const response = await apiCall();
        if (response?.success) {
          apply(response.data);
          setError("");
          return true;
        }
        setError(response?.message || t("The action could not be completed."));
        return false;
      } catch (requestError) {
        setError(
          apiMessage(requestError, t("The action could not be completed.")),
        );
        return false;
      } finally {
        if (mountedRef.current) setBusy(false);
      }
    },
    [apply],
  );

  const turnOn = useCallback(async () => {
    if (!navigator.geolocation) {
      setError(t("This browser cannot share your location."));
      return;
    }
    setBusy(true);
    let origin;
    try {
      origin = await readPosition();
    } catch (geoError) {
      setBusy(false);
      setError(
        geoError?.code === 1
          ? LOCATION_DENIED
          : t("We could not find your location. Please try again."),
      );
      return;
    }
    if ("Notification" in window && Notification.permission === "default") {
      // Ask in the same tap, so the browser can show the alert while the page is open.
      Notification.requestPermission().catch(() => {});
    }
    await run(() => setDepartureOriginApi(bookingId, origin));
  }, [bookingId, run]);

  const turnOff = useCallback(
    () => run(() => clearDepartureOriginApi(bookingId)),
    [bookingId, run],
  );

  return { plan, error, busy, clockOffset, turnOn, turnOff };
}
