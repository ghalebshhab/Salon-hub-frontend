import { useState } from "react";
import { applyTheme, getInitialTheme } from "./theme.js";

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    const nextTheme = applyTheme(theme === "dark" ? "light" : "dark");
    setTheme(nextTheme);
  };

  return { theme, toggleTheme };
}
