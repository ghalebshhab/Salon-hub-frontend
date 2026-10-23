import { useNavigate } from "react-router-dom";
import { clearAuthData } from "../../../shared/auth/tokenStorage.js";
import { logoutApi } from "../api/authApi.js";

export default function useLogout() {
  const navigate = useNavigate();

  return async function logout(onLoggedOut) {
    try {
      await logoutApi();
    } finally {
      clearAuthData();
      onLoggedOut?.();
      navigate("/login");
    }
  };
}
