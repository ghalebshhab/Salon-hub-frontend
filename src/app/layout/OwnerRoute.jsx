import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../shared/auth/useAuth.js";
import Loading from "../../shared/components/Loading.jsx";

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

  if (profileLoading) return <Loading />;
  return isOwner ? <Outlet /> : <Navigate to="/" replace />;
}
