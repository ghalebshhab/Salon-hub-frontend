import t from "../../../shared/i18n/t.js";
import localized from "../../../shared/i18n/localized.js";
/** Layout rules for the public salon page. */

/** In-page sections, in page order. `id` is the section's DOM id. */
export const SALON_SECTIONS = [
  { id: "services", label: t("Services") },
  { id: "team", label: t("Team") },
  { id: "work", label: t("Work") },
  { id: "reviews", label: t("Reviews") },
  { id: "about", label: t("About") },
];

const TAGLINE_MAX = 170;

/** The salon description in the current language. */
export const salonDescription = (salon) =>
  localized(salon?.description, salon?.descriptionAr);

/**
 * A short line for the hero: the first sentence of the description, cut
 * at a word when it is long. The full text lives in the About section.
 */
export function tagline(description) {
  const text = String(description || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  const sentence = /^(.+?[.!?])(\s|$)/.exec(text)?.[1] || text;
  if (sentence.length <= TAGLINE_MAX) return sentence;
  const cut = sentence.slice(0, TAGLINE_MAX);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
}

const STATEMENT_MAX = 64;

/**
 * The words inside the cover monogram: a short statement about the salon,
 * taken from its description ("Men hair style salon"), and a small line
 * above the initials ("Amman · Est. 2026").
 */
export function salonStatement(salon) {
  const city = String(salon.city || "").trim();
  const year = salon.createdAt ? String(salon.createdAt).slice(0, 4) : "";
  let line = tagline(salonDescription(salon)).replace(/[.!?…。؟]+$/, "");
  if (line.length > STATEMENT_MAX) line = "";
  if (line) line = line[0].toLocaleUpperCase() + line.slice(1);
  // "Men hair style" reads as a statement: "Men hair style salon".
  const words = line.split(" ").filter(Boolean).length;
  if (line && words <= 4 && !/salon|صالون/i.test(line))
    line = t("{line} salon", { line });

  const text = line || t("Beauty salon");

  const kicker = [t(city), year && t("Est. {year}", { year })]
    .filter(Boolean)
    .join(" · ");
  return { text, kicker: kicker || t("On SalonHub") };
}
