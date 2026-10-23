import { Link } from "react-router-dom";
import useLogout from "../../features/auth/hooks/useLogout.js";
import useAuth from "../../shared/auth/useAuth.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import useTheme from "../../shared/theme/useTheme.js";
import ExploreNavigation from "./navigation/ExploreNavigation.jsx";
import MobileMenuButton from "./navigation/MobileMenuButton.jsx";
import NavigationActions from "./navigation/NavigationActions.jsx";
import OwnerWorkspaceMenu from "./navigation/OwnerWorkspaceMenu.jsx";
import useNavigationMenus from "./navigation/useNavigationMenus.js";

function Navbar() {
  const { loggedIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const logout = useLogout();
  const menus = useNavigationMenus();

  return (
    <header className="creative-navbar">
      <div className="container creative-navbar-inner">
        <Link to="/" className="creative-brand" onClick={menus.closeMenus}>
          <BrandLogo />
        </Link>

        <nav
          id="primary-navigation"
          className={menus.mobileOpen ? "creative-nav open" : "creative-nav"}
          aria-label="Primary navigation"
        >
          <div className="nav-mobile-heading">
            <div>
              <span>Navigate SalonHub</span>
              <strong>Where would you like to go?</strong>
            </div>
          </div>

          <ExploreNavigation
            loggedIn={loggedIn}
            onNavigate={menus.closeMenus}
          />
          {loggedIn && (
            <OwnerWorkspaceMenu
              open={menus.ownerMenuOpen}
              onToggle={menus.toggleOwnerMenu}
              onNavigate={menus.closeMenus}
            />
          )}
          <NavigationActions
            loggedIn={loggedIn}
            theme={theme}
            profileMenuOpen={menus.profileMenuOpen}
            onToggleTheme={toggleTheme}
            onToggleProfileMenu={menus.toggleProfileMenu}
            onNavigate={menus.closeMenus}
            onLogout={() => void logout(menus.closeMenus)}
          />
        </nav>

        <MobileMenuButton
          open={menus.mobileOpen}
          onToggle={menus.toggleMobileMenu}
        />
      </div>

      <button
        className={
          menus.mobileOpen ? "navigation-backdrop show" : "navigation-backdrop"
        }
        type="button"
        onClick={menus.closeMenus}
        aria-label="Close navigation"
        tabIndex={menus.mobileOpen ? 0 : -1}
      />
    </header>
  );
}

export default Navbar;
