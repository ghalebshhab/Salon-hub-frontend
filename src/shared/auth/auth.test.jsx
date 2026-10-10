import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useAuth from "./useAuth.js";
import { saveToken, saveUser, getUser, clearAuthData } from "./tokenStorage.js";
describe("authentication", () => {
  it("updates subscribers on login and logout without navigation", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loggedIn).toBe(false);
    act(() => saveToken("test-token"));
    expect(result.current.loggedIn).toBe(true);
    act(() => clearAuthData());
    expect(result.current.loggedIn).toBe(false);
  });
  it("observes signout in another tab", () => {
    saveToken("test-token");
    const { result } = renderHook(() => useAuth());
    act(() => {
      localStorage.removeItem("token");
      window.dispatchEvent(new StorageEvent("storage", { key: "token" }));
    });
    expect(result.current.loggedIn).toBe(false);
  });
  it("handles corrupt user storage and rejects missing tokens", () => {
    localStorage.setItem("user", "broken JSON");
    expect(getUser()).toBeNull();
    expect(() => saveToken(undefined)).toThrow("Invalid authentication token");
    saveUser({ id: 1 });
    expect(getUser()).toEqual({ id: 1 });
  });
});
