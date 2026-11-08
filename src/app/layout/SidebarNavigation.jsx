import { LogOut, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import useLogout from "../../features/auth/hooks/useLogout.js";
import useAuth from "../../shared/auth/useAuth.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import { getNavigationSections } from "./navigationConfig.js";
import NavigationTooltip from "./NavigationTooltip.jsx";

export default function SidebarNavigation({
  collapsed,
  mobileOpen,
  closeMobile,
  toggleCollapsed,
}) {
  const { loggedIn, isOwner, user } = useAuth();
  const logout = useLogout();
  const hasSalon = Boolean(user?.ownedSalonId);
  const sections = getNavigationSections({ loggedIn, isOwner, hasSalon });
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "SalonHub";
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <button
        className={
          mobileOpen ? "navigation-backdrop visible" : "navigation-backdrop"
        }
        type="button"
        onClick={closeMobile}
        aria-label="Close navigation"
        tabIndex={mobileOpen ? 0 : -1}
      />
      <aside
        id="primary-navigation"
        className={`app-sidebar ${collapsed ? "is-collapsed" : ""} ${
          mobileOpen ? "is-mobile-open" : ""
        }`}
        aria-label="Primary navigation"
      >
        <div className="sidebar-mobile-head">
          <BrandLogo />
          <button
            className="sidebar-icon-button"
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>
        <div className="sidebar-identity">
          <div className="sidebar-avatar" aria-hidden="true">
            {initials || "SH"}
          </div>
          <div className="sidebar-identity-copy">
            <strong>{name}</strong>
            <span>
              {loggedIn ? (isOwner ? "Salon owner" : "Salon member") : "Guest"}
            </span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <section className="sidebar-section" key={section.label}>
              <h2>{section.label}</h2>
              {section.items.map(({ label, to, icon: Icon, end }) => (
                <NavigationTooltip key={to} label={label}>
                  <NavLink
                    to={to}
                    end={end}
                    className="sidebar-link"
                    onClick={closeMobile}
                    aria-label={label}
                  >
                    <Icon />
                    <span className="sidebar-link-label">{label}</span>
                  </NavLink>
                </NavigationTooltip>
              ))}
            </section>
          ))}
        </nav>
        <div className="sidebar-footer">
          {loggedIn && (
            <button
              className="sidebar-link sidebar-logout"
              type="button"
              onClick={() => void logout(closeMobile)}
            >
              <LogOut />
              <span className="sidebar-link-label">Log out</span>
            </button>
          )}
          <button
            className="sidebar-collapse-button"
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            aria-expanded={!collapsed}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            <span>
              {collapsed ? "Expand navigation" : "Collapse navigation"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
