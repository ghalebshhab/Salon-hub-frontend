import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { getUserProfileApi } from "../api/authApi.js";
import { requireData } from "../../../shared/api/response.js";
import AuthContext from "../../../shared/auth/authContext.js";
import { getToken, subscribeAuth } from "../../../shared/auth/tokenStorage.js";

export default function AuthProvider({
  children,
  loadProfile = getUserProfileApi,
}) {
  const token = useSyncExternalStore(subscribeAuth, getToken, () => null);
  const [profileState, setProfileState] = useState({
    token: null,
    user: null,
    loading: false,
    error: null,
  });
  const refreshingRef = useRef(false);

  useEffect(() => {
    if (!token) return undefined;

    const controller = new AbortController();

    const refreshProfile = async ({ background = false } = {}) => {
      if (refreshingRef.current) return;
      refreshingRef.current = true;

      if (!background) {
        setProfileState((current) => ({
          token,
          user: current.token === token ? current.user : null,
          loading: true,
          error: null,
        }));
      }

      try {
        const response = await loadProfile({ signal: controller.signal });
        if (controller.signal.aborted) return;
        setProfileState({
          token,
          user: requireData(response, "Your account could not be loaded."),
          loading: false,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        setProfileState((current) => ({
          token,
          user: background && current.token === token ? current.user : null,
          loading: false,
          error,
        }));
      } finally {
        refreshingRef.current = false;
      }
    };

    refreshProfile();

    const refreshInBackground = () => refreshProfile({ background: true });
    const intervalId = window.setInterval(refreshInBackground, 30_000);
    window.addEventListener("focus", refreshInBackground);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshInBackground);
      refreshingRef.current = false;
    };
  }, [loadProfile, token]);

  const value = useMemo(() => {
    const current = profileState.token === token;
    const user = current ? profileState.user : null;
    const role = typeof user?.role === "string" ? user.role.toUpperCase() : null;
    return {
      token,
      loggedIn: Boolean(token),
      user,
      role,
      isOwner: role === "OWNER",
      profileLoading: Boolean(token) && (!current || profileState.loading),
      profileError: current ? profileState.error : null,
    };
  }, [profileState, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
