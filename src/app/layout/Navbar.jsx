import { Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useLogout from "../../features/auth/hooks/useLogout.js";
import NotificationBell from "../../features/notifications/components/NotificationBell.jsx";
import useAuth from "../../shared/auth/useAuth.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import useTheme from "../../shared/theme/useTheme.js";

function Navbar({ onOpenMobile, onToggle, collapsed }) {
  const { loggedIn, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const logout = useLogout();
  const [profileOpen, setProfileOpen] = useState(false);
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
        <button
          className="sidebar-toggle-button"
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          aria-controls="primary-navigation"
          aria-expanded={!collapsed}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </button>
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
            <div className="header-profile-wrap">
              <button
                className="header-avatar-button"
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                aria-label="Open account menu"
                aria-expanded={profileOpen}
              >
                <span aria-hidden="true">{initials}</span>
              </button>
              {profileOpen && (
                <div className="header-profile-menu">
                  <NavLink
                    to="/profile/career"
                    onClick={() => setProfileOpen(false)}
                  >
                    Career profile
                  </NavLink>
                  <NavLink
                    to="/my-bookings"
                    onClick={() => setProfileOpen(false)}
                  >
                    My bookings
                  </NavLink>
                  <NavLink
                    to="/account/security"
                    onClick={() => setProfileOpen(false)}
                  >
                    Account security
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => void logout(() => setProfileOpen(false))}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="header-login-link">
              Log in
            </NavLink>
          )}
          <button
            className="mobile-menu-button"
            type="button"
            onClick={onOpenMobile}
            aria-label="Open navigation"
          >
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
