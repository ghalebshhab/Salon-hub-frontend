export const OPEN_SEARCH_EVENT = "salonhub:open-search";

/** Ask the global search to open (from any button or shortcut). */
export function openGlobalSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}
