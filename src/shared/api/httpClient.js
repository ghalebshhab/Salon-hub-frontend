import axios from "axios";
import { apiBaseUrl } from "../config/env.js";
import { getToken, clearAuthData } from "../auth/tokenStorage.js";

const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
});

const publicAuthenticationPaths = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/rigester",
]);

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !publicAuthenticationPaths.has(config.url))
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
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
