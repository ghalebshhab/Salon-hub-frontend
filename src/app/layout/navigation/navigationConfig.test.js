import { expect, it } from "vitest";
import { ownerActions, ownerLinks } from "./navigationConfig.js";

it("lists every salon owner workspace destination", () => {
  expect(ownerLinks.map(({ to }) => to)).toEqual([
    "/owner/dashboard",
    "/owner/my-salon",
    "/owner/bookings",
    "/owner/services",
    "/owner/employees",
    "/owner/employment",
    "/owner/applications",
  ]);
  expect(ownerActions.map(({ to }) => to)).toEqual([
    "/owner/my-salon/edit",
    "/owner/create-service",
    "/owner/create-hiring-post",
  ]);
});
