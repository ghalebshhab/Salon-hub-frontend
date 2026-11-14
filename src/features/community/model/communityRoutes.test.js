import { describe, expect, it } from "vitest";
import {
  COMMUNITY_ROUTES,
  COMMUNITY_SECTION_TARGETS,
  communitySectionFor,
} from "./communityRoutes.js";

describe("community routes", () => {
  it("uses addressable routes instead of URL fragments", () => {
    expect(
      Object.values(COMMUNITY_ROUTES).every((route) => !route.includes("#")),
    ).toBe(true);
  });

  it("maps every community workspace route to a visible section", () => {
    Object.values(COMMUNITY_ROUTES).forEach((route) => {
      expect(COMMUNITY_SECTION_TARGETS[route]?.id).toBeTruthy();
    });
  });

  it("shows exactly one workspace section per route", () => {
    expect(communitySectionFor("/community")).toBe("feed");
    expect(communitySectionFor("/community/new")).toBe("feed");
    expect(communitySectionFor("/community/discover")).toBe("discover");
    expect(communitySectionFor("/community/requests")).toBe("requests");
    expect(communitySectionFor("/community/following")).toBe("following");
  });
});
