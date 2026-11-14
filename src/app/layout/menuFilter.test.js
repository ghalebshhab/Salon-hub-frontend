import { expect, it } from "vitest";
import { filterNavigationSections } from "./menuFilter.js";

const sections = [
  {
    label: "Discover",
    items: [
      { label: "Home", to: "/" },
      { label: "Career opportunities", to: "/hiring-posts" },
    ],
  },
  {
    label: "Salon",
    items: [
      { label: "Booking requests", to: "/owner/bookings" },
      { label: "Services", to: "/owner/services" },
    ],
    actions: [{ label: "New service", to: "/owner/create-service" }],
  },
];

it("keeps every section for an empty query", () => {
  expect(filterNavigationSections(sections, "  ")).toBe(sections);
});

it("keeps only matching items and drops empty sections", () => {
  const result = filterNavigationSections(sections, "SER");
  expect(result.map((section) => section.label)).toEqual(["Salon"]);
  expect(result[0].items).toEqual([
    { label: "Services", to: "/owner/services", ranges: [[0, 3]] },
  ]);
});

it("matches the start of any word in a label", () => {
  const result = filterNavigationSections(sections, "opp");
  expect(result[0].items.map((item) => item.to)).toEqual(["/hiring-posts"]);
});
