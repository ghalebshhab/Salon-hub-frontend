import { getCurrentLanguage } from "./language.js";

/**
 * Picks the Arabic copy of owner-written text (a service name, a salon
 * description) when the app is in Arabic and the copy exists; otherwise the
 * English the owner wrote. The server fills the Arabic copy with Claude.
 */
export default function localized(english, arabic) {
  if (
    getCurrentLanguage() === "ar" &&
    typeof arabic === "string" &&
    arabic.trim()
  )
    return arabic.trim();
  return english;
}
