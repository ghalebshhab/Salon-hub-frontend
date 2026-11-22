import i18nT from "../../../shared/i18n/t.js";
/**
 * "Leave on time" helpers for the customer's live booking card.
 * Pure functions, so the rules stay in one place and are easy to test.
 */

export const DEPARTURE_POLL_MS = 60_000;
/** Re-read the customer's place when the saved one is older than this. */
export const ORIGIN_REFRESH_MS = 10 * 60_000;

const MINUTE = 60_000;
const LEAVE_SOON_MINUTES = 15;
const LEAVE_NOW_GRACE_MINUTES = 5;

export const TRAFFIC_LABELS = {
  LIGHT: i18nT("Light traffic"),
  MODERATE: i18nT("Some traffic"),
  HEAVY: i18nT("Heavy traffic"),
};

/** Server times are local date-times such as "2026-11-21T16:20:00.123456". */
export function parseLocalTime(value) {
  if (!value) return null;
  const time = new Date(String(value).slice(0, 23)).getTime();
  return Number.isNaN(time) ? null : time;
}

/**
 * The one step the card shows, in the order the customer lives it:
 *   off → wait → soon → now → late → on-the-way → arrived → service → done
 * "off" means no leave time yet (alerts off). The live tracking state wins over
 * the plan, because it updates right after the customer taps a button.
 * Between polls the leave time does not move, so wait → soon → now → late
 * is worked out on the client clock.
 */
export function liveStep(tracking, plan, now) {
  if (!tracking) return null;
  if (tracking.status === "IN_PROGRESS") return "service";
  if (tracking.status !== "ACCEPTED") return "done";
  if (tracking.journeyStatus === "ARRIVED") return "arrived";
  if (tracking.journeyStatus === "ON_THE_WAY") return "on-the-way";

  const leaveAt = parseLocalTime(plan?.leaveAt);
  if (leaveAt == null) return "off";
  const minutes = (leaveAt - now) / MINUTE;
  if (minutes > LEAVE_SOON_MINUTES) return "wait";
  if (minutes > 0) return "soon";
  if (minutes >= -LEAVE_NOW_GRACE_MINUTES) return "now";
  return "late";
}

/** "1 h 12 min", "18 min" or "4:09" (the last ten minutes tick by the second). `t` translates the units. */
export function formatCountdown(ms, t = (text, values) => fill(text, values)) {
  const safe = Math.max(0, ms);
  if (safe >= 60 * MINUTE) {
    const hours = Math.floor(safe / (60 * MINUTE));
    const minutes = Math.round((safe % (60 * MINUTE)) / MINUTE);
    return minutes
      ? t("{hours} h {minutes} min", { hours, minutes })
      : t("{hours} h", { hours });
  }
  if (safe >= 10 * MINUTE)
    return t("{minutes} min", { minutes: Math.ceil(safe / MINUTE) });
  const totalSeconds = Math.ceil(safe / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/** "21:15" from a server date-time. */
export function formatClockTime(value) {
  const time = parseLocalTime(value);
  if (time == null) return "";
  const date = new Date(time);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function fill(text, values) {
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    values[name] == null ? match : String(values[name]),
  );
}
