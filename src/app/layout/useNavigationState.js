import { useEffect, useState } from "react";

const DESKTOP_KEY = "salonhub.sidebar.collapsed";

function readDesktopPreference() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DESKTOP_KEY) === "true";
}

export default function useNavigationState() {
  const [collapsed, setCollapsed] = useState(readDesktopPreference);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(DESKTOP_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    document.body.classList.toggle("navigation-drawer-open", mobileOpen);
    return () => document.body.classList.remove("navigation-drawer-open");
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    collapsed,
    mobileOpen,
    toggleCollapsed: () => setCollapsed((value) => !value),
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
  };
}
