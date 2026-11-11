import { describe, expect, it } from "vitest";
import { isAuthenticationRoute } from "./appBackgroundRoutes.js";

describe("application background route policy", () => {
  it.each([
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/verify-reset-code",
    "/reset-password",
    "/auth-background-lab",
  ])("excludes Side Rays from %s", (pathname) => {
    expect(isAuthenticationRoute(pathname)).toBe(true);
  });

  it.each([
    "/",
    "/community",
    "/salons/4",
    "/owner/dashboard",
    "/account/security",
  ])("keeps Side Rays on %s", (pathname) => {
    expect(isAuthenticationRoute(pathname)).toBe(false);
  });
});
