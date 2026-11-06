import { LogOut, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { logoutApi } from "../../features/auth/api/authApi.js";
import { clearAuthData } from "../../shared/auth/tokenStorage.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import useAuth from "../../shared/auth/useAuth.js";
import { getNavigationSections } from "./navigationConfig.js";
import NavigationTooltip from "./NavigationTooltip.jsx";

export default function SidebarNavigation({ collapsed, mobileOpen, onCloseMobile, onToggle }) {
  const { token, loggedIn } = useAuth();
  const sections = getNavigationSections({ token, loggedIn });
  const logout = async () => {
    try { await logoutApi(); } finally { clearAuthData(); onCloseMobile(); window.location.assign("/login"); }
  };

  return (
    <>
      <div className={mobileOpen ? "navigation-backdrop visible" : "navigation-backdrop"} onClick={onCloseMobile} aria-hidden="true" />
      <aside id="primary-navigation" className={`app-sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`} aria-label="Primary navigation">
        <div className="sidebar-mobile-head">
          <BrandLogo />
          <button className="sidebar-icon-button" type="button" onClick={onCloseMobile} aria-label="Close navigation">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="sidebar-identity">
          <div className="sidebar-avatar" aria-hidden="true">S</div>
          <div className="sidebar-identity-copy"><strong>SalonHub</strong><span>{loggedIn ? "Salon member" : "Guest"}</span></div>
        </div>
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div className="sidebar-section" key={section.label}>
              <h2>{section.label}</h2>
              {section.items.map(({ label, to, icon: Icon, badge }) => (
                <NavigationTooltip key={to} label={label}>
                  <NavLink to={to} className="sidebar-link" onClick={onCloseMobile} aria-label={label}>
                    <Icon aria-hidden="true" />
                    <span className="sidebar-link-label">{label}</span>
                    {badge && <span className="sidebar-badge" aria-label={`${badge} pending`}>{badge}</span>}
                  </NavLink>
                </NavigationTooltip>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          {loggedIn && <button className="sidebar-link sidebar-logout" type="button" onClick={logout}><LogOut aria-hidden="true" /><span className="sidebar-link-label">Logout</span></button>}
          <button className="sidebar-collapse-button" type="button" onClick={onToggle} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} aria-expanded={!collapsed}>
            {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}<span>{collapsed ? "Expand navigation" : "Collapse navigation"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
