const AUTH_CHANGED = "salonhub:auth-changed";
const AUTH_SYNC_KEY = "salonhub:auth-sync";
const TOKEN_COOKIE = "salonhub_session";
localStorage.removeItem("token");
localStorage.removeItem("user");
const notify = () => {
  window.dispatchEvent(new Event(AUTH_CHANGED));
  localStorage.setItem(AUTH_SYNC_KEY, String(Date.now()));
};

function readCookie(name) {
  const prefix = `${name}=`;
  const item = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : null;
}

export function saveToken(token) {
  if (typeof token !== "string" || !token.trim())
    throw new Error("Invalid authentication token");
  const localDevelopment = ["localhost", "127.0.0.1"].includes(
    window.location.hostname,
  );
  const secure = localDevelopment ? "" : "; Secure";
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=86400; SameSite=Lax${secure}`;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  notify();
}
export const getToken = () => readCookie(TOKEN_COOKIE);
export const isLoggedIn = () => Boolean(getToken());
export function removeToken() {
  const localDevelopment = ["localhost", "127.0.0.1"].includes(
    window.location.hostname,
  );
  const secure = localDevelopment ? "" : "; Secure";
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
  localStorage.removeItem("token");
  notify();
}
export function clearAuthData() {
  localStorage.removeItem("user");
  removeToken();
}
export function subscribeAuth(listener) {
  const onStorage = (event) => {
    if (event.key === null || event.key === AUTH_SYNC_KEY) listener();
  };
  window.addEventListener(AUTH_CHANGED, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(AUTH_CHANGED, listener);
    window.removeEventListener("storage", onStorage);
  };
}
