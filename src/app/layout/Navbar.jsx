import { Menu, Moon, Sun } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import useLogout from "../../features/auth/hooks/useLogout.js";
import NotificationBell from "../../features/notifications/components/NotificationBell.jsx";
import useAuth from "../../shared/auth/useAuth.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import useTheme from "../../shared/theme/useTheme.js";
import HeaderAccountMenu from "./HeaderAccountMenu.jsx";

const ACCOUNT_LINKS = [
  { to: "/profile/career", label: "Career profile" },
  { to: "/my-bookings", label: "My bookings" },
  { to: "/account/security", label: "Account security" },
];

function Navbar({ onOpenMobile, mobileOpen = false }) {
  const { loggedIn, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const logout = useLogout();
  const initials =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SH";

  return (
    <header className="creative-navbar">
      <div className="creative-navbar-inner">
        <Link to="/" className="creative-brand" aria-label="SalonHub home">
          <BrandLogo />
        </Link>
        <div className="navbar-spacer" />
        <div className="navbar-actions">
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
              links={ACCOUNT_LINKS}
              onLogout={logout}
            />
          ) : (
            <NavLink to="/login" className="header-login-link">
              Log in
            </NavLink>
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
