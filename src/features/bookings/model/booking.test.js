import { expect, it } from "vitest";
import { canCancel, getStatusClass, getTodayDate } from "./booking.js";
it("uses local calendar fields for booking dates", () => {
  expect(getTodayDate(new Date(2026, 9, 10, 0, 5))).toBe("2026-10-10");
});
it("only permits pending and accepted bookings to be cancelled", () => {
  for (const status of ["PENDING", "ACCEPTED"])
    expect(canCancel({ status })).toBe(true);
  for (const status of ["COMPLETED", "REJECTED", "CANCELLED"])
    expect(canCancel({ status })).toBe(false);
  expect(getStatusClass("COMPLETED")).toBe("active-tag");
});
