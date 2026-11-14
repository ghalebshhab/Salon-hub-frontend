import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import SidebarNavigation from "./SidebarNavigation.jsx";
import useNavigationState from "./useNavigationState.js";
import Footer from "./Footer.jsx";
import Loading from "../../shared/components/Loading.jsx";
import { NotificationProvider } from "../../features/notifications/model/NotificationProvider.jsx";
import useAuth from "../../shared/auth/useAuth.js";
import ScrollManager from "./ScrollManager.jsx";
import AppBackground from "./AppBackground.jsx";
import { isAuthenticationRoute } from "./appBackgroundRoutes.js";
export default function AppLayout() {
  const location = useLocation();
  const { token } = useAuth();
  const navigation = useNavigationState();
  // Sign-in and recovery pages are focused tasks: no app sidebar or background.
  const authLayout = isAuthenticationRoute(location.pathname);
  const showAppBackground = !authLayout;
  const shellClass = [
    "app-shell",
    showAppBackground && "has-side-rays",
    authLayout && "is-auth-layout",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <NotificationProvider key={token || "anonymous"} enabled={Boolean(token)}>
      <div className={shellClass}>
        <a
          className="skip-link"
          href="#main-content"
          onClick={(event) => {
            // Move focus without a hash navigation, which the router would
            // treat as a page change and show the transition overlay.
            event.preventDefault();
            document.getElementById("main-content")?.focus();
          }}
        >
          Skip to main content
        </a>
        <ScrollManager />
        {showAppBackground && <AppBackground />}
        <Navbar
          onOpenMobile={authLayout ? undefined : navigation.openMobile}
          mobileOpen={navigation.mobileOpen}
        />
        {!authLayout && <SidebarNavigation {...navigation} />}
        <main className="page-main" id="main-content" tabIndex={-1}>
          <Suspense fallback={<Loading />}>
            <div className="page-route-transition" key={location.pathname}>
              <Outlet />
            </div>
          </Suspense>
        </main>
        <Footer />
      </div>
    </NotificationProvider>
  );
}
