import { useCallback, useEffect, useState } from "react";

/**
 * The browser permission for "notifications" or "geolocation":
 * "granted", "denied", "prompt" or "unsupported". Follows changes the user
 * makes in the browser while the page is open.
 */
export default function usePermissionState(name) {
  const [state, setState] = useState(() => initialState(name));

  useEffect(() => {
    let status;
    let cancelled = false;
    const update = () => {
      if (!cancelled && status) setState(normalise(status.state));
    };
    navigator.permissions
      ?.query({ name })
      .then((result) => {
        status = result;
        update();
        status.addEventListener("change", update);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      status?.removeEventListener("change", update);
    };
  }, [name]);

  const refresh = useCallback(() => setState(initialState(name)), [name]);
  return [state, refresh];
}

function initialState(name) {
  if (name === "notifications") {
    if (typeof window === "undefined" || !("Notification" in window))
      return "unsupported";
    return normalise(Notification.permission);
  }
  if (name === "geolocation") {
    return typeof navigator !== "undefined" && navigator.geolocation
      ? "prompt"
      : "unsupported";
  }
  return "unsupported";
}

function normalise(value) {
  if (value === "granted" || value === "denied") return value;
  return value === "unsupported" ? value : "prompt";
}
