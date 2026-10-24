const DAY_MS = 86_400_000;
const ACTIVE_STATUSES = new Set(["ACTIVE", "ACCEPTED"]);

const number = (value) => Number(value || 0);
const bookingStatus = (booking) => String(booking.status || "PENDING").toUpperCase();
const bookingDate = (booking) => new Date(`${booking.bookingDate}T${booking.bookingTime || "00:00"}`);
const initials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
const sum = (items, selector) => items.reduce((total, item) => total + number(selector(item)), 0);

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function rangeDays(range, now) {
  if (range === "Today") return 1;
  if (range === "Last 30 days") return 30;
  if (range === "This month") return Math.max(1, now.getDate());
  return 7;
}

function inPeriod(bookings, range, now, offset = 0) {
  const days = rangeDays(range, now);
  const end = new Date(startOfDay(now).getTime() - offset * days * DAY_MS + DAY_MS);
  const start = new Date(end.getTime() - days * DAY_MS);
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

function buildEmployeePerformance(employees, bookings, reviews) {
  const reviewByBooking = new Map(reviews.map((review) => [Number(review.bookingId), review]));
  const rows = employees.map((employee) => {
    const assigned = bookings.filter((booking) => Number(booking.assignedEmployeeId) === Number(employee.id));
    const completedBookings = completed(assigned);
    const ratings = completedBookings.map((booking) => reviewByBooking.get(Number(booking.id))?.rating).filter(Boolean).map(Number);
    return {
      id: employee.id,
      name: employee.fullName,
      initials: initials(employee.fullName),
      specialty: employee.specialty || "Salon professional",
      status: employee.status || "ACTIVE",
      bookings: completedBookings.length,
      assignedBookings: assigned.length,
      services: sum(completedBookings, (booking) => serviceItems(booking).length),
      rating: ratings.length ? sum(ratings, (rating) => rating) / ratings.length : null,
      ratingCount: ratings.length,
      revenue: sum(completedBookings, (booking) => booking.totalPrice),
      utilization: assigned.length ? Math.round((completedBookings.length / assigned.length) * 100) : 0,
      lastBooking: completedBookings.sort((a, b) => bookingDate(b) - bookingDate(a))[0],
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
  return services.map((service) => {
    const matching = completedBookings.filter((booking) =>
      serviceItems(booking).some((item) => Number(item.id ?? item.serviceId) === Number(service.id)),
    );
    const revenue = sum(matching, (booking) =>
      serviceItems(booking).find((item) => Number(item.id ?? item.serviceId) === Number(service.id))?.price,
    );
    return {
      ...service,
      booked: bookings.filter((booking) => serviceItems(booking).some((item) => Number(item.id ?? item.serviceId) === Number(service.id))).length,
      completed: matching.length,
      revenue,
      share: totalRevenue ? Math.round((revenue / totalRevenue) * 100) : 0,
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

function buildCustomers(bookings) {
  const map = new Map();
  bookings.forEach((booking) => {
    const key = booking.customerId ?? booking.customerEmail ?? booking.customerPhoneNumber;
    const current = map.get(key) || { id: key, name: booking.customerName || "Customer", email: booking.customerEmail, phone: booking.customerPhoneNumber, bookings: [], spent: 0 };
    current.bookings.push(booking);
    if (bookingStatus(booking) === "COMPLETED") current.spent += number(booking.totalPrice);
    map.set(key, current);
  });
  return [...map.values()].map((customer) => {
    const completedBookings = completed(customer.bookings);
    const last = [...customer.bookings].sort((a, b) => bookingDate(b) - bookingDate(a))[0];
    const serviceCounts = new Map();
    completedBookings.flatMap(serviceItems).forEach((service) => serviceCounts.set(service.name, (serviceCounts.get(service.name) || 0) + 1));
    const favoriteService = [...serviceCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    return {
      ...customer,
      initials: initials(customer.name),
      completed: completedBookings.length,
      cancelled: customer.bookings.filter((booking) => bookingStatus(booking) === "CANCELLED").length,
      averageValue: completedBookings.length ? customer.spent / completedBookings.length : 0,
      lastVisit: last?.bookingDate,
      favoriteService,
      preferredEmployee: last?.assignedEmployeeName || "—",
      type: completedBookings.length >= 4 ? "Loyal" : completedBookings.length >= 2 ? "Returning" : "New",
    };
  }).sort((a, b) => b.spent - a.spent);
}

function buildChart(bookings, now) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfDay(now).getTime() - (6 - index) * DAY_MS);
    const key = date.toISOString().slice(0, 10);
    const matches = bookings.filter((booking) => booking.bookingDate === key);
    return {
      label: date.toLocaleDateString("en", { weekday: "short" }),
      revenue: sum(completed(matches), (booking) => booking.totalPrice),
      bookings: matches.length,
    };
  });
}

export function buildOwnerDashboard(raw, range, now = new Date()) {
  const ratingsByBooking = new Map(
    raw.reviews.map((review) => [Number(review.bookingId), Number(review.rating)]),
  );
  const currentBookings = inPeriod(raw.bookings, range, now).map((booking) => ({
    ...booking,
    rating: ratingsByBooking.get(Number(booking.id)) || null,
  }));
  const previousBookings = inPeriod(raw.bookings, range, now, 1);
  const currentCompleted = completed(currentBookings);
  const previousCompleted = completed(previousBookings);
  const revenue = sum(currentCompleted, (booking) => booking.totalPrice);
  const previousRevenue = sum(previousCompleted, (booking) => booking.totalPrice);
  const customers = buildCustomers(currentBookings);
  const employeePerformance = buildEmployeePerformance(raw.employees, currentBookings, raw.reviews).sort((a, b) => b.score - a.score);
  const reviewByBooking = new Map(raw.bookings.map((booking) => [Number(booking.id), booking]));

  return {
    ...raw,
    bookings: currentBookings,
    employees: employeePerformance,
    customers,
    services: buildServices(raw.services, currentBookings),
    dayData: buildChart(raw.bookings, now),
    reviews: raw.reviews.map((review) => {
      const booking = reviewByBooking.get(Number(review.bookingId));
      return { ...review, employeeName: booking?.assignedEmployeeName, serviceNames: serviceItems(booking || {}).map((service) => service.name) };
    }),
    summary: {
      revenue,
      revenueChange: percentChange(revenue, previousRevenue),
      completed: currentCompleted.length,
      completedChange: percentChange(currentCompleted.length, previousCompleted.length),
      pending: currentBookings.filter((booking) => bookingStatus(booking) === "PENDING").length,
      employees: raw.employees.filter((employee) => ACTIVE_STATUSES.has(String(employee.status).toUpperCase())).length,
      customers: customers.length,
      rating: number(raw.reviewSummary.averageRating),
      ratingCount: number(raw.reviewSummary.totalReviews),
      cancellation: currentBookings.length ? Math.round((currentBookings.filter((booking) => bookingStatus(booking) === "CANCELLED").length / currentBookings.length) * 1000) / 10 : 0,
      averageValue: currentCompleted.length ? revenue / currentCompleted.length : 0,
    },
  };
}

export { bookingStatus, initials };
