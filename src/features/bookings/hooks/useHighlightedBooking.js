import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Notifications link to `?bookingId=…`. Once the list is loaded, scroll that
 * booking into view and return its id so the page can highlight it.
 */
export default function useHighlightedBooking(ready) {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");

  useEffect(() => {
    if (!ready || !bookingId) return;
    const node = document.getElementById(`booking-${bookingId}`);
    node?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [ready, bookingId]);

  return bookingId ? Number(bookingId) : null;
}
