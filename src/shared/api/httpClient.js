import axios from "axios";
import { apiBaseUrl } from "../config/env.js";
import { clearAuthData, isLoggedIn } from "../auth/tokenStorage.js";
import { getApiErrorMessage } from "./response.js";
import { startLoading, stopLoading } from "../loading/loadingStore.js";
import t from "../i18n/t.js";

const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  // The server refuses cookie-authenticated writes without this header (CSRF guard).
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

const REFRESH_PATH = "/auth/refresh";
const REFRESH_RETRY_MS = 400;

const publicAuthenticationPaths = new Set([
  "/auth/login",
  "/auth/refresh",
  "/auth/register",
  "/auth/rigester",
  "/auth/email/verify",
  "/auth/email/resend",
  "/auth/password/forgot",
  "/auth/password/verify-code",
  "/auth/password/reset",
]);

export function loadingMessageFor(config) {
  const url = config.url || "";
  const method = config.method?.toLowerCase();
  if (config.loadingMessage) return config.loadingMessage;
  const searchParams = config.params || {};
  if (
    method === "get" &&
    (url.includes("/search") ||
      ["search", "query", "keyword", "q"].some((key) => searchParams[key]))
  )
    return t("Searching SalonHub…");
  if (url === "/auth/login") return t("Signing you in…");
  if (url === "/auth/logout") return t("Signing you out…");
  if (url === "/auth/register" || url === "/auth/rigester")
    return t("Creating your SalonHub account…");
  if (url === "/auth/email/verify") return t("Verifying your email…");
  if (url === "/auth/email/resend")
    return t("Sending a new verification code…");
  if (url === "/auth/password/forgot")
    return t("Sending password reset instructions…");
  if (url === "/auth/password/verify-code")
    return t("Verifying your reset code…");
  if (url === "/auth/password/reset") return t("Securing your new password…");
  if (url === "/auth/password/change")
    return t("Changing your password securely…");
  if (url === "/profile/career") return t("Updating your career profile…");
  if (url.includes("/applications/") && url.endsWith("/accept"))
    return t("Accepting the application…");
  if (url.includes("/applications/") && url.endsWith("/reject"))
    return t("Rejecting the application…");
  if (url.includes("/hiring-posts/") && url.endsWith("/applications"))
    return t("Sending your application…");
  if (url === "/hiring-posts" && method === "post")
    return t("Publishing your hiring post…");
  if (url.endsWith("/close")) return t("Closing the hiring post…");
  if (url.includes("/availability")) return t("Checking available times…");
  if (url.startsWith("/bookings")) {
    if (url.endsWith("/accept")) return t("Accepting the booking…");
    if (url.endsWith("/reject")) return t("Rejecting the booking…");
    if (url.endsWith("/cancel")) return t("Cancelling the booking…");
    if (url.endsWith("/complete")) return t("Completing the booking…");
    if (url.includes("/assign-employee/")) return t("Assigning the employee…");
    if (url.includes("/reschedule-proposals") && url.endsWith("/accept"))
      return t("Accepting the new appointment time…");
    if (url.includes("/reschedule-proposals") && url.endsWith("/reject"))
      return t("Rejecting the suggested time…");
    if (url.includes("/reschedule-proposals"))
      return t("Suggesting a new appointment time…");
    if (method === "post") return t("Booking your appointment…");
    return t("Updating your booking…");
  }
  if (url.startsWith("/reviews"))
    return method === "delete"
      ? t("Removing your review…")
      : t("Publishing your review…");
  if (url.startsWith("/salon-services")) {
    if (method === "post") return t("Adding the service…");
    if (method === "delete") return t("Removing the service…");
    return t("Updating the service…");
  }
  if (url.startsWith("/salon-employees")) {
    if (url.endsWith("/schedule")) return t("Updating the employee schedule…");
    if (url.endsWith("/services")) return t("Updating employee services…");
  }
  if (url.startsWith("/salon-media"))
    return method === "delete"
      ? t("Removing the salon post…")
      : t("Publishing the salon post…");
  if (url.startsWith("/notifications"))
    return t("Updating your notifications…");
  if (url.startsWith("/community")) {
    if (url.endsWith("/like"))
      return method === "delete"
        ? t("Removing your reaction…")
        : t("Sharing your reaction…");
    if (url.includes("/comments"))
      return method === "delete"
        ? t("Removing the comment…")
        : t("Adding your comment…");
    if (url.includes("/friends")) return t("Updating your connections…");
    if (url.includes("/follow")) return t("Updating salon following…");
    if (method === "delete") return t("Removing your post…");
    if (method === "post") return t("Publishing to the community…");
  }
  if (url.startsWith("/employment")) {
    if (url.includes("/invite/")) return t("Sending the salon invitation…");
    if (url.endsWith("/join")) return t("Sending your join request…");
    if (url.endsWith("/accept")) return t("Accepting the employment request…");
    if (url.endsWith("/reject")) return t("Saving the employment decision…");
    if (url.endsWith("/cancel")) return t("Cancelling the employment request…");
    if (url.includes("/leave/accept/"))
      return t("Confirming the employee release…");
    if (url.includes("/leave/cancel/"))
      return t("Cancelling the leave request…");
    if (url.endsWith("/leave/request")) return t("Sending the leave request…");
  }
  if (url.startsWith("/salons")) {
    if (url.endsWith("/resubmit")) return t("Resubmitting your salon…");
    if (method === "delete") return t("Removing your salon…");
    if (method === "post") return t("Creating your salon…");
    return t("Updating your salon…");
  }
  if (method === "delete") return t("Removing the selected item…");
  if (method === "post") return t("Submitting your request…");
  return t("Saving your changes…");
}

