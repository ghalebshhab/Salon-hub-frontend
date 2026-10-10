import { useSyncExternalStore } from "react";
import { getToken, subscribeAuth } from "./tokenStorage.js";
export default function useAuth() {
  const token = useSyncExternalStore(subscribeAuth, getToken, () => null);
  return { token, loggedIn: Boolean(token) };
}
