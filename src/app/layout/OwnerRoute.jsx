import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../shared/auth/useAuth.js";
import RouteSkeleton from "../routes/routeSkeletons.jsx";
import ErrorPage from "../../shared/components/ErrorPage.jsx";

export default function OwnerRoute() {
  const { loggedIn, isOwner, profileLoading } = useAuth();
  const location = useLocation();

  if (!loggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (profileLoading) return <RouteSkeleton />;
  return isOwner ? <Outlet /> : <ErrorPage kind="forbidden" />;
}
