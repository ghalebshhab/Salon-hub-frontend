import {
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useLogout from "../../features/auth/hooks/useLogout.js";
import useAuth from "../../shared/auth/useAuth.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import usePendingBookingCount from "../../features/bookings/hooks/usePendingBookingCount.js";
import { useNotifications } from "../../features/notifications/context/NotificationContext.js";
import { getNavigationSections } from "./navigationConfig.js";
import NavigationTooltip from "./NavigationTooltip.jsx";
import SidebarCreateMenu from "./SidebarCreateMenu.jsx";
import { filterNavigationSections } from "./menuFilter.js";
import HighlightedText from "../../shared/components/HighlightedText.jsx";
import { openGlobalSearch } from "../search/searchEvents.js";

export default function SidebarNavigation({
  collapsed,
  mobileOpen,
  closeMobile,
  toggleCollapsed,
}) {
  const { loggedIn, isOwner, role, user } = useAuth();
  const { unreadCount } = useNotifications();
  const badgeCounts = {
    unreadNotifications: unreadCount,
    pendingBookings: usePendingBookingCount(loggedIn && isOwner),
  };
  const navigate = useNavigate();
  const [menuQuery, setMenuQuery] = useState("");
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
  const visibleSections = filterNavigationSections(sections, menuQuery);
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
        <div className="sidebar-menu-search" role="search">
          <Search aria-hidden="true" />
          <input
            type="search"
            value={menuQuery}
            onChange={(event) => setMenuQuery(event.target.value)}
            onKeyDown={(event) => {
              const first = visibleSections[0]?.items[0];
              if (event.key === "Enter" && first && menuQuery.trim()) {
                event.preventDefault();
                setMenuQuery("");
                closeMobile();
                navigate(first.to);
              } else if (event.key === "Escape" && menuQuery) {
                event.stopPropagation();
                setMenuQuery("");
              }
            }}
            placeholder="Search menu"
            aria-label="Search the menu"
            autoComplete="off"
          />
        </div>
        <NavigationTooltip label="Search">
          <button
            className="sidebar-link sidebar-search-compact"
            type="button"
            onClick={openGlobalSearch}
            aria-label="Search"
          >
            <Search />
          </button>
        </NavigationTooltip>
        <nav className="sidebar-nav">
          {menuQuery.trim() && visibleSections.length === 0 && (
            <p className="sidebar-menu-empty" role="status">
              No menu items start with “{menuQuery.trim()}”.
            </p>
          )}
          {visibleSections.map((section) => (
            <section className="sidebar-section" key={section.label}>
              <div className="sidebar-section-head">
                <h2>{section.label}</h2>
                {section.actions && (
                  <SidebarCreateMenu
                    actions={section.actions}
                    onNavigate={closeMobile}
                  />
                )}
              </div>
              {section.items.map(
                ({ label, to, icon: Icon, end, badge, ranges }) => {
                  const count = badge ? Number(badgeCounts[badge]) || 0 : 0;
                  return (
                    <NavigationTooltip key={to} label={label}>
                      <NavLink
                        to={to}
                        end={end}
                        className="sidebar-link"
                        onClick={closeMobile}
                        aria-label={
                          count > 0 ? `${label}, ${count} new` : label
                        }
                      >
                        <Icon />
                        <span className="sidebar-link-label">
                          <HighlightedText text={label} ranges={ranges} />
                        </span>
                        {count > 0 && (
                          <span className="sidebar-badge" aria-hidden="true">
                            {count > 99 ? "99+" : count}
                          </span>
                        )}
                      </NavLink>
                    </NavigationTooltip>
                  );
                },
              )}
            </section>
          ))}
        </nav>
        <div className="sidebar-footer">
          {loggedIn && (
            <NavigationTooltip label="Account security">
              <NavLink
                to="/account/security"
                className="sidebar-link"
                onClick={closeMobile}
                aria-label="Account security"
              >
                <ShieldCheck />
                <span className="sidebar-link-label">Account security</span>
              </NavLink>
            </NavigationTooltip>
          )}
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
