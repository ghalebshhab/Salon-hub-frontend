import t from "../../../shared/i18n/t.js";
import { serviceName } from "../../services/model/serviceText.js";
import { dateLocale } from "../../../shared/i18n/language.js";
const DAY_MS = 86_400_000;
const ACTIVE_STATUSES = new Set(["ACTIVE", "ACCEPTED"]);
/** Bookings the salon lost after the customer asked for them. */
const LOST_STATUSES = new Set(["CANCELLED", "NO_SHOW"]);
/** Hours shown on the "Today" chart when no booking falls outside them. */
const DAY_OPEN_HOUR = 9;
const DAY_CLOSE_HOUR = 21;

/** Date ranges the owner can pick. `key` goes in the URL, `label` on screen. */
export const DASHBOARD_RANGES = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "month", label: "This month" },
];
export const DEFAULT_RANGE = "Last 7 days";

const number = (value) => Number(value || 0);
const bookingStatus = (booking) =>
  String(booking.status || "PENDING").toUpperCase();
const bookingDate = (booking) =>
  new Date(`${booking.bookingDate}T${booking.bookingTime || "00:00"}`);
const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
const sum = (items, selector) =>
  items.reduce((total, item) => total + number(selector(item)), 0);
const newestFirst = (a, b) => bookingDate(b) - bookingDate(a);

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/** "YYYY-MM-DD" in local time. toISOString() uses UTC and moves the day. */
function toDateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function rangeDays(range) {
  if (range === "Today") return 1;
  if (range === "Last 30 days") return 30;
  return 7;
}

/**
 * Start (inclusive) and end (exclusive) of the selected period, or of the
 * period before it. "This month" compares with the same days of last month.
 */
export function periodBounds(range, now, previous = false) {
  const tomorrow = addDays(startOfDay(now), 1);
  if (range === "This month") {
    const day = now.getDate();
    if (!previous) {
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: tomorrow,
      };
    }
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    return {
      start,
      end: new Date(
        start.getFullYear(),
        start.getMonth(),
        Math.min(day, lastDay) + 1,
      ),
    };
  }
  const days = rangeDays(range);
  const end = previous ? addDays(tomorrow, -days) : tomorrow;
  return { start: addDays(end, -days), end };
}

/** How many days back, counted from today, the range reaches. */
export function rangeSpanDays(range, now = new Date()) {
  if (range === "This month") return now.getDate();
  return rangeDays(range);
}

/** True when the plan's history covers the range. No limit known means allowed. */
export function rangeAllowed(range, historyDays, now = new Date()) {
  return !historyDays || rangeSpanDays(range, now) <= historyDays;
}

/** Inclusive "YYYY-MM-DD" dates for the API, from exclusive-end bounds. */
const toApiDates = ({ start, end }) => ({
  from: toDateKey(start),
  to: toDateKey(addDays(end, -1)),
});

/** Query parameters for the dashboard bookings and the server totals. */
export function rangeRequest(range, now = new Date()) {
  const current = toApiDates(periodBounds(range, now));
  const previous = toApiDates(periodBounds(range, now, true));
  return {
    bookings: current,
    summary: {
      ...current,
      compareFrom: previous.from,
      compareTo: previous.to,
    },
  };
}

function inPeriod(bookings, { start, end }) {
  return bookings.filter((booking) => {
    const date = bookingDate(booking);
    return date >= start && date < end;
  });
}

