import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import Prototype from "./Prototype.jsx";

function renderPrototype() {
  return render(
    <MemoryRouter>
      <Prototype />
    </MemoryRouter>,
  );
}

it("keeps booking changes connected across owner and customer views", () => {
  renderPrototype();

  fireEvent.click(screen.getByRole("button", { name: "Salon owner" }));
  fireEvent.click(screen.getByRole("button", { name: "Booking requests" }));
  fireEvent.click(screen.getAllByRole("button", { name: "Accept" })[0]);

  fireEvent.click(screen.getByRole("button", { name: "Customer & candidate" }));
  fireEvent.click(screen.getByRole("button", { name: "My bookings" }));

  const booking = screen.getByText("Booking #2101").closest("article");
  expect(within(booking).getByText("ACCEPTED")).toBeDefined();
  expect(
    within(booking).getByText("Accepted. Please arrive five minutes early."),
  ).toBeDefined();
});

it("includes the approved owner dashboard in the prototype", () => {
  renderPrototype();
  fireEvent.click(screen.getByRole("button", { name: "Salon owner" }));
  fireEvent.click(screen.getByRole("button", { name: "Owner dashboard" }));
  expect(
    screen.getByRole("heading", { name: "Good morning, Rania" }),
  ).toBeDefined();
  expect(screen.getByText("Top performer")).toBeDefined();
  expect(screen.getByText("Customers who booked your salon")).toBeDefined();
});
