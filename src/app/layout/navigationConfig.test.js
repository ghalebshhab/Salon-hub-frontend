import { describe, expect, it } from "vitest";
import { getNavigationSections } from "./navigationConfig.js";

function linksFor(options) {
  return getNavigationSections(options).flatMap((section) =>
    section.items.map((item) => item.to),
  );
}

describe("getNavigationSections", () => {
  it("keeps the public discovery section available to guests", () => {
    expect(
      linksFor({ loggedIn: false, isOwner: false, hasSalon: false }),
    ).toEqual(["/", "/community", "/hiring-posts"]);
  });

  it("adds authenticated activity and account destinations", () => {
    const links = linksFor({
      loggedIn: true,
      isOwner: false,
      hasSalon: false,
    });

    expect(links).toContain("/my-bookings");
    expect(links).toContain("/profile/career");
    expect(links).toContain("/account/security");
    expect(links).not.toContain("/owner/dashboard");
  });

  it("uses existing production routes for the owner workspace", () => {
    const links = linksFor({
      loggedIn: true,
      isOwner: true,
      hasSalon: true,
    });

    expect(links).toContain("/owner/dashboard");
    expect(links).toContain("/owner/my-salon/edit");
    expect(links).toContain("/owner/create-service");
    expect(links).toContain("/owner/create-hiring-post");
  });

  it("shows assigned appointments to employees only", () => {
    expect(
      linksFor({
        loggedIn: true,
        isOwner: false,
        hasSalon: false,
        isEmployee: true,
      }),
    ).toContain("/employee/bookings");
    // A user with a pending salon request is not an employee.
    expect(
      linksFor({ loggedIn: true, isOwner: false, hasSalon: true }),
    ).not.toContain("/employee/bookings");
  });
});
