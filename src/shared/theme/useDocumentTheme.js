import { useEffect, useState } from "react";
import { getInitialTheme } from "./theme.js";

export default function useDocumentTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
