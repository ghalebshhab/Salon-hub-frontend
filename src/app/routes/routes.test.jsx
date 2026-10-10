import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes.jsx";
import { clearAuthData, saveToken } from "../../shared/auth/tokenStorage.js";
import http from "../../shared/api/httpClient.js";
const salon = {
  salonId: 1,
  name: "Test Salon",
  city: "Amman",
  state: "OPEN",
  Images: [],
  maxNumOfEmployees: 3,
};
const service = {
  id: 1,
  name: "Haircut",
  price: 10,
  durationMinutes: 30,
  isActive: true,
};
beforeEach(() => {
  http.defaults.adapter = vi.fn(async (config) => {
    const url = config.url;
    let data = [];
    if (url === "/salons") data = [salon];
    else if (url === "/salons/1" || url === "/salons/my-salon") data = salon;
    else if (url.includes("salon-services")) data = [service];
    else if (url.endsWith("/summary"))
      data = { averageRating: 0, totalReviews: 0 };
    else if (url === "/users/profile")
      data = { firstName: "Test", lastName: "User" };
    return {
      config,
      status: 200,
      statusText: "OK",
      headers: {},
      data: { success: true, data },
    };
  });
});
const paths = [
  "/",
  "/salons/1",
  "/hiring-posts",
  "/login",
  "/register",
  "/hiring-posts/1/apply",
  "/salons/1/book",
  "/my-bookings",
  "/employee/bookings",
  "/owner/bookings",
  "/owner/dashboard",
  "/owner/create-salon",
  "/owner/my-salon",
  "/owner/create-hiring-post",
  "/owner/create-media-post",
  "/owner/services",
  "/owner/create-service",
  "/owner/services/1/edit",
  "/owner/employees",
];
it.each(paths)(
  "renders route %s with the existing API contracts",
  async (pathname) => {
    saveToken("test-token");
    const { container } = render(
      <MemoryRouter initialEntries={[pathname]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        container.querySelector(".page-main h1, .page-main h2"),
      ).not.toBeNull();
    });
    await waitFor(() => expect(container.querySelector(".loading")).toBeNull());
    expect(screen.queryByText("Something went wrong")).toBeNull();
  },
);
it("redirects protected routes to login and retains the destination", async () => {
  clearAuthData();
  render(
    <MemoryRouter initialEntries={["/owner/employees"]}>
      <AppRoutes />
    </MemoryRouter>,
  );
  expect(await screen.findByRole("heading", { name: "Login" })).toBeDefined();
});
it("renders a not-found page", async () => {
  render(
    <MemoryRouter initialEntries={["/missing"]}>
      <AppRoutes />
    </MemoryRouter>,
  );
  expect(
    await screen.findByRole("heading", { name: "Page not found" }),
  ).toBeDefined();
});
it("returns to the protected destination after a successful login", async () => {
  http.defaults.adapter = async (config) => ({
    config,
    status: 200,
    headers: {},
    data: {
      success: true,
      data: config.url === "/auth/login" ? { token: "signed-in" } : [],
    },
  });
  const { container } = render(
    <MemoryRouter initialEntries={["/owner/employees"]}>
      <AppRoutes />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: "Login" });
  fireEvent.change(container.querySelector('input[name="email"]'), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(container.querySelector('input[name="password"]'), {
    target: { value: "test-password" },
  });
  fireEvent.submit(container.querySelector("form"));
  expect(
    await screen.findByRole("heading", { name: "My Salon Employees" }),
  ).toBeDefined();
});
