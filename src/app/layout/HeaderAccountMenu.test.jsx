import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import HeaderAccountMenu from "./HeaderAccountMenu.jsx";

const links = [
  { to: "/profile/career", label: "Career profile" },
  { to: "/my-bookings", label: "My bookings" },
];

function renderMenu(onLogout = vi.fn()) {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <p>Outside</p>
      <HeaderAccountMenu initials="RA" links={links} onLogout={onLogout} />
    </MemoryRouter>,
  );
  return screen.getByRole("button", { name: "Open account menu" });
}

it("opens with focus on the first item and reports its state", () => {
  const avatar = renderMenu();
  expect(avatar.getAttribute("aria-expanded")).toBe("false");

  fireEvent.click(avatar);

  expect(avatar.getAttribute("aria-expanded")).toBe("true");
  expect(document.activeElement).toBe(
    screen.getByRole("link", { name: "Career profile" }),
  );
});

it("closes on Escape and returns focus to the avatar", () => {
  const avatar = renderMenu();
  fireEvent.click(avatar);

  fireEvent.keyDown(document, { key: "Escape" });

  expect(screen.queryByRole("link", { name: "My bookings" })).toBeNull();
  expect(document.activeElement).toBe(avatar);
});

it("closes when clicking outside", () => {
  const avatar = renderMenu();
  fireEvent.click(avatar);

  fireEvent.pointerDown(screen.getByText("Outside"));

  expect(screen.queryByRole("link", { name: "My bookings" })).toBeNull();
});

it("closes after navigating to an item", () => {
  const avatar = renderMenu();
  fireEvent.click(avatar);

  fireEvent.click(screen.getByRole("link", { name: "My bookings" }));

  expect(screen.queryByRole("link", { name: "Career profile" })).toBeNull();
  expect(avatar.getAttribute("aria-expanded")).toBe("false");
});

it("logs out from the menu", () => {
  const onLogout = vi.fn();
  fireEvent.click(renderMenu(onLogout));

  fireEvent.click(screen.getByRole("button", { name: "Log out" }));

  expect(onLogout).toHaveBeenCalledOnce();
});
