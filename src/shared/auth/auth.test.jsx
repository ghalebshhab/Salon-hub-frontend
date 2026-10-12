import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useAuth from "./useAuth.js";
import { saveToken, getToken, clearAuthData } from "./tokenStorage.js";
describe("authentication", () => {
  it("updates subscribers on login and logout without navigation", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loggedIn).toBe(false);
    act(() => saveToken("test-token"));
    expect(result.current.loggedIn).toBe(true);
    act(() => clearAuthData());
    expect(result.current.loggedIn).toBe(false);
  });
  it("stores the session in a cookie rather than browser storage", () => {
    saveToken("test-token");
    expect(getToken()).toBe("test-token");
    expect(document.cookie).toContain("salonhub_session=test-token");
    expect(localStorage.getItem("token")).toBeNull();
    clearAuthData();
    expect(getToken()).toBeNull();
  });
  it("rejects missing tokens", () => {
    expect(() => saveToken(undefined)).toThrow("Invalid authentication token");
  });
});
