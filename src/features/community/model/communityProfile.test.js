import { describe, expect, it } from "vitest";
import {
  getCommunityProfileRole,
  getCommunityProfileViewModel,
  getSalonRelationship,
} from "./communityProfile.js";

describe("community profile model", () => {
  it("maps backend roles to presentation details with a safe fallback", () => {
    expect(getCommunityProfileRole("owner").label).toBe("Salon owner");
    expect(getCommunityProfileRole("unknown").label).toBe("Community member");
  });

  it("describes the member's relationship to their salon", () => {
    expect(getSalonRelationship("OWNER")).toBe("Owns and leads");
    expect(getSalonRelationship("EMPLOYEE")).toBe("Works at");
  });

  it("builds a stable page view model from API data", () => {
    const profile = {
      role: "EMPLOYEE",
      member: {
        user: { id: 7, userName: "maya", displayName: "Maya Ali" },
      },
    };

    expect(getCommunityProfileViewModel(profile, "7")).toMatchObject({
      displayName: "Maya Ali",
      firstName: "Maya",
      isSelf: true,
      salonRelationship: "Works at",
    });
  });
});
