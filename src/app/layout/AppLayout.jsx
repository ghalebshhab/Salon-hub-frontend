import { Suspense, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import SidebarNavigation from "./SidebarNavigation.jsx";
import useNavigationState from "./useNavigationState.js";
import Footer from "./Footer.jsx";
import RouteSkeleton from "../routes/routeSkeletons.jsx";
import ErrorBoundary from "../../shared/components/ErrorBoundary.jsx";
import { NotificationProvider } from "../../features/notifications/model/NotificationProvider.jsx";
import useAuth from "../../shared/auth/useAuth.js";
import ScrollManager from "./ScrollManager.jsx";
import CommandPalette from "../search/CommandPalette.jsx";
import AppBackground from "./AppBackground.jsx";
import { isAuthenticationRoute } from "./appBackgroundRoutes.js";
import { getSearchPages } from "../search/searchCatalog.js";
import AssistantProvider from "../../features/assistant/providers/AssistantProvider.jsx";
import AssistantDock from "../../features/assistant/components/AssistantDock.jsx";
import { ASSISTANT_PATH } from "../../features/assistant/model/assistantRoutes.js";
import t from "../../shared/i18n/t.js";
import useSmoothWheel from "../../shared/hooks/useSmoothWheel.js";
export default function AppLayout() {
  const location = useLocation();
  const { token, loggedIn, isOwner, isManager, role, user } = useAuth();
  const navigation = useNavigationState();
  // Soft, eased mouse-wheel scrolling on every page (touch and reduced motion keep native scrolling).
  useSmoothWheel();
  // Sign-in and recovery pages are focused tasks: no app sidebar or background.
  const authLayout = isAuthenticationRoute(location.pathname);
  const showAppBackground = !authLayout;
  const shellClass = [
    "app-shell",
    showAppBackground && "has-backdrop",
    authLayout && "is-auth-layout",
  ]
    .filter(Boolean)
    .join(" ");
  // Pages Lamsa may suggest: the same list the search palette uses.
  const assistantPages = useMemo(
    () =>
      getSearchPages({
        loggedIn,
        isOwner,
        hasSalon: Boolean(user?.ownedSalonId),
        isEmployee: role === "EMPLOYEE",
        isManager,
      }),
    [loggedIn, isOwner, isManager, role, user?.ownedSalonId],
  );
  const showAssistantDock =
    !authLayout && !location.pathname.startsWith(ASSISTANT_PATH);
  return (
    <NotificationProvider key={token || "anonymous"} enabled={Boolean(token)}>
      <AssistantProvider userId={user?.id} pages={assistantPages}>
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
            {t("Skip to main content")}
          </a>
          <ScrollManager />
          {showAppBackground && <AppBackground />}
          <Navbar
            onOpenMobile={authLayout ? undefined : navigation.openMobile}
            mobileOpen={navigation.mobileOpen}
            showAuthActions={!authLayout}
          />
          {!authLayout && <SidebarNavigation {...navigation} />}
          <main className="page-main" id="main-content" tabIndex={-1}>
            <ErrorBoundary resetKey={location.pathname}>
              <Suspense fallback={<RouteSkeleton />}>
                <div className="page-route-transition" key={location.pathname}>
                  <Outlet />
                </div>
              </Suspense>
            </ErrorBoundary>
          </main>
          <Footer />
          <CommandPalette />
          {showAssistantDock && <AssistantDock />}
        </div>
      </AssistantProvider>
    </NotificationProvider>
  );
}
