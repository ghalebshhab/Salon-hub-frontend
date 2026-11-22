import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../shared/auth/useAuth.js";
import RouteSkeleton from "../routes/routeSkeletons.jsx";
import ErrorPage from "../../shared/components/ErrorPage.jsx";

/**
 * Pages for the salon's daily work: bookings and the team's schedules. The
 * owner and a salon manager (Business plan) can open them; the server
 * checks the same rule.
 */
export default function SalonManagerRoute() {
  const { loggedIn, isOwner, isManager, profileLoading } = useAuth();
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
  return isOwner || isManager ? <Outlet /> : <ErrorPage kind="forbidden" />;
}
