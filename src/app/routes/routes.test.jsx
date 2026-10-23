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
beforeEach(() => {
  http.defaults.adapter = vi.fn(async (config) => {
    const url = config.url;
    let data = [];
    if (url === "/salons/active") data = [salon];
    else if (url === "/salons/1" || url === "/salons/mine") data = salon;
    else if (url === "/hiring-posts") data = { content: [] };
    else if (url === "/hiring-posts/owner") data = [];
    else if (url === "/profile")
      data = { firstName: "Test", lastName: "User", skills: [] };
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
  "/profile/career",
  "/owner/dashboard",
  "/owner/create-salon",
  "/owner/my-salon",
  "/owner/create-hiring-post",
  "/owner/applications",
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
    <MemoryRouter initialEntries={["/owner/applications"]}>
      <AppRoutes />
    </MemoryRouter>,
  );
  expect(
    await screen.findByRole("heading", { name: "Welcome back" }),
  ).toBeDefined();
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
    <MemoryRouter initialEntries={["/owner/applications"]}>
      <AppRoutes />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: "Welcome back" });
  fireEvent.change(container.querySelector('input[name="email"]'), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(container.querySelector('input[name="password"]'), {
    target: { value: "test-password" },
  });
  fireEvent.submit(container.querySelector("form"));
  expect(
    await screen.findByRole("heading", { name: "Hiring Applications" }),
  ).toBeDefined();
});
