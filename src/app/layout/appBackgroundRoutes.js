const AUTH_ROUTE_PATTERNS = [
  /^\/login\/?$/,
  /^\/register\/?$/,
  /^\/verify-email\/?$/,
  /^\/forgot-password\/?$/,
  /^\/verify-reset-code\/?$/,
  /^\/reset-password\/?$/,
  /^\/auth-background-lab\/?$/,
];

export function isAuthenticationRoute(pathname) {
  return AUTH_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}
