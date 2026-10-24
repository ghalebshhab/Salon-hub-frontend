import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { getUserProfileApi } from "../api/authApi.js";
import { requireData } from "../../../shared/api/response.js";
import AuthContext from "../../../shared/auth/authContext.js";
import { getToken, subscribeAuth } from "../../../shared/auth/tokenStorage.js";

export default function AuthProvider({ children, loadProfile = getUserProfileApi }) {
  const token = useSyncExternalStore(subscribeAuth, getToken, () => null);
  const [profileState, setProfileState] = useState({
    token: null,
    user: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!token) return undefined;

    const controller = new AbortController();

    loadProfile({ signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return;
        setProfileState({
          token,
          user: requireData(response, "Your account could not be loaded."),
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setProfileState({ token, user: null, loading: false, error });
      });

    return () => controller.abort();
  }, [loadProfile, token]);

  const value = useMemo(() => {
    const current = profileState.token === token;
    const user = current ? profileState.user : null;
    return {
      token,
      loggedIn: Boolean(token),
      user,
      role: user?.role || null,
      isOwner: user?.role === "OWNER",
      profileLoading: Boolean(token) &&
        (!current || profileState.loading),
      profileError: current ? profileState.error : null,
    };
  }, [profileState, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
