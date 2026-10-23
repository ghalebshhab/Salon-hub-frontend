import { expect, it } from "vitest";
import {
  canCancel,
  getEligibleEmployees,
  getStatusClass,
  getTodayDate,
} from "./booking.js";

it("formats the local calendar date without a UTC shift", () => {
  expect(getTodayDate(new Date(2026, 9, 10, 0, 5))).toBe("2026-10-10");
});

it("maps completed bookings to the active status style", () => {
  expect(getStatusClass("COMPLETED")).toBe("active-tag");
});

it("only allows active bookings to be cancelled", () => {
  expect(canCancel({ status: "PENDING" })).toBe(true);
  expect(canCancel({ status: "ACCEPTED" })).toBe(true);
  expect(canCancel({ status: "COMPLETED" })).toBe(false);
});

it("selects employees qualified for every requested service", () => {
  const booking = {
    services: [{ id: 10 }, { serviceId: 20 }],
  };
  const employees = [
    { id: 1, serviceIds: [10, 20, 30] },
    { id: 2, serviceIds: [10] },
    { id: 3, serviceIds: [20, 10] },
  ];

  expect(getEligibleEmployees(booking, employees)).toEqual([
    employees[0],
    employees[2],
  ]);
});
