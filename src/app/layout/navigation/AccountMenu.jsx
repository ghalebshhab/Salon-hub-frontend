import { ChevronDown, LogOut, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { accountLinks } from "./navigationConfig.js";

export default function AccountMenu({ open, onToggle, onNavigate, onLogout }) {
  return (
    <div className="owner-dropdown profile-dropdown">
      <button
        className="owner-dropdown-button profile-menu-button"
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="account-navigation-menu"
        aria-label="Open account menu"
      >
        <span className="profile-menu-avatar">
          <User size={18} />
        </span>
        <span className="nav-button-copy">
          <small>Your space</small>
          Account
        </span>
        <ChevronDown
          size={16}
          className={open ? "chevron rotate" : "chevron"}
        />
      </button>
      <div
        id="account-navigation-menu"
        className={
          open
            ? "owner-dropdown-menu profile-navigation-menu show"
            : "owner-dropdown-menu profile-navigation-menu"
        }
      >
        <div className="dropdown-heading">
          <span>Your space</span>
          <small>Profile, activity, and account</small>
        </div>
        {accountLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            to={to}
            className="dropdown-item"
            onClick={onNavigate}
            key={to}
          >
            <span className="dropdown-item-icon">
              <Icon size={17} />
            </span>
            {label}
          </NavLink>
        ))}
        <div className="dropdown-logout-section">
          <button
            className="dropdown-item dropdown-logout-button"
            type="button"
            onClick={onLogout}
          >
            <span className="dropdown-item-icon">
              <LogOut size={17} />
            </span>
            <span>
              <strong>Log out</strong>
              <small>End this SalonHub session</small>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
