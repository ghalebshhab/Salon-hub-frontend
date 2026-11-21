/** Rules and helpers for the salon work gallery. */

export const GALLERY_PAGE_SIZE = 24;
export const GALLERY_PREVIEW_COUNT = 9;
/** The first tile is large only when the grid has enough tiles around it. */
export const FEATURE_TILE_MIN = 3;

export const isVideo = (item) => item?.resourceType === "VIDEO";

export function firstName(name) {
  return (
    String(name || "")
      .trim()
      .split(/\s+/)[0] || "the artist"
  );
}

/** One chip per team member who posted, most posts first. */
export function artistFilters(items) {
  const byId = new Map();
  items.forEach((item) => {
    const key = item.employeeId;
    if (key == null) return;
    const entry = byId.get(key) || {
      id: key,
      name: firstName(item.employeeName),
      count: 0,
    };
    entry.count += 1;
    byId.set(key, entry);
  });
  return [...byId.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

export function filterByArtist(items, artistId) {
  if (artistId == null) return items;
  return items.filter((item) => item.employeeId === artistId);
}

/** "12 photos · 3 videos · by 4 professionals". */
export function gallerySummary(items, total) {
  const videos = items.filter(isVideo).length;
  const photos = items.length - videos;
  const artists = artistFilters(items).length;
  return { photos, videos, artists, total: Math.max(total || 0, items.length) };
}

export function altText(item) {
  const who = item.employeeName || "the salon team";
  if (item.caption) return `${item.caption}, by ${who}`;
  return isVideo(item) ? `Video by ${who}` : `Work by ${who}`;
}

export function postedDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { dateStyle: "medium" });
}
