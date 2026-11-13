import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import Button from "./Button.jsx";

it("renders a non-submitting primary button by default", () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Save</Button>);

  const button = screen.getByRole("button", { name: "Save" });
  expect(button.getAttribute("type")).toBe("button");
  expect(button.className).toBe("btn btn-primary");
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledOnce();
});

it("maps variant, size, width and extra classes", () => {
  render(
    <Button
      variant="danger"
      size="sm"
      fullWidth
      className="extra"
      type="submit"
    >
      Disable
    </Button>,
  );

  const button = screen.getByRole("button", { name: "Disable" });
  expect(button.className).toBe("btn btn-danger btn-small full-width extra");
  expect(button.getAttribute("type")).toBe("submit");
});

it("falls back to primary for unknown variants", () => {
  render(<Button variant="ghost">Go</Button>);
  expect(screen.getByRole("button", { name: "Go" }).className).toBe(
    "btn btn-primary",
  );
});

it("renders a router link when given a destination", () => {
  render(
    <MemoryRouter>
      <Button variant="secondary" to="/owner/services" state={{ from: "x" }}>
        Back
      </Button>
    </MemoryRouter>,
  );

  const link = screen.getByRole("link", { name: "Back" });
  expect(link.getAttribute("href")).toBe("/owner/services");
  expect(link.className).toBe("btn btn-secondary");
  expect(link.getAttribute("type")).toBeNull();
});
