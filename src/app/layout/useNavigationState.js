import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

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
  // The phone menu remembers the page it was opened on and counts as open
  // only on that page, so opening any other page closes it.
  const { pathname, search } = useLocation();
  const currentPage = `${pathname}${search}`;
  const [openedOnPage, setOpenedOnPage] = useState(null);
  const mobileOpen = openedOnPage === currentPage;
  const setMobileOpen = (open) => setOpenedOnPage(open ? currentPage : null);
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
      if (event.key === "Escape") setOpenedOnPage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // While the phone menu is open: a tap outside it (header and page
  // included) closes it, and so does a tap on any link inside it, even a
  // link to the page that is already open.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const handlePointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(".app-sidebar, .mobile-menu-button")) return;
      setOpenedOnPage(null);
    };
    const handleClick = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(".app-sidebar a[href]")) setOpenedOnPage(null);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("click", handleClick);
    };
  }, [mobileOpen]);

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
