/** Layout rules for the public salon page. */

/** In-page sections, in page order. `id` is the section's DOM id. */
export const SALON_SECTIONS = [
  { id: "services", label: "Services" },
  { id: "team", label: "Team" },
  { id: "work", label: "Work" },
  { id: "reviews", label: "Reviews" },
  { id: "about", label: "About" },
];

const TAGLINE_MAX = 170;

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
  let line = tagline(salon.description).replace(/[.!?…]+$/, "");
  if (line.length > STATEMENT_MAX) line = "";
  if (line) line = line[0].toLocaleUpperCase() + line.slice(1);
  // "Men hair style" reads as a statement: "Men hair style salon".
  const words = line.split(" ").filter(Boolean).length;
  if (line && words <= 4 && !/salon/i.test(line)) line = `${line} salon`;

  const text = line || "Beauty salon";

  const kicker = [city, year && `Est. ${year}`].filter(Boolean).join(" · ");
  return { text, kicker: kicker || "On SalonHub" };
}
