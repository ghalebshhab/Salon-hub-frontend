/**
 * The app language. English is the source text; Arabic (Jordanian) is the
 * second language and switches the page to right-to-left.
 *
 * The choice is kept in a cookie (like the theme), so it applies before the
 * first paint and survives reloads. It is a per-browser preference.
 */
const LANGUAGE_COOKIE = "salonhub_lang";

export const LANGUAGES = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    dir: "ltr",
    sample: "Book your next visit",
  },
  {
    code: "ar",
    label: "Arabic (Jordan)",
    nativeLabel: "العربي",
    dir: "rtl",
    sample: "احجز زيارتك الجاي",
  },
];

const SUPPORTED = new Set(LANGUAGES.map((language) => language.code));

function readLanguageCookie() {
  if (typeof document === "undefined") return "en";
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LANGUAGE_COOKIE}=`))
    ?.split("=")[1];
  return SUPPORTED.has(value) ? value : "en";
}

export function languageInfo(code) {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0];
}

/** Sets lang and dir on <html> and remembers the choice. */
export function applyLanguage(code) {
  const language = languageInfo(code);
  const root = document.documentElement;
  root.lang = language.code === "ar" ? "ar-JO" : "en";
  root.dir = language.dir;
  document.cookie = `${LANGUAGE_COOKIE}=${language.code}; Path=/; Max-Age=31536000; SameSite=Lax`;
  currentLanguage = language.code;
  return language.code;
}

let currentLanguage = "en";

/** The language in use now, for `t()` outside React hooks. */
export function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Locale for dates and numbers. Arabic uses Jordanian month and day names
 * with Western digits (0-9), as most Jordanian apps do.
 */
export function dateLocale() {
  return currentLanguage === "ar" ? "ar-JO-u-nu-latn" : "en-GB";
}

export function getInitialLanguage() {
  return readLanguageCookie();
}

if (typeof document !== "undefined") {
  applyLanguage(readLanguageCookie());
}
