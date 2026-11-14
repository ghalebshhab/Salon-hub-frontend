/**
 * Pure, case-insensitive "starts with" matching used by every SalonHub search.
 *
 * A query matches when the whole text starts with it ("boo" → "Booking requests"),
 * or when every word of the query starts some word of the text
 * ("req" → "Booking requests", "my sal" → "My salon"). Middle-of-word
 * matches are intentionally ignored so results narrow predictably as the
 * user types one more character.
 */

export function normalizeQuery(query = "") {
  return String(query).trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function wordStarts(text) {
  const starts = [];
  for (let index = 0; index < text.length; index += 1) {
    const current = /[\p{L}\p{N}]/u.test(text[index]);
    const previous = index > 0 && /[\p{L}\p{N}]/u.test(text[index - 1]);
    if (current && !previous) starts.push(index);
  }
  return starts;
}

/**
 * @returns {{ score: number, ranges: Array<[number, number]> } | null}
 *   score 3 = whole text starts with the query, 2 = every query word starts
 *   a word in the text; ranges are [start, end) spans to highlight.
 */
export function matchText(text, query) {
  const normalized = normalizeQuery(query);
  if (!normalized || !text) return null;
  const lower = String(text).toLocaleLowerCase();

  if (lower.startsWith(normalized)) {
    return { score: 3, ranges: [[0, normalized.length]] };
  }

  const starts = wordStarts(lower);
  const used = new Set();
  const ranges = [];
  for (const token of normalized.split(" ")) {
    const start = starts.find(
      (position) => !used.has(position) && lower.startsWith(token, position),
    );
    if (start === undefined) return null;
    used.add(start);
    ranges.push([start, start + token.length]);
  }
  ranges.sort((a, b) => a[0] - b[0]);
  return { score: 2, ranges };
}

/**
 * Rank items by their title first, then by keywords (no highlight).
 * Ties keep the original order, so curated lists stay in a sensible order.
 */
export function searchItems(items, query, limit = Infinity) {
  if (!normalizeQuery(query)) return [];
  return items
    .map((item, order) => {
      const titleMatch = matchText(item.title, query);
      if (titleMatch) return { item, order, ...titleMatch };
      const keywordHit = (item.keywords ?? []).some((keyword) =>
        matchText(keyword, query),
      );
      return keywordHit ? { item, order, score: 1, ranges: [] } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit);
}

/** Split text into plain and highlighted parts for rendering. */
export function highlightParts(text, ranges = []) {
  const parts = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start > cursor) parts.push({ text: text.slice(cursor, start) });
    parts.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  return parts;
}
