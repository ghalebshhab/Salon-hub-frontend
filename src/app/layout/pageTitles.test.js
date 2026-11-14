import { expect, it } from "vitest";
import { pageTitleFor } from "./pageTitles.js";

it("names the section and page for known routes", () => {
  expect(pageTitleFor("/owner/services/12/edit")).toEqual({
    section: "Salon",
    title: "Edit service",
  });
  expect(pageTitleFor("/owner/services")).toEqual({
    section: "Salon",
    title: "Services",
  });
  expect(pageTitleFor("/salons/4/book")).toEqual({
    section: "Discover",
    title: "Book an appointment",
  });
  expect(pageTitleFor("/")).toEqual({ section: "Discover", title: "Home" });
});

it("returns null for routes without a header title", () => {
  expect(pageTitleFor("/login")).toBeNull();
  expect(pageTitleFor("/somewhere-else")).toBeNull();
});
