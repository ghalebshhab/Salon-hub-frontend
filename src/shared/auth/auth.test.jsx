import { describe, expect, it, vi } from "vitest";
import {
  clearAuthData,
  getSessionKey,
  isLoggedIn,
  subscribeAuth,
} from "./tokenStorage.js";
import { signInForTest } from "../../test/session.js";

describe("authentication", () => {
  it("keeps no token where page scripts can read it", () => {
    signInForTest();
    expect(isLoggedIn()).toBe(true);
    expect(localStorage.getItem("token")).toBeNull();
    expect(document.cookie).not.toContain("salonhub_session=");
    // The only readable cookie is the hint, and it holds no secret.
    expect(document.cookie).toContain("salonhub_auth=1");
  });

  it("forgets the session on sign-out", () => {
    signInForTest();
    clearAuthData();
    expect(isLoggedIn()).toBe(false);
    expect(getSessionKey()).toBeNull();
  });

  it("gives each sign-in a new session key and tells subscribers", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeAuth(listener);
    signInForTest();
    const first = getSessionKey();
    signInForTest();
    const second = getSessionKey();
    unsubscribe();

    expect(first).not.toBeNull();
    expect(second).not.toBe(first);
    expect(listener).toHaveBeenCalledTimes(2);
    clearAuthData();
  });
});
