import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import PaymentMethodPicker from "./PaymentMethodPicker.jsx";

it("offers cash and keeps card methods locked until a provider exists", () => {
  const onChange = vi.fn();
  render(
    <PaymentMethodPicker
      methods={["CASH"]}
      value="CASH"
      onChange={onChange}
      totalFils={19500}
      freeCancelHours={24}
    />,
  );

  expect(screen.getByText("19.500 JOD")).toBeDefined();
  expect(screen.getByRole("radio", { name: /Cash at the salon/ }).checked).toBe(
    true,
  );
  const cardNow = screen.getByRole("radio", { name: /Card now/ });
  expect(cardNow.disabled).toBe(true);
  expect(screen.getAllByText("Coming soon")).toHaveLength(2);
  expect(screen.getByText(/Free cancellation until 24 hours/)).toBeDefined();

  fireEvent.click(cardNow);
  expect(onChange).not.toHaveBeenCalled();
});

it("lets the customer pick a card method when the salon accepts it", () => {
  const onChange = vi.fn();
  render(
    <PaymentMethodPicker
      methods={["CASH", "CARD_POSTPAID"]}
      value="CASH"
      onChange={onChange}
      totalFils={10000}
    />,
  );

  fireEvent.click(screen.getByRole("radio", { name: /Card after the service/ }));
  expect(onChange).toHaveBeenCalledWith("CARD_POSTPAID");
});
