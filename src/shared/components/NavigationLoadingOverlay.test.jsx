import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import NavigationLoadingOverlay from "./NavigationLoadingOverlay.jsx";
import { navigationMessageFor } from "../loading/navigationLoading.js";

function NavigationHarness() {
  const navigate = useNavigate();
  return (
    <>
      <button type="button" onClick={() => navigate("/owner/dashboard")}>
        Open dashboard
      </button>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/owner/dashboard" element={<h1>Dashboard</h1>} />
      </Routes>
      <NavigationLoadingOverlay />
    </>
  );
}

afterEach(() => vi.useRealTimers());

it("shows the main logo after every router navigation", () => {
  vi.useFakeTimers();
  const { container } = render(
    <MemoryRouter initialEntries={["/"]}>
      <NavigationHarness />
    </MemoryRouter>,
  );

  expect(screen.queryByRole("status")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Open dashboard" }));

  expect(
    screen.getByRole("status", { name: "Opening your salon dashboard…" }),
  ).toBeDefined();
  expect(container.querySelector('img[src="/salonhub-mark.svg"]')).not.toBeNull();

  act(() => vi.advanceTimersByTime(651));
  expect(screen.queryByRole("status")).toBeNull();
});

it("provides a meaningful message for known and unknown destinations", () => {
  expect(navigationMessageFor("/my-bookings")).toBe(
    "Opening your bookings…",
  );
  expect(navigationMessageFor("/somewhere-new")).toBe("Opening the page…");
});
