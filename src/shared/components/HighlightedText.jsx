import { highlightParts, matchText } from "../search/searchModel.js";

/**
 * Renders text with the parts that match a search wrapped in <mark>.
 * Pass explicit `ranges`, or a `query` to compute them with the shared matcher.
 */
export default function HighlightedText({ text = "", ranges, query }) {
  const spans = ranges ?? (query ? matchText(text, query)?.ranges : null) ?? [];
  if (!spans.length) return text;
  return highlightParts(text, spans).map((part, index) =>
    part.match ? <mark key={index}>{part.text}</mark> : part.text,
  );
}
