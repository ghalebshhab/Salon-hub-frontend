/**
 * Chooses the error page kind for a failed request or a thrown error.
 *
 * It reads the HTTP status first, then the server's English message (kept in
 * error.serverMessage, because the shown message is already translated).
 * `notFoundKind` lets a page say what "not found" means there, for example
 * "salonUnavailable" on a salon page.
 */
const NOT_FOUND_TEXT =
  /not found|no longer available|not available|does not exist|unavailable/i;
const BLOCKED_TEXT = /blocked|not active|disabled|suspended/i;
const SIGN_IN_TEXT = /session is missing|expired|sign in/i;
const PERMISSION_TEXT = /permission|not allowed|only the owner|forbidden/i;

export default function classifyError(
  error,
  { notFoundKind = "notFound" } = {},
) {
  if (!error) return notFoundKind;

  const offline =
    (typeof navigator !== "undefined" && navigator.onLine === false) ||
    (!error.response && (error.request || error.code === "ERR_NETWORK"));
  if (offline) return "offline";

  const status = error.response?.status ?? error.status;
  if (status === 401) return "signInRequired";
  if (status === 403) return "forbidden";
  if (status === 404 || status === 410) return notFoundKind;
  if (status >= 500) return "serverError";

  const text = String(
    error.serverMessage ??
      error.response?.data?.serverMessage ??
      error.response?.data?.message ??
      "",
  );
  // A blocked salon or person is shown like a missing one: the page does not
  // tell visitors why something is hidden.
  if (NOT_FOUND_TEXT.test(text) || BLOCKED_TEXT.test(text)) return notFoundKind;
  if (SIGN_IN_TEXT.test(text)) return "signInRequired";
  if (PERMISSION_TEXT.test(text)) return "forbidden";
  return "serverError";
}
