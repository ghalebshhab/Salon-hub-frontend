import {
  Bell,
  CalendarCheck,
  IdCard,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useLogout from "../../features/auth/hooks/useLogout.js";
import NotificationBell from "../../features/notifications/components/NotificationBell.jsx";
import useAuth from "../../shared/auth/useAuth.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import useTheme from "../../shared/theme/useTheme.js";
import HeaderAccountMenu from "./HeaderAccountMenu.jsx";
import { pageTitleFor } from "./pageTitles.js";
import { openGlobalSearch } from "../search/searchEvents.js";

const ACCOUNT_LINKS = [
  { to: "/my-bookings", label: "My bookings", icon: CalendarCheck },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile/career", label: "Career profile", icon: IdCard },
  { to: "/account/security", label: "Account security", icon: ShieldCheck },
];
const OWNER_LINK = {
  to: "/owner/dashboard",
  label: "Salon dashboard",
  icon: LayoutDashboard,
};

const SHORTCUT_LABEL =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
    ? "⌘ K"
    : "Ctrl K";

const ROLE_LABELS = {
  OWNER: "Salon owner",
  EMPLOYEE: "Salon professional",
  ADMIN: "Administrator",
};

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);
  return scrolled;
}

function Navbar({ onOpenMobile, mobileOpen = false, showAuthActions = true }) {
  const { loggedIn, isOwner, role, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const logout = useLogout();
  const { pathname } = useLocation();
  const scrolled = useScrolled();
  const page = pageTitleFor(pathname);
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const initials =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SH";

  return (
    <header
      className={`creative-navbar ${scrolled ? "is-scrolled" : ""}`.trim()}
    >
      <div className="creative-navbar-inner">
        <Link to="/" className="creative-brand" aria-label="SalonHub home">
          <BrandLogo />
        </Link>
        <div className="header-page-title" aria-hidden="true">
          {page && (
            <>
              <span>{page.section}</span>
              <strong>{page.title}</strong>
            </>
          )}
        </div>
        <div className="navbar-actions">
          <button
            className="header-search-trigger"
            type="button"
            onClick={openGlobalSearch}
            aria-label="Search SalonHub"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Search aria-hidden="true" />
            <span>Search…</span>
            <kbd>{SHORTCUT_LABEL}</kbd>
          </button>
          <button
            className="header-icon-button"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          {loggedIn && <NotificationBell />}
          {loggedIn ? (
            <HeaderAccountMenu
              initials={initials}
              name={name || "Your account"}
              roleLabel={ROLE_LABELS[role] ?? "Salon member"}
              links={isOwner ? [OWNER_LINK, ...ACCOUNT_LINKS] : ACCOUNT_LINKS}
              onLogout={logout}
            />
          ) : (
            showAuthActions && (
              <div className="header-guest-actions">
                <NavLink to="/login" className="header-login-link">
                  Log in
                </NavLink>
                <NavLink to="/register" className="header-join-button">
                  Join
                </NavLink>
              </div>
            )
          )}
          {onOpenMobile && (
            <button
              className="mobile-menu-button"
              type="button"
              onClick={onOpenMobile}
              aria-label="Open navigation"
              aria-controls="primary-navigation"
              aria-expanded={mobileOpen}
            >
              <Menu />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
