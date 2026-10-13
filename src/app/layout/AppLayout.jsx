import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Loading from "../../shared/components/Loading.jsx";
import { NotificationProvider } from "../../features/notifications/model/NotificationProvider.jsx";
import useAuth from "../../shared/auth/useAuth.js";
export default function AppLayout() {
  const location = useLocation();
  const { token } = useAuth();
  return (
    <NotificationProvider key={token || "anonymous"} enabled={Boolean(token)}>
      <Navbar />
      <main className="page-main">
        <Suspense fallback={<Loading />}>
          <Outlet key={location.pathname} />
        </Suspense>
      </main>
      <Footer />
    </NotificationProvider>
  );
}
