import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import DashboardHeader from "./DashboardHeader.jsx";

const data = {
  profile: { firstName: "Rania" },
  salon: {
    salonId: 27,
    name: "Maison Rose Salon",
    state: "OPEN",
    closeTime: "20:00",
  },
};

function renderHeader(props = {}) {
  const onRangeChange = vi.fn();
  const onRefresh = vi.fn();
  render(
    <MemoryRouter>
      <DashboardHeader
        data={data}
        range="Last 7 days"
        onRangeChange={onRangeChange}
        onRefresh={onRefresh}
        refreshing={false}
        workspaceActions
        {...props}
      />
    </MemoryRouter>,
  );
  return { onRangeChange, onRefresh };
}

it("connects the v0 owner actions to real application routes", () => {
  renderHeader();

  expect(screen.getByRole("link", { name: "View public salon" }).getAttribute("href")).toBe("/salons/27");
  expect(screen.getByRole("link", { name: "Manage salon" }).getAttribute("href")).toBe("/owner/my-salon/edit");
  expect(screen.getByRole("link", { name: "Manage bookings" }).getAttribute("href")).toBe("/owner/bookings");
  expect(screen.getByRole("link", { name: "Open Maison Rose Salon workspace" }).getAttribute("href")).toBe("/owner/my-salon");
});

it("keeps the dashboard controls interactive", () => {
  const { onRangeChange, onRefresh } = renderHeader();

  fireEvent.change(screen.getByRole("combobox", { name: "Date range" }), {
    target: { value: "This month" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Refresh dashboard" }));

  expect(onRangeChange).toHaveBeenCalledWith("This month");
  expect(onRefresh).toHaveBeenCalledOnce();
});

it("keeps the approved prototype header unchanged without live workspace actions", () => {
  renderHeader({ workspaceActions: false });

  expect(screen.getByText("Salon workspace")).toBeDefined();
  expect(screen.getByRole("link", { name: "View salon" })).toBeDefined();
  expect(screen.queryByRole("link", { name: "View public salon" })).toBeNull();
  expect(screen.queryByRole("link", { name: "Manage bookings" })).toBeNull();
});
