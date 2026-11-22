import { markSignedIn } from "../shared/auth/tokenStorage.js";

/**
 * Signs in the way the server does: the real tokens are httpOnly cookies a
 * script cannot see, and the server also sets the readable "salonhub_auth=1"
 * hint that the app checks. Tests only need the hint.
 */
export function signInForTest() {
  document.cookie = "salonhub_auth=1; Path=/";
  markSignedIn();
}
