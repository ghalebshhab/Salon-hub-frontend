// VITE_* values are public browser configuration, never secrets.
export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8080/api" : "/api");
