import { useEffect, useState } from "react";
import { getMySalonPendingBookingsApi } from "../api/bookingApi.js";
import { requireData } from "../../../shared/api/response.js";

const REFRESH_MS = 60_000;

/**
 * Number of booking requests waiting for the owner's decision, refreshed in
 * the background (every minute and when the window regains focus). Failures
 * keep the last known value so navigation never shows an error for a badge.
 */
export default function usePendingBookingCount(enabled) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    let controller = new AbortController();

    const load = async () => {
      controller.abort();
      controller = new AbortController();
      try {
        const response = await getMySalonPendingBookingsApi({
          signal: controller.signal,
        });
        const bookings = requireData(response, "Unable to load requests");
        setCount(Array.isArray(bookings) ? bookings.length : 0);
      } catch {
        // Keep the previous count; the bookings page reports real errors.
      }
    };

    load();
    const intervalId = window.setInterval(load, REFRESH_MS);
    window.addEventListener("focus", load);
    return () => {
      controller.abort();
      window.clearInterval(intervalId);
      window.removeEventListener("focus", load);
    };
  }, [enabled]);

  return enabled ? count : 0;
}
