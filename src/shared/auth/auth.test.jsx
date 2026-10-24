import { describe, expect, it } from "vitest";
import { saveToken, getToken, clearAuthData } from "./tokenStorage.js";

describe("authentication", () => {
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
