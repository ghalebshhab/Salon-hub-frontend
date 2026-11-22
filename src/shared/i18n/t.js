import { translate } from "./i18nContext.js";
import { getCurrentLanguage } from "./language.js";

/**
 * Translates English source text into the current language. Call it while
 * rendering (not in module-level constants), so a language change shows up:
 * I18nProvider draws the app again when the language changes.
 *
 *   t("My bookings")                    → "حجوزاتي"
 *   t("{count} min", { count: 12 })     → "12 دقيقة"
 */
export default function t(text, values) {
  return translate(getCurrentLanguage(), text, values);
}
