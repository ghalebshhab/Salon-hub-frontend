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
  const showAppBackground = !isAuthenticationRoute(location.pathname);
  return (
    <NotificationProvider key={token || "anonymous"} enabled={Boolean(token)}>
      <div className={showAppBackground ? "app-shell has-side-rays" : "app-shell"}>
        <ScrollManager />
        {showAppBackground && <AppBackground />}
        <Navbar onOpenMobile={navigation.openMobile} />
        <SidebarNavigation {...navigation} />
        <main className="page-main">
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
