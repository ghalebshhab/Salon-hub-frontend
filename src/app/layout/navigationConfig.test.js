import { expect, it } from "vitest";
import { getNavigationSections } from "./navigationConfig.js";

function labelsFor(options) {
  return getNavigationSections(options).map(({ label }) => label);
}

it("shows only discovery navigation to guests", () => {
  expect(
    labelsFor({ loggedIn: false, user: null, isOwner: false }),
  ).toEqual(["Discover"]);
});

it("adds employee operations without exposing owner management", () => {
  const labels = labelsFor({
    loggedIn: true,
    user: { salonId: 8 },
    isOwner: false,
  });

  expect(labels).toContain("Employee");
  expect(labels).not.toContain("Owner overview");
  expect(labels).not.toContain("Salon management");
});

it("groups every owner operation into focused sections", () => {
  expect(
    labelsFor({
      loggedIn: true,
      user: { ownedSalonId: 4 },
      isOwner: true,
    }),
  ).toEqual([
    "Discover",
    "My activity",
    "Career",
    "Owner overview",
    "Salon management",
    "Create & update",
    "Account",
  ]);
});
