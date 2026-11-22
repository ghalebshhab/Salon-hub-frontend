import { createContext } from "react";
import AR from "./messages/ar.js";
import { AR_SERVER_PATTERNS } from "./messages/ar.server.js";

const DICTIONARIES = { ar: AR };
// Server messages with a number or a name inside: [English regex, template].
const PATTERNS = { ar: AR_SERVER_PATTERNS };

function fromPattern(language, text) {
  const patterns = PATTERNS[language];
  if (!patterns || typeof text !== "string") return null;
  for (const [pattern, template] of patterns) {
    if (pattern.test(text)) return text.replace(pattern, template);
  }
  return null;
}

/**
 * Translates English source text. The English sentence is the key, so code
 * stays readable and a missing translation simply shows the English text.
 * `{name}` placeholders are filled from `values`.
 */
export function translate(language, text, values) {
  if (text == null) return text;
  const dictionary = DICTIONARIES[language];
  const template =
    (dictionary && dictionary[text]) || fromPattern(language, text) || text;
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    values[name] == null ? match : String(values[name]),
  );
}

export const I18nContext = createContext({
  language: "en",
  dir: "ltr",
  setLanguage: () => {},
  t: (text, values) => translate("en", text, values),
});
