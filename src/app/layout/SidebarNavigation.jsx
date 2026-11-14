import { LogIn, LogOut, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useEffect, useRef } from "react";
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
  const { loggedIn, isOwner, role, user } = useAuth();
  const asideRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Mobile drawer: move focus inside when it opens and keep Tab within it.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    closeButtonRef.current?.focus();
    const aside = asideRef.current;
    const trapFocus = (event) => {
      if (event.key !== "Tab" || !aside) return;
      const focusable = [
        ...aside.querySelectorAll("a[href], button:not([disabled])"),
      ].filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [mobileOpen]);
  const logout = useLogout();
  const hasSalon = Boolean(user?.ownedSalonId);
  // Employees have an employer salon (salonId); owners have ownedSalonId.
  const isEmployee = role === "EMPLOYEE";
  const sections = getNavigationSections({
    loggedIn,
    isOwner,
    hasSalon,
    isEmployee,
  });
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
        ref={asideRef}
        id="primary-navigation"
        className={`app-sidebar ${collapsed ? "is-collapsed" : ""} ${
          mobileOpen ? "is-mobile-open" : ""
        }`}
        aria-label="Primary navigation"
      >
        <div className="sidebar-mobile-head">
          <BrandLogo />
          <button
            ref={closeButtonRef}
            className="sidebar-icon-button"
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>
        {loggedIn ? (
          <div className="sidebar-identity">
            <div className="sidebar-avatar" aria-hidden="true">
              {initials || "SH"}
            </div>
            <div className="sidebar-identity-copy">
              <strong>{name}</strong>
              <span>{isOwner ? "Salon owner" : "Salon member"}</span>
            </div>
          </div>
        ) : (
          <div className="sidebar-guest">
            <div className="sidebar-guest-full">
              <strong>Your salon world, in one place</strong>
              <p>Book visits, follow salons, and grow your beauty career.</p>
              <div className="sidebar-guest-actions">
                <NavLink
                  to="/register"
                  className="sidebar-guest-join"
                  onClick={closeMobile}
                >
                  Join SalonHub
                </NavLink>
                <NavLink
                  to="/login"
                  className="sidebar-guest-login"
                  onClick={closeMobile}
                >
                  Log in
                </NavLink>
              </div>
            </div>
            <NavigationTooltip label="Log in">
              <NavLink
                to="/login"
                className="sidebar-link sidebar-guest-compact"
                aria-label="Log in"
              >
                <LogIn />
              </NavLink>
            </NavigationTooltip>
          </div>
        )}
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
