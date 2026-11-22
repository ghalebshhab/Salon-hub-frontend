import { applyTheme } from "./theme.js";
import useDocumentTheme from "./useDocumentTheme.js";

/**
 * The current theme and ways to change it. It reads the theme from <html>,
 * so the header toggle and the Settings page always show the same value.
 */
export default function useTheme() {
  const theme = useDocumentTheme();

  const setTheme = (next) => applyTheme(next);
  const toggleTheme = () => applyTheme(theme === "dark" ? "light" : "dark");

  return { theme, setTheme, toggleTheme };
}
