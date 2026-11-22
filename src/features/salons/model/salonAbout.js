import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";
/** Helpers for the "About" section on the salon page. */

export const STORY_PREVIEW_LENGTH = 420;
/** "Closes soon" shows in the last hour before closing. */
const SOON_MINUTES = 60;

/** "09:30:00" → 570 minutes after midnight, or null. */
export function toMinutes(value) {
  const match = /^(\d{1,2}):(\d{2})/.exec(String(value || ""));
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** "09:30:00" → "9:30 AM" in the visitor's own time format. */
export function displayTime(value) {
  const minutes = toMinutes(value);
  if (minutes === null) return "";
  const date = new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60);
  return date.toLocaleTimeString(dateLocale(), {
    hour: "numeric",
    minute: "2-digit",
  });
}

function durationText(minutes) {
  if (minutes < 60) return t("{minutes} min", { minutes });
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest
    ? t("{hours} h {minutes} min", { hours, minutes: rest })
    : t("{hours} h", { hours });
}

/**
 * Is the salon open at `now`? Handles hours that pass midnight
 * (for example 18:00 to 02:00). `state` is the owner's open/closed switch.
 * Returns { tone: "open" | "soon" | "closed" | "unknown", title, detail }.
 */
export function hoursStatus({ openTime, closeTime, state }, now = new Date()) {
  const open = toMinutes(openTime);
  const close = toMinutes(closeTime);
  if (open === null || close === null || open === close) {
    return {
      tone: "unknown",
      title: t("Hours not listed"),
      detail: t("Call the salon to check when it is open."),
    };
  }
  if (state && state !== "OPEN") {
    return {
      tone: "closed",
      title: t("Closed now"),
      detail: t("The salon is not taking guests at the moment."),
    };
  }

  const current = now.getHours() * 60 + now.getMinutes();
  const overnight = close < open;
  const isOpen = overnight
    ? current >= open || current < close
    : current >= open && current < close;

  if (isOpen) {
    const left = (close - current + 24 * 60) % (24 * 60);
    if (left <= SOON_MINUTES) {
      return {
        tone: "soon",
        title: t("Closes soon"),
        detail: t("Closes at {time}, in {left}.", {
          time: displayTime(closeTime),
          left: durationText(left),
        }),
      };
    }
    return {
      tone: "open",
      title: t("Open now"),
      detail: t("Until {time} today.", { time: displayTime(closeTime) }),
    };
  }

  const until = (open - current + 24 * 60) % (24 * 60);
  const opensToday = !overnight && current < open;
  return {
    tone: "closed",
    title: t("Closed now"),
    detail: opensToday
      ? t("Opens at {time}, in {left}.", {
          time: displayTime(openTime),
          left: durationText(until),
        })
      : t("Opens at {time} tomorrow.", { time: displayTime(openTime) }),
  };
}

/** Owner text split into paragraphs on blank lines or line breaks. */
export function storyParagraphs(text) {
  return String(text || "")
    .split(/\n\s*\n|\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** "March 2025", or "" when the date is missing. */
export function memberSince(value) {
  if (!value) return "";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(dateLocale(), {
    month: "long",
    year: "numeric",
  });
}

export function initials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "S";
  return `${parts[0][0]}${parts.length > 1 ? parts[parts.length - 1][0] : ""}`.toUpperCase();
}

const DAY_MINUTES = 24 * 60;
const toPercent = (minutes) => (minutes / DAY_MINUTES) * 100;

/**
 * A 24-hour bar for today: the open part(s) and where "now" is, in percent.
 * Hours that pass midnight give two parts. Returns null without hours.
 */
export function dayTimeline({ openTime, closeTime }, now = new Date()) {
  const open = toMinutes(openTime);
  const close = toMinutes(closeTime);
  if (open === null || close === null || open === close) return null;
  const parts =
    close > open
      ? [{ start: open, end: close }]
      : [
          { start: 0, end: close },
          { start: open, end: DAY_MINUTES },
        ];
  return {
    segments: parts.map(({ start, end }) => ({
      left: toPercent(start),
      width: toPercent(end - start),
    })),
    now: toPercent(now.getHours() * 60 + now.getMinutes()),
  };
}

/** "ghaleb shhab" → "Ghaleb Shhab", for names typed in lower case. */
export function titleCase(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
