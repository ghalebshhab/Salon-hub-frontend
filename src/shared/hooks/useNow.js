import { useEffect, useState } from "react";

/**
 * The current time, refreshed every `intervalMs`. Use it for countdowns and
 * "time left" labels, so render code stays pure.
 */
export default function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return now;
}
