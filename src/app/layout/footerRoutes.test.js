import { expect, it } from "vitest";
import { isWorkspaceRoute } from "./footerRoutes.js";

it("uses the slim footer on signed-in work screens", () => {
  for (const path of [
    "/owner/dashboard",
    "/owner/services/3/edit",
    "/employee/bookings",
    "/my-bookings",
    "/notifications",
    "/profile/career",
    "/account/security",
    "/employment",
    "/salons/7/book",
  ]) {
    expect(isWorkspaceRoute(path)).toBe(true);
  }
});

it("keeps the full footer on public pages", () => {
  for (const path of ["/", "/salons/7", "/community", "/hiring-posts"]) {
    expect(isWorkspaceRoute(path)).toBe(false);
  }
});
