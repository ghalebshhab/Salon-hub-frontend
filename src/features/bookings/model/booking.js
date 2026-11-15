const STATUS_CLASSES = {
  ACCEPTED: "active-tag",
  IN_PROGRESS: "active-tag",
  PENDING: "pending-tag",
  COMPLETED: "active-tag",
  REJECTED: "inactive-tag",
  CANCELLED: "inactive-tag",
};
export const getStatusClass = (status) =>
  STATUS_CLASSES[status] || "pending-tag";

const STATUS_LABELS = {
  PENDING: "Waiting for the salon",
  ACCEPTED: "Confirmed",
  IN_PROGRESS: "In service",
  COMPLETED: "Completed",
  REJECTED: "Not accepted",
  CANCELLED: "Cancelled",
};
export const getStatusLabel = (status) => STATUS_LABELS[status] || status;

export const canCancel = (booking) =>
  ["PENDING", "ACCEPTED"].includes(booking.status);

/** Index in Confirmed → On the way → Arrived → In service → Done. */
export function liveStageIndex(tracking) {
  if (!tracking) return 0;
  if (tracking.status === "COMPLETED") return 4;
  if (tracking.status === "IN_PROGRESS") return 3;
  if (tracking.journeyStatus === "ARRIVED") return 2;
  if (tracking.journeyStatus === "ON_THE_WAY") return 1;
  return 0;
}

/** Confirmed or running appointments today, where live tracking is useful. */
export const isLiveToday = (booking, today = getTodayDate()) =>
  ["ACCEPTED", "IN_PROGRESS"].includes(booking.status) &&
  booking.bookingDate === today;

const UNAVAILABLE_MESSAGES = {
  TIME_OFF: "is on time off this day.",
  NOT_WORKING: "does not work on this day.",
  FULLY_BOOKED: "is fully booked this day.",
  BUSY: "has another appointment at this time.",
  NO_TIME_LEFT_TODAY: "has no time left today.",
  NO_QUALIFIED_EMPLOYEE: "cannot do every selected service.",
};

/** Plain sentence for why a day or an employee has no free time. */
export function describeUnavailable(reason, who = "The salon") {
  const message = UNAVAILABLE_MESSAGES[reason];
  if (!message) return `${who} has no free time this day.`;
  return `${who} ${message}`;
}

export function getTodayDate(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function getEarliestBookingTime(date = new Date()) {
  const earliest = new Date(date);
  earliest.setSeconds(0, 0);
  earliest.setMinutes(earliest.getMinutes() + 1);
  return `${String(earliest.getHours()).padStart(2, "0")}:${String(earliest.getMinutes()).padStart(2, "0")}`;
}

/** "14:30:00" or "14:30" → "14:30". */
export const toHourMinute = (value) => value?.toString().slice(0, 5) || "";

/** Parses "YYYY-MM-DD" as a local date (no time-zone shift). */
export function parseLocalDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** The next `count` days starting today, for the date strip. */
export function getUpcomingDays(count = 14, from = new Date()) {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      value: getTodayDate(date),
      weekday:
        index === 0
          ? "Today"
          : index === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-GB", { weekday: "short" }),
      day: date.getDate(),
      month: date.toLocaleDateString("en-GB", { month: "short" }),
    };
  });
}

export function formatDateLabel(value) {
  if (!value) return "";
  return parseLocalDate(value).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** "2026-11-15T14:35:00" → "14:35". */
export function formatClock(dateTime) {
  if (!dateTime) return "";
  const text = String(dateTime);
  const time = text.includes("T") ? text.split("T")[1] : text;
  return time.slice(0, 5);
}

const DAY_PARTS = [
  { key: "morning", label: "Morning", until: 12 },
  { key: "afternoon", label: "Afternoon", until: 17 },
  { key: "evening", label: "Evening", until: 24 },
];

/** Groups availability slots into morning, afternoon and evening. */
export function groupSlotsByDayPart(slots = []) {
  return DAY_PARTS.map((part, index) => {
    const from = index === 0 ? 0 : DAY_PARTS[index - 1].until;
    return {
      ...part,
      slots: slots.filter((slot) => {
        const hour = Number(toHourMinute(slot.time).slice(0, 2));
        return hour >= from && hour < part.until;
      }),
    };
  }).filter((part) => part.slots.length > 0);
}

export function formatDuration(minutes) {
  const value = Number(minutes) || 0;
  if (value < 60) return `${value} min`;
  const hours = Math.floor(value / 60);
  const rest = value % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export function formatDistance(meters) {
  if (meters == null) return "";
  return meters < 1000
    ? `${Math.round(meters / 10) * 10} m`
    : `${(meters / 1000).toFixed(1)} km`;
}

export function canEmployeePerformServices(employee, serviceIds) {
  if (!serviceIds.length) return true;
  const capabilities = new Set((employee.serviceIds || []).map(Number));
  return serviceIds.every((serviceId) => capabilities.has(Number(serviceId)));
}

export function getEligibleEmployees(booking, employees) {
  const serviceIds =
    booking.services?.map((service) => service.serviceId ?? service.id) || [];
  return employees.filter((employee) =>
    canEmployeePerformServices(employee, serviceIds),
  );
}
