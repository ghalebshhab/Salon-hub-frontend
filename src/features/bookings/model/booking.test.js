import { expect, it } from "vitest";
import {
  canCancel,
  canMarkNoShow,
  describeUnavailable,
  formatDateRange,
  formatDeadline,
  formatTimeLeft,
  getAnswerDeadline,
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

it("labels expired and missed appointments and never offers to cancel them", () => {
  expect(getStatusLabel("EXPIRED")).toBe("Expired, no answer");
  expect(getStatusLabel("NO_SHOW")).toBe("Missed");
  expect(getStatusClass("EXPIRED")).toBe("inactive-tag");
  expect(canCancel({ status: "EXPIRED" })).toBe(false);
  expect(canCancel({ status: "NO_SHOW" })).toBe(false);
});

it("says the whole salon is closed, whoever was chosen", () => {
  expect(describeUnavailable("SALON_CLOSED", "Sara")).toBe(
    "The salon is closed this day.",
  );
});

it("gives the answer deadline of a pending request with urgency", () => {
  const now = new Date(2026, 10, 16, 10, 0);
  const booking = {
    status: "PENDING",
    responseDeadline: "2026-11-16T12:30:00",
  };

  const info = getAnswerDeadline(booking, now);
  expect(info.urgent).toBe(true);
  expect(info.overdue).toBe(false);
  expect(formatTimeLeft(info.msLeft)).toBe("2 h 30 min left");
  expect(formatDeadline(info.deadline, now)).toBe("today 12:30");

  const later = getAnswerDeadline(
    { ...booking, responseDeadline: "2026-11-17T09:15:00" },
    now,
  );
  expect(later.urgent).toBe(false);
  expect(formatDeadline(later.deadline, now)).toBe("tomorrow 09:15");

  expect(
    getAnswerDeadline({ ...booking, responseDeadline: "2026-11-16T09:00:00" }, now)
      .overdue,
  ).toBe(true);
  expect(getAnswerDeadline({ ...booking, status: "ACCEPTED" }, now)).toBeNull();
});

it("allows a no-show only fifteen minutes after a confirmed start", () => {
  const booking = {
    status: "ACCEPTED",
    bookingDate: "2026-11-16",
    bookingTime: "10:00:00",
  };
  expect(canMarkNoShow(booking, new Date(2026, 10, 16, 10, 14))).toBe(false);
  expect(canMarkNoShow(booking, new Date(2026, 10, 16, 10, 15))).toBe(true);
  expect(
    canMarkNoShow({ ...booking, status: "PENDING" }, new Date(2026, 10, 17)),
  ).toBe(false);
});

it("writes a closure as one day or a range", () => {
  expect(formatDateRange("2026-11-20", "2026-11-20")).toBe("Friday 20 November");
  expect(formatDateRange("2026-11-20", "2026-11-22")).toBe(
    "Friday 20 November – Sunday 22 November",
  );
});
