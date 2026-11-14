import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import CommunityTabs from "./CommunityTabs.jsx";

function renderTabs(active, counts = { requests: 2, following: 5 }) {
  render(
    <MemoryRouter>
      <CommunityTabs active={active} counts={counts} />
    </MemoryRouter>,
  );
}

it("links every section to its own route", () => {
  renderTabs("feed");
  const hrefs = screen
    .getAllByRole("link")
    .map((link) => link.getAttribute("href"));
  expect(hrefs).toEqual([
    "/community",
    "/community/discover",
    "/community/requests",
    "/community/following",
  ]);
});

it("marks only the active section as the current page", () => {
  renderTabs("requests");
  const current = screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("aria-current") === "page");
  expect(current).toHaveLength(1);
  expect(current[0].getAttribute("href")).toBe("/community/requests");
});

it("announces counts in the accessible names", () => {
  renderTabs("feed");
  expect(screen.getByRole("link", { name: "Requests, 2" })).toBeDefined();
  expect(screen.getByRole("link", { name: "Following, 5" })).toBeDefined();
  expect(screen.getByRole("link", { name: "Discover people" })).toBeDefined();
});

it("omits counts while they are loading", () => {
  renderTabs("feed", { requests: null, following: null });
  expect(screen.getByRole("link", { name: "Requests" })).toBeDefined();
});
