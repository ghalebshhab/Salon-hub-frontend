import { LogIn, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import NotificationBell from "../../../features/notifications/components/NotificationBell.jsx";
import AccountMenu from "./AccountMenu.jsx";

export default function NavigationActions({
  loggedIn,
  theme,
  profileMenuOpen,
  onToggleTheme,
  onToggleProfileMenu,
  onNavigate,
  onLogout,
}) {
  return (
    <div className="navbar-auth-area">
      <span className="nav-group-label">Preferences</span>
      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        aria-pressed={theme === "dark"}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        <span>{theme === "dark" ? "Light" : "Dark"}</span>
      </button>

      {loggedIn ? (
        <>
          <div className="nav-notification-wrap">
            <NotificationBell />
            <span className="nav-mobile-control-label">Notifications</span>
          </div>
          <AccountMenu
            open={profileMenuOpen}
            onToggle={onToggleProfileMenu}
            onNavigate={onNavigate}
            onLogout={onLogout}
          />
        </>
      ) : (
        <div className="nav-guest-actions">
          <NavLink
            to="/login"
            className="creative-nav-link nav-login-link"
            onClick={onNavigate}
          >
            <LogIn size={16} />
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="navbar-register-button"
            onClick={onNavigate}
          >
            Join SalonHub
          </NavLink>
        </div>
      )}
    </div>
  );
}
