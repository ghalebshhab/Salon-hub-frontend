import {
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useLogout from "../../features/auth/hooks/useLogout.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import useAuth from "../../shared/auth/useAuth.js";
import NavigationTooltip from "./NavigationTooltip.jsx";
import { getNavigationSections } from "./navigationConfig.js";

function getUserName(user) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  return name || user?.userName || "SalonHub guest";
}

export default function SidebarNavigation({
  collapsed,
  mobileOpen,
  closeMobile,
  toggleCollapsed,
}) {
  const { loggedIn, user, isOwner } = useAuth();
  const logout = useLogout();
  const sections = getNavigationSections({ loggedIn, user, isOwner });
  const isEmployee = Boolean(user?.salonId);
  const roleLabel = isOwner
    ? "Salon owner"
    : isEmployee
      ? "Salon professional"
      : loggedIn
        ? "Member"
        : "Guest";

  return (
    <>
      <button
        className={
          mobileOpen
            ? "navigation-backdrop navigation-backdrop-visible"
            : "navigation-backdrop"
        }
        type="button"
        onClick={closeMobile}
        aria-label="Close navigation"
        tabIndex={mobileOpen ? 0 : -1}
      />

      <aside
        id="primary-navigation"
        className={`app-sidebar${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
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
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="sidebar-identity">
          <div className="sidebar-avatar" aria-hidden="true">
            <UserRound />
          </div>
          <div className="sidebar-identity-copy">
            <strong>{getUserName(user)}</strong>
            <span>{roleLabel}</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="SalonHub sections">
          {sections.map((section) => (
            <section className="sidebar-section" key={section.label}>
              <h2>{section.label}</h2>
              <div className="sidebar-section-links">
                {section.items.map(({ label, to, icon: Icon }) => (
                  <NavigationTooltip key={to} label={label}>
                    <NavLink
                      to={to}
                      end={to === "/"}
                      className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                      }
                      onClick={closeMobile}
                      aria-label={label}
                    >
                      <Icon aria-hidden="true" />
                      <span className="sidebar-link-label">{label}</span>
                    </NavLink>
                  </NavigationTooltip>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <div className="sidebar-footer">
          {loggedIn && (
            <NavigationTooltip label="Log out">
              <button
                className="sidebar-link sidebar-logout"
                type="button"
                onClick={() => void logout(closeMobile)}
                aria-label="Log out"
              >
                <LogOut aria-hidden="true" />
                <span className="sidebar-link-label">Log out</span>
              </button>
            </NavigationTooltip>
          )}
          <button
            className="sidebar-collapse-button"
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <PanelLeftOpen aria-hidden="true" />
            ) : (
              <PanelLeftClose aria-hidden="true" />
            )}
            <span>
              {collapsed ? "Expand navigation" : "Collapse navigation"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
