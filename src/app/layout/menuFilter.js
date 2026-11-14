import { matchText } from "../../shared/search/searchModel.js";

/**
 * Sidebar sections filtered to the items whose label starts with (or has a
 * word starting with) the query, each with highlight ranges. Sections with
 * no matching item are dropped; an empty query returns everything unchanged.
 */
export function filterNavigationSections(sections, query) {
  if (!query.trim()) return sections;
  return sections
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) => {
          const match = matchText(item.label, query);
          return match ? { ...item, ranges: match.ranges } : null;
        })
        .filter(Boolean),
    }))
    .filter((section) => section.items.length);
}
