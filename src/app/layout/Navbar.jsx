import useAuth from "../../shared/auth/useAuth.js";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Scissors,
  UserPlus,
  X,
  Image,
  Building2,
  BriefcaseBusiness,
  Bell,
  User,
} from "lucide-react";

import { clearAuthData } from "../../shared/auth/tokenStorage.js";

function Navbar() {
  const navigate = useNavigate();

  const { loggedIn } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const logout = () => {
    clearAuthData();
    closeMenus();
    navigate("/login");
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setOwnerMenuOpen(false);
    setProfileMenuOpen(false);
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
            {/* ✅ These links are always visible — public browsing allowed */}
            <NavLink to="/" className="creative-nav-link" onClick={closeMenus}>
              Home
            </NavLink>

            <NavLink
              to="/hiring-posts"
              className="creative-nav-link"
              onClick={closeMenus}
            >
              Hiring Posts
            </NavLink>

            {/* ✅ My Bookings only visible when logged in */}
            {loggedIn && (
              <NavLink
                to="/my-bookings"
                className="creative-nav-link"
                onClick={closeMenus}
              >
                My Bookings
              </NavLink>
            )}
          </div>

          {/* ✅ Owner Area only visible when logged in */}
          {loggedIn && (
            <div className="owner-dropdown">
              <button
                className="owner-dropdown-button"
                type="button"
                onClick={() => setOwnerMenuOpen((prev) => !prev)}
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
                  to="/owner/services"
                  className="dropdown-item"
                  onClick={closeMenus}
                >
                  <BriefcaseBusiness size={17} />
                  Services
                </NavLink>

                <NavLink
                  to="/owner/bookings"
                  className="dropdown-item highlight"
                  onClick={closeMenus}
                >
                  <CalendarCheck size={17} />
                  Salon Bookings
                </NavLink>

                <NavLink
                  to="/employee/bookings"
                  className="dropdown-item"
                  onClick={closeMenus}
                >
                  <CalendarCheck size={17} />
                  My Employee Bookings
                </NavLink>

                <NavLink
                  to="/owner/create-media-post"
                  className="dropdown-item"
                  onClick={closeMenus}
                >
                  <Image size={17} />
                  Post Media
                </NavLink>

                <NavLink
                  to="/owner/create-hiring-post"
                  className="dropdown-item"
                  onClick={closeMenus}
                >
                  <UserPlus size={17} />
                  Create Hiring
                </NavLink>
              </div>
            </div>
          )}

          {/* ✅ Auth area: shows Login+Signup when logged out, Bell+Profile when logged in */}
          <div className="navbar-auth-area">
            {loggedIn ? (
              // ── LOGGED IN: show notification bell + profile dropdown ──
              <div
                className="logged-in-actions"
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <button
                  className="notification-button"
                  type="button"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                </button>

                <div className="owner-dropdown">
                  <button
                    className="owner-dropdown-button"
                    type="button"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                  >
                    <User size={20} />
                    <ChevronDown
                      size={16}
                      className={profileMenuOpen ? "chevron rotate" : "chevron"}
                    />
                  </button>

                  <div
                    className={
                      profileMenuOpen
                        ? "owner-dropdown-menu show"
                        : "owner-dropdown-menu"
                    }
                  >
                    <div
                      className="dropdown-item"
                      style={{
                        borderBottom: "1px solid #eee",
                        pointerEvents: "none",
                      }}
                    >
                      <strong>My Profile</strong>
                    </div>

                    <button
                      className="dropdown-item"
                      onClick={logout}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        color: "#ef4444",
                      }}
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // ── LOGGED OUT: show Login + Signup ──
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
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
