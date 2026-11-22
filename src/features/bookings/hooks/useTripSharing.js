import { useCallback, useEffect, useRef, useState } from "react";
import {
  markArrivedApi,
  startJourneyApi,
  stopJourneyApi,
  updateJourneyPositionApi,
} from "../api/bookingApi.js";
import t from "../../../shared/i18n/t.js";

/** Send a new position after this much movement or this much time. */
export const MIN_MOVE_METERS = 75;
export const MAX_SILENCE_MS = 45000;
export const MIN_INTERVAL_MS = 12000;

export function metersBetween(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** True when a new fix is worth sending to the server. */
export function shouldSendPosition(last, next, now) {
  if (!last) return true;
  const elapsed = now - last.sentAt;
  if (elapsed < MIN_INTERVAL_MS) return false;
  return (
    elapsed >= MAX_SILENCE_MS || metersBetween(last, next) >= MIN_MOVE_METERS
  );
}

export const readPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      reject,
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  });

/**
 * Customer side of "I'm on my way". Location is read only after the customer
 * taps the button, sent while the trip is active, and stopped on arrival,
 * on "Stop sharing", or when the page closes.
 */
export default function useTripSharing(bookingId, tracking, run) {
  const [locationNote, setLocationNote] = useState("");
  const watchRef = useRef(null);
  const lastSentRef = useRef(null);
  const sharing = tracking?.journeyStatus === "ON_THE_WAY";

  const stopWatching = useCallback(() => {
    if (watchRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchRef.current);
    }
    watchRef.current = null;
    lastSentRef.current = null;
  }, []);

  useEffect(() => {
    if (!sharing || !navigator.geolocation || watchRef.current != null) {
      return undefined;
    }
    watchRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const next = { latitude: coords.latitude, longitude: coords.longitude };
        const now = Date.now();
        if (!shouldSendPosition(lastSentRef.current, next, now)) return;
        lastSentRef.current = { ...next, sentAt: now };
        run(() => updateJourneyPositionApi(bookingId, next));
      },
      () =>
        setLocationNote(
          t("Live location paused. Your ETA updates when it comes back."),
        ),
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 },
    );
    return stopWatching;
  }, [bookingId, run, sharing, stopWatching]);

  const startTrip = useCallback(async () => {
    setLocationNote("");
    let position = null;
    if (navigator.geolocation) {
      try {
        position = await readPosition();
        lastSentRef.current = { ...position, sentAt: Date.now() };
      } catch {
        setLocationNote(
          t(
            "Location is off, so the salon sees that you are on the way but not your ETA.",
          ),
        );
      }
    }
    return run(() => startJourneyApi(bookingId, position));
  }, [bookingId, run]);

  const stopTrip = useCallback(() => {
    stopWatching();
    setLocationNote("");
    return run(() => stopJourneyApi(bookingId));
  }, [bookingId, run, stopWatching]);

  const arrived = useCallback(() => {
    stopWatching();
    return run(() => markArrivedApi(bookingId));
  }, [bookingId, run, stopWatching]);

  return { sharing, startTrip, stopTrip, arrived, locationNote };
}