httpClient.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  const shouldShowLoading =
    config.showLoading ??
    (Boolean(config.loadingMessage) ||
      ["post", "put", "patch", "delete"].includes(method));
  if (shouldShowLoading)
    config.salonHubLoadingId = startLoading(loadingMessageFor(config));
  return config;
});
httpClient.interceptors.response.use(
  (response) => {
    stopLoading(response.config?.salonHubLoadingId);
    // Server messages are English; show them in the chosen language.
    const payload = response.data;
    if (payload && typeof payload.message === "string") {
      // Keep the server's English text: code may classify it (for example "not found").
      payload.serverMessage = payload.message;
      payload.message = t(payload.message);
    }
    return response;
  },
  async (error) => {
    stopLoading(error.config?.salonHubLoadingId);
    const config = error.config;
    if (shouldRefresh(error, config)) {
      config._salonHubRetried = true;
      if (await refreshSession()) return httpClient(config);
      clearAuthData();
    }
    error.message = getApiErrorMessage(error);
    return Promise.reject(error);
  },
);

/** A 401 on a normal call means the 15-minute access token ended: refresh once. */
function shouldRefresh(error, config) {
  return (
    error.response?.status === 401 &&
    config &&
    !config._salonHubRetried &&
    !config.skipAuth &&
    !publicAuthenticationPaths.has(config.url) &&
    config.url !== REFRESH_PATH &&
    isLoggedIn()
  );
}

// One refresh at a time: parallel 401s all wait for the same call.
let refreshInFlight = null;

function refreshSession() {
  refreshInFlight ??= (async () => {
    try {
      if (await callRefresh()) return true;
      // Another tab may have rotated the token a moment ago; its new cookie is shared.
      await new Promise((resolve) => setTimeout(resolve, REFRESH_RETRY_MS));
      return await callRefresh();
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

async function callRefresh() {
  try {
    await httpClient.post(REFRESH_PATH, null, {
      showLoading: false,
      _salonHubRetried: true,
    });
    return true;
  } catch {
    return false;
  }
}

export default httpClient;
