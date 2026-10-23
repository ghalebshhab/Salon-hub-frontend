import { ChevronDown, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ownerActions, ownerLinks } from "./navigationConfig.js";

export default function OwnerWorkspaceMenu({ open, onToggle, onNavigate }) {
  return (
    <div className="owner-dropdown nav-workspace-menu">
      <button
        className="owner-dropdown-button"
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="owner-navigation-menu"
      >
        <span className="nav-button-icon">
          <LayoutDashboard size={17} />
        </span>
        <span className="nav-button-copy">
          <small>Manage</small>
          Owner workspace
        </span>
        <ChevronDown
          size={16}
          className={open ? "chevron rotate" : "chevron"}
        />
      </button>
      <div
        id="owner-navigation-menu"
        className={
          open
            ? "owner-dropdown-menu owner-navigation-menu show"
            : "owner-dropdown-menu owner-navigation-menu"
        }
      >
        <div className="dropdown-heading">
          <span>Owner workspace</span>
          <small>Manage your salon and team</small>
        </div>
        <div className="dropdown-link-grid">
          {ownerLinks.map(({ to, label, icon: Icon }) => (
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
        </div>
        <div className="dropdown-action-row">
          {ownerActions.map(({ to, label, icon: Icon, className }) => (
            <NavLink
              to={to}
              className={className}
              onClick={onNavigate}
              key={to}
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
