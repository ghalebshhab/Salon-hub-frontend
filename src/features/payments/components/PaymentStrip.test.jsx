import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import PaymentStrip from "./PaymentStrip.jsx";

const unpaid = {
  method: "CASH",
  status: "UNPAID",
  amountFils: 19500,
  currency: "JOD",
  paidAt: null,
  receiptNumber: null,
  collectable: true,
};

it("shows nothing for bookings made before payments existed", () => {
  const { container } = render(<PaymentStrip payment={null} />);
  expect(container.innerHTML).toBe("");
});

it("lets staff record cash for a finished, unpaid booking", () => {
  const onCollect = vi.fn();
  render(<PaymentStrip payment={unpaid} canCollect onCollect={onCollect} />);

  expect(screen.getByText("19.500 JOD")).toBeDefined();
  expect(screen.getByText("Not paid yet")).toBeDefined();
  fireEvent.click(screen.getByRole("button", { name: /Cash received/ }));
  expect(onCollect).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("button", { name: /Receipt/ })).toBeNull();
});

it("never shows the cash action to the customer", () => {
  render(<PaymentStrip payment={unpaid} onReceipt={() => {}} />);
  expect(screen.queryByRole("button", { name: /Cash received/ })).toBeNull();
});

it("opens the receipt once the payment is received", () => {
  const onReceipt = vi.fn();
  render(
    <PaymentStrip
      payment={{
        ...unpaid,
        status: "PAID",
        collectable: false,
        receiptNumber: "SH-1-000004",
      }}
      canCollect
      onReceipt={onReceipt}
    />,
  );

  expect(screen.getByText("Paid")).toBeDefined();
  expect(screen.queryByRole("button", { name: /Cash received/ })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /Receipt/ }));
  expect(onReceipt).toHaveBeenCalledTimes(1);
});
