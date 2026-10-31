import axios from "axios";
import { apiBaseUrl } from "../config/env.js";
import { getToken, clearAuthData } from "../auth/tokenStorage.js";
import { getApiErrorMessage } from "./response.js";
import { startLoading, stopLoading } from "../loading/loadingStore.js";

const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
});

const publicAuthenticationPaths = new Set([
  "/auth/login",
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
    return "Searching SalonHub…";
  if (url === "/auth/login") return "Signing you in…";
  if (url === "/auth/logout") return "Signing you out…";
  if (url === "/auth/register" || url === "/auth/rigester")
    return "Creating your SalonHub account…";
  if (url === "/auth/email/verify") return "Verifying your email…";
  if (url === "/auth/email/resend")
    return "Sending a new verification code…";
  if (url === "/auth/password/forgot")
    return "Sending password reset instructions…";
  if (url === "/auth/password/verify-code")
    return "Verifying your reset code…";
  if (url === "/auth/password/reset")
    return "Securing your new password…";
  if (url === "/auth/password/change")
    return "Changing your password securely…";
  if (url === "/profile/career") return "Updating your career profile…";
  if (url.includes("/applications/") && url.endsWith("/accept"))
    return "Accepting the application…";
  if (url.includes("/applications/") && url.endsWith("/reject"))
    return "Rejecting the application…";
  if (url.includes("/hiring-posts/") && url.endsWith("/applications"))
    return "Sending your application…";
  if (url === "/hiring-posts" && method === "post")
    return "Publishing your hiring post…";
  if (url.endsWith("/close")) return "Closing the hiring post…";
  if (url.includes("/availability")) return "Checking available times…";
  if (url.startsWith("/bookings")) {
    if (url.endsWith("/accept")) return "Accepting the booking…";
    if (url.endsWith("/reject")) return "Rejecting the booking…";
    if (url.endsWith("/cancel")) return "Cancelling the booking…";
    if (url.endsWith("/complete")) return "Completing the booking…";
    if (url.includes("/assign-employee/")) return "Assigning the employee…";
    if (url.includes("/reschedule-proposals") && url.endsWith("/accept"))
      return "Accepting the new appointment time…";
    if (url.includes("/reschedule-proposals") && url.endsWith("/reject"))
      return "Rejecting the suggested time…";
    if (url.includes("/reschedule-proposals"))
      return "Suggesting a new appointment time…";
    if (method === "post") return "Booking your appointment…";
    return "Updating your booking…";
  }
  if (url.startsWith("/reviews"))
    return method === "delete" ? "Removing your review…" : "Publishing your review…";
  if (url.startsWith("/salon-services")) {
    if (method === "post") return "Adding the service…";
    if (method === "delete") return "Removing the service…";
    return "Updating the service…";
  }
  if (url.startsWith("/salon-employees")) {
    if (url.endsWith("/schedule")) return "Updating the employee schedule…";
    if (url.endsWith("/services")) return "Updating employee services…";
  }
  if (url.startsWith("/salon-media"))
    return method === "delete" ? "Removing the salon post…" : "Publishing the salon post…";
  if (url.startsWith("/notifications")) return "Updating your notifications…";
  if (url.startsWith("/employment")) {
    if (url.includes("/invite/")) return "Sending the salon invitation…";
    if (url.endsWith("/join")) return "Sending your join request…";
    if (url.endsWith("/accept")) return "Accepting the employment request…";
    if (url.endsWith("/reject")) return "Saving the employment decision…";
    if (url.endsWith("/cancel")) return "Cancelling the employment request…";
    if (url.includes("/leave/accept/")) return "Confirming the employee release…";
    if (url.includes("/leave/cancel/")) return "Cancelling the leave request…";
    if (url.endsWith("/leave/request")) return "Sending the leave request…";
  }
  if (url.startsWith("/salons")) {
    if (url.endsWith("/resubmit")) return "Resubmitting your salon…";
    if (method === "delete") return "Removing your salon…";
    if (method === "post") return "Creating your salon…";
    return "Updating your salon…";
  }
  if (method === "delete") return "Removing the selected item…";
  if (method === "post") return "Submitting your request…";
  return "Saving your changes…";
}

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !publicAuthenticationPaths.has(config.url))
    config.headers.Authorization = `Bearer ${token}`;
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
    return response;
  },
  (error) => {
    stopLoading(error.config?.salonHubLoadingId);
    error.message = getApiErrorMessage(error);
    // An older request must not sign out a newly authenticated session. A 403 is not a logout.
    const sentToken = error.config?.headers?.Authorization;
    if (
      error.response?.status === 401 &&
      sentToken &&
      sentToken === `Bearer ${getToken()}`
    )
      clearAuthData();
    return Promise.reject(error);
  },
);
export default httpClient;
