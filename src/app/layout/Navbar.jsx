import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Scissors,
  User,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutApi } from "../../features/auth/api/authApi.js";
import useAuth from "../../shared/auth/useAuth.js";
import { clearAuthData } from "../../shared/auth/tokenStorage.js";

function Navbar() {
  const navigate = useNavigate();
  const { loggedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const closeMenus = () => {
    setMobileOpen(false);
    setOwnerMenuOpen(false);
    setProfileMenuOpen(false);
  };
  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      clearAuthData();
      closeMenus();
      navigate("/login");
    }
  };
  return (
    <header className="creative-navbar">
      <div className="container creative-navbar-inner">
        <Link to="/" className="creative-brand" onClick={closeMenus}>
          <span className="brand-icon">
            <Scissors size={20} />
          </span>
          <span className="brand-text">
            Salon<span>Hub</span>
          </span>
        </Link>
        <nav className={mobileOpen ? "creative-nav open" : "creative-nav"}>
          <div className="main-nav-links">
            <NavLink to="/" className="creative-nav-link" onClick={closeMenus}>
              Home
            </NavLink>
            {loggedIn && (
              <NavLink
                to="/hiring-posts"
                className="creative-nav-link"
                onClick={closeMenus}
              >
                Hiring Posts
              </NavLink>
            )}
          </div>
          {loggedIn && (
            <div className="owner-dropdown">
              <button
                className="owner-dropdown-button"
                type="button"
                onClick={() => setOwnerMenuOpen((value) => !value)}
              >
                <LayoutDashboard size={17} />
                Owner Area
                <ChevronDown
                  size={16}
                  className={ownerMenuOpen ? "chevron rotate" : "chevron"}
                />
              </button>
              <div
                className={
                  ownerMenuOpen
                    ? "owner-dropdown-menu show"
                    : "owner-dropdown-menu"
                }
              >
                <NavLink
                  to="/owner/dashboard"
                  className="dropdown-item"
                  onClick={closeMenus}
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/owner/create-salon"
                  className="dropdown-item"
                  onClick={closeMenus}
                >
                  <Building2 size={17} />
                  Create Salon
                </NavLink>
                <NavLink
                  to="/owner/my-salon"
                  className="dropdown-item"
                  onClick={closeMenus}
                >
                  <Scissors size={17} />
                  My Salon
                </NavLink>
                <NavLink
                  to="/owner/create-hiring-post"
                  className="dropdown-item"
                  onClick={closeMenus}
                >
                  <UserPlus size={17} />
                  Create Hiring Post
                </NavLink>
                <NavLink
                  to="/owner/applications"
                  className="dropdown-item"
                  onClick={closeMenus}
                >
                  <UsersRound size={17} />
                  Hiring Applications
                </NavLink>
              </div>
            </div>
          )}
          <div className="navbar-auth-area">
            {loggedIn ? (
              <div className="owner-dropdown">
                <button
                  className="owner-dropdown-button"
                  type="button"
                  onClick={() => setProfileMenuOpen((value) => !value)}
                >
                  <User size={20} />
                  <ChevronDown size={16} />
                </button>
                <div
                  className={
                    profileMenuOpen
                      ? "owner-dropdown-menu show"
                      : "owner-dropdown-menu"
                  }
                >
                  <NavLink
                    to="/profile/career"
                    className="dropdown-item"
                    onClick={closeMenus}
                  >
                    <BriefcaseBusiness size={17} />
                    Career Profile
                  </NavLink>
                  <button className="dropdown-item" onClick={logout}>
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="creative-nav-link"
                  onClick={closeMenus}
                >
                  <LogIn size={16} />
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="navbar-register-button"
                  onClick={closeMenus}
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </nav>
        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
export default Navbar;
