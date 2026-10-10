import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../shared/auth/useAuth.js";
export default function ProtectedRoute() {
  const { loggedIn } = useAuth();
  const location = useLocation();
  return loggedIn ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
}
