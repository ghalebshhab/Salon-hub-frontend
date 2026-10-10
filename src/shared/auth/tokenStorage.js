const AUTH_CHANGED = "salonhub:auth-changed";
const notify = () => window.dispatchEvent(new Event(AUTH_CHANGED));

export function saveToken(token) {
  if (typeof token !== "string" || !token.trim())
    throw new Error("Invalid authentication token");
  localStorage.setItem("token", token);
  notify();
}
export const getToken = () => localStorage.getItem("token");
export const isLoggedIn = () => Boolean(getToken());
export function removeToken() {
  localStorage.removeItem("token");
  notify();
}
export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  notify();
}
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) ?? null;
  } catch {
    return null;
  }
}
export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  notify();
}
export function subscribeAuth(listener) {
  const onStorage = (event) => {
    if (event.key === null || event.key === "token" || event.key === "user")
      listener();
  };
  window.addEventListener(AUTH_CHANGED, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(AUTH_CHANGED, listener);
    window.removeEventListener("storage", onStorage);
  };
}
