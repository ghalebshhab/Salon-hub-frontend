import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";
import AssistantProvider from "../providers/AssistantProvider.jsx";
import AssistantDock from "./AssistantDock.jsx";
import {
  GREETING_DELAY_MS,
  GREETING_SEEN_KEY,
} from "../hooks/useLamsaGreeting.js";

vi.mock("../../../shared/auth/useAuth.js", () => ({
  default: () => ({ loggedIn: false, isOwner: false, user: null }),
}));

const sendAssistantMessageApi = vi.fn();
vi.mock("../api/assistantApi.js", () => ({
  sendAssistantMessageApi: (...args) => sendAssistantMessageApi(...args),
}));

const PAGES = [
  {
    title: "My bookings",
    subtitle: "My activity",
    to: "/my-bookings",
    keywords: [],
  },
];

function renderDock() {
  render(
    <MemoryRouter>
      <AssistantProvider pages={PAGES}>
        <AssistantDock />
      </AssistantProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.sessionStorage.clear();
  sendAssistantMessageApi.mockReset();
});

it("opens the panel and closes it with Escape", () => {
  renderDock();
  fireEvent.click(screen.getByRole("button", { name: /Ask Lamsa/ }));
  expect(screen.getByRole("dialog", { name: /Lamsa/ })).toBeDefined();

  fireEvent.keyDown(screen.getByLabelText("Message Lamsa"), { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("sends a starter question and shows the reply with its cards", async () => {
  sendAssistantMessageApi.mockResolvedValue({
    success: true,
    data: {
      reply: "The best rated salon in Irbid is Noor Studio.",
      intent: "TOP_SALONS",
      mode: "guide",
      salons: [
        {
          id: 4,
          name: "Noor Studio",
          location: "Irbid",
          governorate: "Irbid",
          averageRating: 4.8,
          reviewCount: 12,
          openSeats: 0,
        },
      ],
      links: [],
      suggestions: ["How do I book?"],
    },
  });
  renderDock();
  fireEvent.click(screen.getByRole("button", { name: /Ask Lamsa/ }));
  fireEvent.click(screen.getByRole("button", { name: /Top rated salons/ }));

  expect(await screen.findByText(/best rated salon in Irbid/)).toBeDefined();
  expect(
    screen.getByRole("link", { name: /Noor Studio/ }).getAttribute("href"),
  ).toBe("/salons/4");
  expect(screen.getByRole("button", { name: "How do I book?" })).toBeDefined();
  expect(sendAssistantMessageApi.mock.calls[0][0]).toMatchObject({
    message: "Top rated salons",
    history: [],
  });
});

it("shows a readable error when the request fails", async () => {
  sendAssistantMessageApi.mockRejectedValue(
    Object.assign(new Error("Network Error"), { code: "ERR_NETWORK" }),
  );
  renderDock();
  fireEvent.click(screen.getByRole("button", { name: /Ask Lamsa/ }));
  const input = screen.getByLabelText("Message Lamsa");
  fireEvent.change(input, { target: { value: "hello" } });
  fireEvent.keyDown(input, { key: "Enter" });

  expect(await screen.findByText(/server could not be reached/i)).toBeDefined();
});

it("greets new visitors once and opens the chat from the greeting", () => {
  vi.useFakeTimers();
  try {
    renderDock();
    expect(screen.queryByText(/your AI guide/)).toBeNull();
    act(() => vi.advanceTimersByTime(GREETING_DELAY_MS));
    fireEvent.click(screen.getByText(/your AI guide/));
    expect(screen.getByRole("dialog", { name: /Lamsa/ })).toBeDefined();
    expect(window.sessionStorage.getItem(GREETING_SEEN_KEY)).toBe("1");
  } finally {
    vi.useRealTimers();
  }
});
