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
