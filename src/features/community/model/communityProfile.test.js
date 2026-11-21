import { describe, expect, it } from "vitest";
import {
  getCommunityProfileRole,
  getCommunityProfileViewModel,
  getSalonRelationship,
  salonTenure,
} from "./communityProfile.js";

describe("community profile model", () => {
  it("maps backend roles to presentation details with a safe fallback", () => {
    expect(getCommunityProfileRole("owner").label).toBe("Founder & owner");
    expect(getCommunityProfileRole("Employee").label).toBe("Resident artist");
    expect(getCommunityProfileRole("Employee", { manager: true }).label).toBe(
      "Salon manager",
    );
    expect(getCommunityProfileRole("unknown").label).toBe("Salon explorer");
  });

  it("describes the member's relationship to their salon", () => {
    expect(getSalonRelationship("OWNER")).toBe("Founder & owner of");
    expect(getSalonRelationship("EMPLOYEE")).toBe("Resident artist at");
  });

  it("measures time at the salon in years and months", () => {
    const now = new Date(2026, 10, 21);
    expect(salonTenure("2026-03-02", now).length).toBe("8 months");
    expect(salonTenure("2025-08-01", now).length).toBe("1 year 3 months");
    expect(salonTenure("2026-11-05", now).length).toBe("New this month");
    expect(salonTenure(null, now)).toBeNull();
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
      salonRelationship: "Resident artist at",
      tenure: null,
    });
  });
});