function percentChange(current, previous) {
  if (!previous) return current ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function completed(bookings) {
  return bookings.filter((booking) => bookingStatus(booking) === "COMPLETED");
}

function serviceItems(booking) {
  return booking.services || [];
}

function lostRate(bookings) {
  if (!bookings.length) return 0;
  const lost = bookings.filter((booking) =>
    LOST_STATUSES.has(bookingStatus(booking)),
  ).length;
  return Math.round((lost / bookings.length) * 1000) / 10;
}

function buildEmployeePerformance(employees, bookings, reviews) {
  const reviewByBooking = new Map(
    reviews.map((review) => [Number(review.bookingId), review]),
  );
  const rows = employees.map((employee) => {
    const assigned = bookings.filter(
      (booking) => Number(booking.assignedEmployeeId) === Number(employee.id),
    );
    const completedBookings = completed(assigned);
    const ratings = completedBookings
      .map((booking) => reviewByBooking.get(Number(booking.id))?.rating)
      .filter(Boolean)
      .map(Number);
    return {
      id: employee.id,
      name: employee.fullName,
      initials: initials(employee.fullName),
      specialty: employee.specialty || t("Salon professional"),
      status: employee.status || "ACTIVE",
      bookings: completedBookings.length,
      assignedBookings: assigned.length,
      services: sum(
        completedBookings,
        (booking) => serviceItems(booking).length,
      ),
      rating: ratings.length
        ? sum(ratings, (rating) => rating) / ratings.length
        : null,
      ratingCount: ratings.length,
      revenue: sum(completedBookings, (booking) => booking.totalPrice),
      lastBooking: [...completedBookings].sort(newestFirst)[0],
      skills: employee.serviceNames || [],
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      imageUrl: employee.imageUrl,
    };
  });

  const maxima = {
    bookings: Math.max(1, ...rows.map((row) => row.bookings)),
    services: Math.max(1, ...rows.map((row) => row.services)),
    revenue: Math.max(1, ...rows.map((row) => row.revenue)),
  };
  return rows.map((row) => ({
    ...row,
    score: Math.round(
      ((row.bookings / maxima.bookings) * 0.35 +
        (row.services / maxima.services) * 0.25 +
        ((row.rating || 0) / 5) * 0.25 +
        (row.revenue / maxima.revenue) * 0.15) *
        100,
    ),
  }));
}

function buildServices(services, bookings) {
  const completedBookings = completed(bookings);
  const totalRevenue = sum(completedBookings, (booking) => booking.totalPrice);
  const matchesService = (service) => (item) =>
    Number(item.id ?? item.serviceId) === Number(service.id);
  return services
    .map((service) => {
      const isThis = matchesService(service);
      const matching = completedBookings.filter((booking) =>
        serviceItems(booking).some(isThis),
      );
      const revenue = sum(
        matching,
        (booking) => serviceItems(booking).find(isThis)?.price,
      );
      return {
        ...service,
        booked: bookings.filter((booking) => serviceItems(booking).some(isThis))
          .length,
        completed: matching.length,
        revenue,
        share: totalRevenue ? Math.round((revenue / totalRevenue) * 100) : 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

function buildCustomers(bookings) {
  const map = new Map();
  bookings.forEach((booking) => {
    const key =
      booking.customerId ??
      booking.customerEmail ??
      booking.customerPhoneNumber;
    const current = map.get(key) || {
      id: key,
      name: booking.customerName || t("Customer"),
      email: booking.customerEmail,
      phone: booking.customerPhoneNumber,
      bookings: [],
      spent: 0,
    };
    current.bookings.push(booking);
    if (bookingStatus(booking) === "COMPLETED")
      current.spent += number(booking.totalPrice);
    map.set(key, current);
  });
  return [...map.values()]
    .map((customer) => {
      const completedBookings = completed(customer.bookings);
      const last = [...customer.bookings].sort(newestFirst)[0];
      const serviceCounts = new Map();
      completedBookings
        .flatMap(serviceItems)
        .forEach((service) =>
          serviceCounts.set(
            serviceName(service),
            (serviceCounts.get(serviceName(service)) || 0) + 1,
          ),
        );
      const favoriteService =
        [...serviceCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
      return {
        ...customer,
        initials: initials(customer.name),
        completed: completedBookings.length,
        cancelled: customer.bookings.filter(
          (booking) => bookingStatus(booking) === "CANCELLED",
        ).length,
        averageValue: completedBookings.length
          ? customer.spent / completedBookings.length
          : 0,
        lastVisit: last?.bookingDate,
        favoriteService,
        preferredEmployee: last?.assignedEmployeeName || "—",
        type:
          completedBookings.length >= 4
            ? "Loyal"
            : completedBookings.length >= 2
              ? "Returning"
              : "New",
      };
    })
    .sort((a, b) => b.spent - a.spent);
}

const bucketOf = (bookings) => ({
  revenue: sum(completed(bookings), (booking) => booking.totalPrice),
  bookings: bookings.length,
});

/** "Today": one bar per hour. Other ranges: one bar per day of the period. */
function buildChart(bookings, range, bounds) {
  if (range === "Today") {
    const hours = bookings.map((booking) => bookingDate(booking).getHours());
    const first = Math.min(DAY_OPEN_HOUR, ...hours);
    const last = Math.max(DAY_CLOSE_HOUR, ...hours);
    return Array.from({ length: last - first + 1 }, (_, index) => {
      const hour = first + index;
      return {
        key: `h${hour}`,
        label: String(hour).padStart(2, "0"),
        fullLabel: `${String(hour).padStart(2, "0")}:00`,
        ...bucketOf(
          bookings.filter(
            (booking) => bookingDate(booking).getHours() === hour,
          ),
        ),
      };
    });
  }

  const days = Math.round((bounds.end - bounds.start) / DAY_MS);
  const short = days <= 7;
  return Array.from({ length: days }, (_, index) => {
    const date = addDays(bounds.start, index);
    const key = toDateKey(date);
    return {
      key,
      label: short
        ? date.toLocaleDateString(dateLocale(), { weekday: "short" })
        : String(date.getDate()),
      fullLabel: date.toLocaleDateString(dateLocale(), {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      ...bucketOf(bookings.filter((booking) => booking.bookingDate === key)),
    };
  });
}

/** Real events from the data, newest first: new requests and new reviews. */
function buildActivity(bookings, reviews, limit = 6) {
  const requests = bookings
    .filter((booking) => booking.createdAt)
    .map((booking) => ({
      id: `booking-${booking.id}`,
      type: "booking",
      at: booking.createdAt,
      status: bookingStatus(booking),
      title: t("Booking request from {value}", {
        value: booking.customerName || t("a customer"),
      }),
      text: t("{value} on {bookingDate} at {value2}", {
        value:
          serviceItems(booking).map(serviceName).join(", ") || t("Salon visit"),
        bookingDate: booking.bookingDate,
        value2: String(booking.bookingTime || "").slice(0, 5),
      }),
    }));
  const rated = reviews
    .filter((review) => review.createdAt)
    .map((review) => ({
      id: `review-${review.id}`,
      type: "review",
      at: review.createdAt,
      title: t("{value} gave {rating} stars", {
        value: review.customerName || t("A customer"),
        rating: review.rating,
      }),
      text: review.employeeName
        ? t("For a visit with {employeeName}.", {
            employeeName: review.employeeName,
          })
        : t("For a completed visit."),
    }));
  return [...requests, ...rated]
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, limit);
}

export function buildOwnerDashboard(raw, range, now = new Date()) {
  const ratingsByBooking = new Map(
    raw.reviews.map((review) => [
      Number(review.bookingId),
      Number(review.rating),
    ]),
  );
  const bounds = periodBounds(range, now);
  const currentBookings = inPeriod(raw.bookings, bounds)
    .map((booking) => ({
      ...booking,
      rating: ratingsByBooking.get(Number(booking.id)) || null,
    }))
    .sort(newestFirst);
  const previousBookings = inPeriod(
    raw.bookings,
    periodBounds(range, now, true),
  );
  const currentCompleted = completed(currentBookings);
  const previousCompleted = completed(previousBookings);
  const revenue = sum(currentCompleted, (booking) => booking.totalPrice);
  const previousRevenue = sum(
    previousCompleted,
    (booking) => booking.totalPrice,
  );
  const customers = buildCustomers(currentBookings);
  const employeePerformance = buildEmployeePerformance(
    raw.employees,
    currentBookings,
    raw.reviews,
  ).sort((a, b) => b.score - a.score);
  const bookingById = new Map(
    raw.bookings.map((booking) => [Number(booking.id), booking]),
  );
  const reviews = raw.reviews
    .map((review) => {
      const booking = bookingById.get(Number(review.bookingId));
      return {
        ...review,
        employeeName: booking?.assignedEmployeeName,
        serviceNames: serviceItems(booking || {}).map(serviceName),
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const lost = lostRate(currentBookings);
  const localSummary = {
    revenue,
    revenueChange: percentChange(revenue, previousRevenue),
    completed: currentCompleted.length,
    completedChange: percentChange(
      currentCompleted.length,
      previousCompleted.length,
    ),
    pending: currentBookings.filter(
      (booking) => bookingStatus(booking) === "PENDING",
    ).length,
    customers: customers.length,
    cancellation: lost,
    cancellationChange:
      Math.round((lost - lostRate(previousBookings)) * 10) / 10,
    averageValue: currentCompleted.length
      ? revenue / currentCompleted.length
      : 0,
  };
  const server = raw.summary;

  return {
    ...raw,
    bookings: currentBookings,
    employees: employeePerformance,
    customers,
    services: buildServices(raw.services, currentBookings),
    // "Today" is drawn per hour from the bookings; longer ranges per day from the server.
    dayData:
      server?.days && range !== "Today"
        ? serverChart(server.days)
        : buildChart(currentBookings, range, bounds),
    reviews,
    activity: buildActivity(raw.bookings, reviews),
    insights: server ? serverInsights(server) : null,
    summary: {
      ...(server ? serverSummary(server, localSummary) : localSummary),
      employees: raw.employees.filter((employee) =>
        ACTIVE_STATUSES.has(String(employee.status).toUpperCase()),
      ).length,
      rating: number(raw.reviewSummary.averageRating),
      ratingCount: number(raw.reviewSummary.totalReviews),
    },
  };
}

/** KPI values from the server totals, in the shape the cards use. */
function serverSummary({ current, previous, customers }, local) {
  return {
    revenue: number(current.revenue),
    revenueChange: percentChange(
      number(current.revenue),
      number(previous.revenue),
    ),
    completed: current.completed,
    completedChange: percentChange(current.completed, previous.completed),
    pending: current.pending,
    // Without advanced analytics the server does not count customers.
    customers: customers ? customers.unique : local.customers,
    cancellation: current.lostRate,
    cancellationChange:
      Math.round((current.lostRate - previous.lostRate) * 10) / 10,
    averageValue: number(current.averageValue),
  };
}

function serverChart(days) {
  const short = days.length <= 7;
  return days.map((day) => {
    const date = new Date(`${day.date}T00:00`);
    return {
      key: day.date,
      label: short
        ? date.toLocaleDateString(dateLocale(), { weekday: "short" })
        : String(date.getDate()),
      fullLabel: date.toLocaleDateString(dateLocale(), {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      revenue: number(day.revenue),
      bookings: number(day.bookings),
    };
  });
}

/**
 * Numbers only the server can count: history, payments and busy hours.
 * `advanced` is false when the salon's plan has no advanced analytics; then
 * returning customers, payments and busy hours are not sent.
 */
function serverInsights({
  current,
  previous,
  customers,
  payments,
  busyHours,
  currency,
  historyDays,
  advancedAnalytics,
}) {
  const advanced = advancedAnalytics !== false;
  return {
    advanced,
    historyDays: historyDays || null,
    noShowRate: current.noShowRate,
    noShowChange:
      Math.round((current.noShowRate - previous.noShowRate) * 10) / 10,
    noShows: current.noShow,
    returning: advanced && customers ? customers.returning : null,
    returningRate: advanced && customers ? customers.returningRate : null,
    payments: advanced ? payments : null,
    currency,
    busyHours: busyHours || [],
  };
}

export { bookingStatus, initials };
