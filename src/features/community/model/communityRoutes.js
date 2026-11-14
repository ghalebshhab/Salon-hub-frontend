export const COMMUNITY_ROUTES = {
  feed: "/community",
  discover: "/community/discover",
  requests: "/community/requests",
  following: "/community/following",
  create: "/community/new",
};

export const COMMUNITY_SECTION_TARGETS = {
  [COMMUNITY_ROUTES.feed]: { id: "community-feed" },
  [COMMUNITY_ROUTES.discover]: {
    id: "discover",
    focusId: "community-people-search",
  },
  [COMMUNITY_ROUTES.requests]: { id: "friend-requests" },
  [COMMUNITY_ROUTES.following]: { id: "followed-salons" },
  [COMMUNITY_ROUTES.create]: {
    id: "community-composer",
    focusSelector: "textarea",
  },
};

/**
 * Which workspace section a community URL shows. Creating a post happens
 * in the feed, so /community/new opens the feed with the composer focused.
 */
export function communitySectionFor(pathname) {
  if (pathname.startsWith(COMMUNITY_ROUTES.discover)) return "discover";
  if (pathname.startsWith(COMMUNITY_ROUTES.requests)) return "requests";
  if (pathname.startsWith(COMMUNITY_ROUTES.following)) return "following";
  return "feed";
}
