import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Loading from "../../shared/components/Loading.jsx";
export default function AppLayout() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <main className="page-main">
        <Suspense fallback={<Loading />}>
          <Outlet key={location.pathname} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
