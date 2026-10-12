const THEME_COOKIE = "salonhub_theme";

function readThemeCookie() {
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${THEME_COOKIE}=`))
    ?.split("=")[1];
  return value === "dark" ? "dark" : "light";
}

export function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  document.cookie = `${THEME_COOKIE}=${nextTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
  return nextTheme;
}

export function getInitialTheme() {
  return readThemeCookie();
}

applyTheme(readThemeCookie());
