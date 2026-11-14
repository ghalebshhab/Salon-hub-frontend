// Signed-in work screens where a full marketing footer would only get in the way.
const WORKSPACE_ROUTES = [
  /^\/owner\//,
  /^\/employee\//,
  /^\/my-bookings/,
  /^\/my-applications/,
  /^\/notifications/,
  /^\/profile\//,
  /^\/account\//,
  /^\/employment/,
  /^\/salons\/[^/]+\/book/,
];

export function isWorkspaceRoute(pathname) {
  return WORKSPACE_ROUTES.some((pattern) => pattern.test(pathname));
}
