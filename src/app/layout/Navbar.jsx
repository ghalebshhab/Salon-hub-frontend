import {
  Bell,
  CalendarCheck,
  IdCard,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Settings as SettingsIcon,
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
import useI18n from "../../shared/i18n/useI18n.js";
import HeaderAccountMenu from "./HeaderAccountMenu.jsx";
import { pageTitleFor } from "./pageTitles.js";
import { openGlobalSearch } from "../search/searchEvents.js";
import t from "../../shared/i18n/t.js";

const ACCOUNT_LINKS = [
  { to: "/my-bookings", label: t("My bookings"), icon: CalendarCheck },
  { to: "/notifications", label: t("Notifications"), icon: Bell },
  { to: "/profile/career", label: t("Career profile"), icon: IdCard },
  { to: "/account/security", label: t("Account security"), icon: ShieldCheck },
  { to: "/settings", label: t("Settings"), icon: SettingsIcon },
];
const OWNER_LINK = {
  to: "/owner/dashboard",
  label: t("Salon dashboard"),
  icon: LayoutDashboard,
};

const SHORTCUT_LABEL =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
    ? t("⌘ K")
    : t("Ctrl K");

const ROLE_LABELS = {
  OWNER: t("Salon owner"),
  EMPLOYEE: t("Salon professional"),
  ADMIN: t("Administrator"),
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
  const { t } = useI18n();
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
        <Link to="/" className="creative-brand" aria-label={t("SalonHub home")}>
          <BrandLogo />
        </Link>
        <div className="header-page-title" aria-hidden="true">
          {page && (
            <>
              <span>{t(page.section)}</span>
              <strong>{t(page.title)}</strong>
            </>
          )}
        </div>
        <div className="navbar-actions">
          <button
            className="header-search-trigger"
            type="button"
            onClick={openGlobalSearch}
            aria-label={t("Search SalonHub")}
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Search aria-hidden="true" />
            <span>{t("Search…")}</span>
            <kbd>{SHORTCUT_LABEL}</kbd>
          </button>
          <button
            className="header-icon-button"
            type="button"
            onClick={toggleTheme}
            aria-label={t(
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
            )}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          {loggedIn && <NotificationBell />}
          {loggedIn ? (
            <HeaderAccountMenu
              initials={initials}
              name={name || t("Your account")}
              roleLabel={t(ROLE_LABELS[role] ?? "Salon member")}
              links={(isOwner
                ? [OWNER_LINK, ...ACCOUNT_LINKS]
                : ACCOUNT_LINKS
              ).map((link) => ({ ...link, label: t(link.label) }))}
              onLogout={logout}
            />
          ) : (
            showAuthActions && (
              <div className="header-guest-actions">
                <NavLink to="/login" className="header-login-link">
                  {t("Log in")}
                </NavLink>
                <NavLink to="/register" className="header-join-button">
                  {t("Join")}
                </NavLink>
              </div>
            )
          )}
          {onOpenMobile && (
            <button
              className="mobile-menu-button"
              type="button"
              onClick={onOpenMobile}
              aria-label={t("Open navigation")}
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
