import { describe, expect, it } from "vitest";
import {
  getInitials,
  getPostAuthorName,
  getRelationshipLabel,
  isVideoMedia,
  normalizeCommunitySearch,
} from "./communityPresentation.js";

describe("community presentation model", () => {
  it("creates stable initials without depending on React", () => {
    expect(getInitials("Maya Ali")).toBe("MA");
    expect(getInitials("SalonHub")).toBe("S");
    expect(getInitials()).toBe("SH");
  });

  it("prefers the salon identity for salon posts", () => {
    expect(
      getPostAuthorName({
        salon: { name: "Glow Salon" },
        author: { displayName: "Maya Ali", userName: "maya" },
      }),
    ).toBe("Glow Salon");
  });

  it("recognizes supported video URLs with query strings", () => {
    expect(isVideoMedia("https://cdn.example.com/work.mp4?v=2")).toBe(true);
    expect(isVideoMedia("https://cdn.example.com/work.jpg")).toBe(false);
  });

  it("maps relationship state to user-facing labels", () => {
    expect(getRelationshipLabel({ relationship: "ACCEPTED" })).toBe("Friend");
    expect(getRelationshipLabel({ incomingRequest: true })).toBe(
      "Requested you",
    );
    expect(getRelationshipLabel({ relationship: "PENDING" })).toBe("Pending");
  });

  it("normalizes people searches for case-insensitive matching", () => {
    expect(normalizeCommunitySearch("  Maya   ALI ")).toBe("maya ali");
  });
});
