import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Loading from "../../shared/components/Loading.jsx";
import { NotificationProvider } from "../../features/notifications/model/NotificationProvider.jsx";
import useAuth from "../../shared/auth/useAuth.js";
import ScrollManager from "./ScrollManager.jsx";
export default function AppLayout() {
  const location = useLocation();
  const { token } = useAuth();
  return (
    <NotificationProvider key={token || "anonymous"} enabled={Boolean(token)}>
      <ScrollManager />
      <Navbar />
      <main className="page-main">
        <Suspense fallback={<Loading />}>
          <div className="page-route-transition" key={location.pathname}>
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
    </NotificationProvider>
  );
}
