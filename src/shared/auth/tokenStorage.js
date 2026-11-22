/**
 * Client view of the sign-in session.
 *
 * The tokens live in httpOnly cookies that the server sets: page scripts can
 * never read them, so an XSS bug cannot steal an account. The server also sets
 * "salonhub_auth=1", a readable hint without any secret, so the app knows that
 * a session exists before the first request finishes.
 */
const AUTH_CHANGED = "salonhub:auth-changed";
const AUTH_SYNC_KEY = "salonhub:auth-sync";
const HINT_COOKIE = "salonhub_auth";

// Old builds kept the token in places scripts can read. Remove what is left.
const LEGACY_TOKEN_COOKIE = "salonhub_session";
try {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
} catch {
  // Storage can be blocked (private mode); there is nothing to clean then.
}
document.cookie = `${LEGACY_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;

// Changes on each sign-in, sign-out and cross-tab update, so a new account in
// the same browser always loads its own profile (the hint value is always "1").
let sessionEpoch = 0;

function hasHintCookie() {
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${HINT_COOKIE}=1`));
}

function notify({ broadcast = true } = {}) {
  sessionEpoch += 1;
  window.dispatchEvent(new Event(AUTH_CHANGED));
  if (!broadcast) return;
  try {
    localStorage.setItem(AUTH_SYNC_KEY, String(Date.now()));
  } catch {
    // Other tabs then update on their next request.
  }
}

/** A stable key for the current session, or null when signed out. */
export const getSessionKey = () =>
  hasHintCookie() ? `session-${sessionEpoch}` : null;

export const isLoggedIn = () => hasHintCookie();

/** Call after the server answered a sign-in with its cookies. */
export function markSignedIn() {
  notify();
}

/** Forgets the session on this device (the server clears its cookies too). */
export function clearAuthData() {
  document.cookie = `${HINT_COOKIE}=; Path=/; Max-Age=0; SameSite=Strict`;
  notify();
}

export function subscribeAuth(listener) {
  const onStorage = (event) => {
    if (event.key !== null && event.key !== AUTH_SYNC_KEY) return;
    sessionEpoch += 1;
    listener();
  };
  window.addEventListener(AUTH_CHANGED, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(AUTH_CHANGED, listener);
    window.removeEventListener("storage", onStorage);
  };
}
