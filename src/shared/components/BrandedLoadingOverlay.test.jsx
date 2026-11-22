import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import BrandedLoadingOverlay from "./BrandedLoadingOverlay.jsx";

it("shows a branded and accessible loading state", () => {
  const { container } = render(
    <BrandedLoadingOverlay visible message="Signing you in…" />,
  );

  expect(screen.getByRole("status", { name: "Signing you in…" })).toBeDefined();
  expect(container.querySelector("svg.salon-loading-logo")).not.toBeNull();
});

it("uses the main logo for navigation loading", () => {
  const { container } = render(
    <BrandedLoadingOverlay
      visible
      variant="navigation"
      message="Opening your dashboard…"
    />,
  );

  expect(container.querySelector("svg.salon-loading-logo")).not.toBeNull();
  expect(container.querySelector(".salon-loading-navigation")).not.toBeNull();
});

it("does not block the page when loading is inactive", () => {
  const { container } = render(<BrandedLoadingOverlay visible={false} />);
  expect(container.firstChild).toBeNull();
});
