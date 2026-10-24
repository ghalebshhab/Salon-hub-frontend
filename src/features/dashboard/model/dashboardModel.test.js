import { expect, it } from "vitest";
import { buildOwnerDashboard } from "./dashboardModel.js";

const raw = {
  profile: { firstName: "Maya" },
  salon: { salonId: 1, name: "Salon" },
  employees: [
    { id: 10, fullName: "Top Stylist", status: "ACTIVE", serviceNames: ["Cut"] },
    { id: 11, fullName: "New Stylist", status: "ACTIVE", serviceNames: ["Color"] },
  ],
  services: [
    { id: 1, name: "Cut", price: 20 },
    { id: 2, name: "Color", price: 40 },
  ],
  bookings: [
    {
      id: 100,
      customerId: 5,
      customerName: "Customer One",
      bookingDate: "2026-10-23",
      bookingTime: "10:00",
      status: "COMPLETED",
      assignedEmployeeId: 10,
      assignedEmployeeName: "Top Stylist",
      totalPrice: 60,
      services: [
        { id: 1, name: "Cut", price: 20 },
        { id: 2, name: "Color", price: 40 },
      ],
    },
    {
      id: 101,
      customerId: 6,
      customerName: "Customer Two",
      bookingDate: "2026-10-24",
      bookingTime: "11:00",
      status: "PENDING",
      totalPrice: 20,
      services: [{ id: 1, name: "Cut", price: 20 }],
    },
  ],
  reviews: [{ id: 1, bookingId: 100, customerName: "Customer One", rating: 5, createdAt: "2026-10-23T12:00:00" }],
  reviewSummary: { averageRating: 5, totalReviews: 1 },
};

it("derives owner metrics and ranks employees from booking and review data", () => {
  const result = buildOwnerDashboard(raw, "Last 7 days", new Date("2026-10-24T12:00:00"));
  expect(result.summary.revenue).toBe(60);
  expect(result.summary.completed).toBe(1);
  expect(result.summary.pending).toBe(1);
  expect(result.summary.customers).toBe(2);
  expect(result.employees[0].name).toBe("Top Stylist");
  expect(result.employees[0].rating).toBe(5);
  expect(result.bookings.find((booking) => booking.id === 100).rating).toBe(5);
  expect(result.services.find((service) => service.id === 2).revenue).toBe(40);
});
