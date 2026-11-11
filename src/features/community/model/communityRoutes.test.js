import { describe, expect, it } from "vitest";
import {
  COMMUNITY_ROUTES,
  COMMUNITY_SECTION_TARGETS,
} from "./communityRoutes.js";

describe("community routes", () => {
  it("uses addressable routes instead of URL fragments", () => {
    expect(Object.values(COMMUNITY_ROUTES).every((route) => !route.includes("#"))).toBe(true);
  });

  it("maps every community workspace route to a visible section", () => {
    Object.values(COMMUNITY_ROUTES).forEach((route) => {
      expect(COMMUNITY_SECTION_TARGETS[route]?.id).toBeTruthy();
    });
  });
});
