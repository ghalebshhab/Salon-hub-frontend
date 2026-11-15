import { expect, it } from "vitest";
import {
  canCancel,
  describeUnavailable,
  formatClock,
  formatDistance,
  formatDuration,
  getEligibleEmployees,
  getStatusClass,
  getStatusLabel,
  getTodayDate,
  getUpcomingDays,
  groupSlotsByDayPart,
  isLiveToday,
} from "./booking.js";

it("groups slots into morning, afternoon and evening and drops empty parts", () => {
  const groups = groupSlotsByDayPart([
    { time: "09:00:00" },
    { time: "11:45:00" },
    { time: "18:30:00" },
  ]);
  expect(groups.map((group) => group.key)).toEqual(["morning", "evening"]);
  expect(groups[0].slots).toHaveLength(2);
});

it("lists fourteen upcoming days starting with today", () => {
  const days = getUpcomingDays(14, new Date(2026, 10, 15, 22, 0));
  expect(days).toHaveLength(14);
  expect(days[0]).toMatchObject({ value: "2026-11-15", weekday: "Today" });
  expect(days[1].weekday).toBe("Tomorrow");
  expect(days[13].value).toBe("2026-11-28");
});

it("explains why there is no free time", () => {
  expect(describeUnavailable("TIME_OFF", "Sara")).toBe(
    "Sara is on time off this day.",
  );
  expect(describeUnavailable("UNKNOWN")).toBe(
    "The salon has no free time this day.",
  );
});

it("formats durations, distances and clock times", () => {
  expect(formatDuration(45)).toBe("45 min");
  expect(formatDuration(90)).toBe("1 h 30 min");
  expect(formatDistance(340)).toBe("340 m");
  expect(formatDistance(6420)).toBe("6.4 km");
  expect(formatClock("2026-11-15T14:35:12")).toBe("14:35");
});

it("treats confirmed and running bookings of today as live", () => {
  expect(
    isLiveToday(
      { status: "IN_PROGRESS", bookingDate: "2026-11-15" },
      "2026-11-15",
    ),
  ).toBe(true);
  expect(
    isLiveToday(
      { status: "ACCEPTED", bookingDate: "2026-11-16" },
      "2026-11-15",
    ),
  ).toBe(false);
  expect(getStatusLabel("IN_PROGRESS")).toBe("In service");
});

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
