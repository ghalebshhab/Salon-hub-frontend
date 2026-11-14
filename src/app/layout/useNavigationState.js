import { useEffect, useRef, useState } from "react";

const DESKTOP_KEY = "salonhub.sidebar.collapsed";

function readDesktopPreference() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(DESKTOP_KEY) === "true";
  } catch {
    return false;
  }
}

export default function useNavigationState() {
  const [collapsed, setCollapsed] = useState(readDesktopPreference);
  const [mobileOpen, setMobileOpen] = useState(false);
  // The control that opened the drawer gets focus back when it closes.
  const openerRef = useRef(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(DESKTOP_KEY, String(collapsed));
    } catch {
      // Storage can be unavailable; the preference simply is not remembered.
    }
  }, [collapsed]);

  useEffect(() => {
    document.body.classList.toggle("navigation-drawer-open", mobileOpen);
    if (wasOpenRef.current && !mobileOpen) openerRef.current?.focus?.();
    wasOpenRef.current = mobileOpen;
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
    openMobile: () => {
      openerRef.current = document.activeElement;
      setMobileOpen(true);
    },
    closeMobile: () => setMobileOpen(false),
  };
}
