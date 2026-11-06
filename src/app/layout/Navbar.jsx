import { Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { logoutApi } from "../../features/auth/api/authApi.js";
import useAuth from "../../shared/auth/useAuth.js";
import { clearAuthData } from "../../shared/auth/tokenStorage.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import useTheme from "../../shared/theme/useTheme.js";
import NotificationBell from "../../features/notifications/components/NotificationBell.jsx";

function Navbar({ onOpenMobile, onToggle, collapsed }) {
  const { loggedIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      clearAuthData();
      setProfileOpen(false);
      window.location.assign("/login");
    }
  };

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
          {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
        </button>
        <Link to="/" className="creative-brand" aria-label="SalonHub home">
          <BrandLogo />
        </Link>
        <div className="navbar-spacer" />
        <div className="navbar-actions">
          <button className="header-icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} aria-pressed={theme === "dark"}>
            {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          {loggedIn && <NotificationBell />}
          {loggedIn ? (
            <div className="header-profile-wrap">
              <button className="header-avatar-button" type="button" onClick={() => setProfileOpen((value) => !value)} aria-label="Open account menu" aria-expanded={profileOpen}>
                <span aria-hidden="true">S</span>
              </button>
              {profileOpen && (
                <div className="header-profile-menu">
                  <NavLink to="/profile/career" onClick={() => setProfileOpen(false)}>Career profile</NavLink>
                  <NavLink to="/my-bookings" onClick={() => setProfileOpen(false)}>My bookings</NavLink>
                  <button type="button" onClick={logout}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="header-login-link">Log in</NavLink>
          )}
          <button className="mobile-menu-button" type="button" onClick={onOpenMobile} aria-label="Open navigation">
            <Menu aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
