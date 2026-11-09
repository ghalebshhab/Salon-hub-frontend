import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";
import useSalonDetails from "./useSalonDetails.js";
import SalonEmployees from "../components/SalonEmployees.jsx";
import { getSalonByIdApi } from "../api/salonApi.js";
import { getSalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";

vi.mock("../api/salonApi.js", () => ({ getSalonByIdApi: vi.fn() }));
vi.mock("../../employees/api/salonEmployeesApi.js", () => ({
  getSalonEmployeesApi: vi.fn(),
}));
vi.mock("../../../shared/notifications/toast.jsx", () => ({
  showErrorToast: vi.fn(),
}));

const ok = (data) => ({ success: true, data });
const employee = { id: 7, fullName: "Lina Stylist", specialty: "Colour" };
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

function Profile() {
  const details = useSalonDetails();
  const navigate = useNavigate();
  return (
    <>
      {details.salon && <h1>{details.salon.name}</h1>}
      <span>{details.loading ? "Loading profile" : "Profile ready"}</span>
      <SalonEmployees
        employees={details.employees}
        loading={details.employeesLoading}
        error={details.employeesError}
        onRetry={details.retryEmployees}
      />
      <button onClick={() => navigate("/salons/2")}>Next salon</button>
    </>
  );
}

function openProfile() {
  return render(
    <MemoryRouter initialEntries={["/salons/1"]}>
      <Routes>
        <Route path="/salons/:salonId" element={<Profile />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  getSalonByIdApi.mockImplementation(async (id) => ok({ name: `Salon ${id}` }));
  getSalonEmployeesApi.mockResolvedValue(ok([employee]));
});

it("renders the salon while the team is pending, with a local loading announcement", async () => {
  const pending = deferred();
  getSalonEmployeesApi.mockReturnValue(pending.promise);
  openProfile();
  await screen.findByRole("heading", { name: "Salon 1" });
  expect(screen.getByText("Profile ready")).toBeTruthy();
  expect(screen.getByRole("status").textContent).toContain(
    "Loading salon team",
  );
  expect(screen.queryByText("The team is growing")).toBeNull();
  expect(getSalonEmployeesApi.mock.calls[0][1].showLoading).toBe(false);
  await act(async () => pending.resolve(ok([employee])));
  expect(screen.getByRole("heading", { name: employee.fullName })).toBeTruthy();
  expect(screen.queryByRole("status")).toBeNull();
});

it("keeps salon data on an API error and retries only the team request", async () => {
  getSalonEmployeesApi.mockResolvedValueOnce({
    success: false,
    message: "Team temporarily unavailable",
  });
  openProfile();
  expect((await screen.findByRole("alert")).textContent).toContain(
    "Team temporarily unavailable",
  );
  expect(screen.getByRole("heading", { name: "Salon 1" })).toBeTruthy();
  expect(screen.queryByText("The team is growing")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Retry loading team" }));
  await screen.findByRole("heading", { name: employee.fullName });
  expect(getSalonByIdApi).toHaveBeenCalledTimes(1);
  expect(getSalonEmployeesApi).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("alert")).toBeNull();
  expect(showErrorToast).not.toHaveBeenCalled();
});

it("shows a recoverable transport error rather than an empty team", async () => {
  getSalonEmployeesApi.mockRejectedValue({ code: "ERR_NETWORK", request: {} });
  openProfile();
  expect((await screen.findByRole("alert")).textContent).toContain(
    "server could not be reached",
  );
  expect(
    screen.getByRole("button", { name: "Retry loading team" }),
  ).toBeTruthy();
  expect(screen.queryByText("The team is growing")).toBeNull();
});

it("shows the empty state only after a successful empty response", async () => {
  getSalonEmployeesApi.mockResolvedValue(ok([]));
  openProfile();
  await screen.findByText("The team is growing");
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.queryByRole("status")).toBeNull();
});

it("aborts the previous team request and ignores its late result after navigation", async () => {
  const first = deferred();
  const second = deferred();
  getSalonEmployeesApi.mockImplementation((id) =>
    id === "1" ? first.promise : second.promise,
  );
  openProfile();
  await screen.findByRole("heading", { name: "Salon 1" });
  const firstSignal = getSalonEmployeesApi.mock.calls[0][1].signal;
  fireEvent.click(screen.getByRole("button", { name: "Next salon" }));
  await screen.findByRole("heading", { name: "Salon 2" });
  expect(firstSignal.aborted).toBe(true);
  await act(async () => second.resolve(ok([{ id: 8, fullName: "New team" }])));
  await act(async () => first.resolve(ok([employee])));
  expect(screen.getByRole("heading", { name: "New team" })).toBeTruthy();
  expect(screen.queryByText(employee.fullName)).toBeNull();
});

it("aborts the team request on unmount without reporting a cancellation error", async () => {
  const pending = deferred();
  getSalonEmployeesApi.mockReturnValue(pending.promise);
  const view = openProfile();
  await waitFor(() => expect(getSalonEmployeesApi).toHaveBeenCalledTimes(1));
  const signal = getSalonEmployeesApi.mock.calls[0][1].signal;
  view.unmount();
  expect(signal.aborted).toBe(true);
  await act(async () =>
    pending.resolve({ success: false, message: "Late failure" }),
  );
  expect(showErrorToast).not.toHaveBeenCalled();
});
