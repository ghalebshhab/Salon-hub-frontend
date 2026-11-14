import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import CommandPalette from "./CommandPalette.jsx";
import { openGlobalSearch } from "./searchEvents.js";

const auth = vi.hoisted(() => ({ value: {} }));
const people = vi.hoisted(() => ({ value: [] }));

vi.mock("../../shared/auth/useAuth.js", () => ({
  default: () => auth.value,
}));
vi.mock("./usePeopleSearch.js", () => ({
  default: (query, enabled) => ({
    people: enabled && query ? people.value : [],
    loading: false,
    error: false,
  }),
}));

function Location() {
  return <output data-testid="path">{useLocation().pathname}</output>;
}

function renderPalette() {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <main id="main-content">
        <h1>Find your next favorite place.</h1>
        <h2>Frequently asked questions</h2>
      </main>
      <Routes>
        <Route path="*" element={<Location />} />
      </Routes>
      <CommandPalette />
    </MemoryRouter>,
  );
}

function input() {
  return screen.getByRole("combobox");
}

function optionTitles() {
  return screen
    .queryAllByRole("option")
    .map((option) => option.querySelector("strong").textContent);
}

beforeEach(() => {
  auth.value = { loggedIn: false, isOwner: false, role: null, user: null };
  people.value = [];
});

afterEach(() => vi.restoreAllMocks());

it("opens with Ctrl+K and lists this page's sections", () => {
  renderPalette();
  expect(screen.queryByRole("dialog")).toBeNull();

  fireEvent.keyDown(window, { key: "k", ctrlKey: true });

  expect(screen.getByRole("dialog", { name: "Search SalonHub" })).toBeDefined();
  expect(document.activeElement).toBe(input());
  expect(optionTitles()).toContain("Frequently asked questions");
});

it("narrows pages and sections by the start of words, ignoring case", () => {
  renderPalette();
  act(() => openGlobalSearch());

  fireEvent.change(input(), { target: { value: "FREQ" } });
  expect(optionTitles()).toEqual(["Frequently asked questions"]);

  fireEvent.change(input(), { target: { value: "comm" } });
  expect(optionTitles()).toEqual(["Community"]);

  fireEvent.change(input(), { target: { value: "ommunity" } });
  expect(optionTitles()).toEqual([]);
  expect(screen.getByText(/No results for/)).toBeDefined();
});

it("opens the highlighted page with Enter and closes", () => {
  renderPalette();
  act(() => openGlobalSearch());

  fireEvent.change(input(), { target: { value: "career" } });
  fireEvent.keyDown(input(), { key: "Enter" });

  expect(screen.getByTestId("path").textContent).toBe("/hiring-posts");
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("moves the selection with arrow keys", () => {
  renderPalette();
  act(() => openGlobalSearch());
  fireEvent.change(input(), { target: { value: "f" } });

  const before = input().getAttribute("aria-activedescendant");
  fireEvent.keyDown(input(), { key: "ArrowDown" });

  expect(input().getAttribute("aria-activedescendant")).not.toBe(before);
});

it("shows people only to signed-in members and links to their profile", () => {
  auth.value = { loggedIn: true, isOwner: false, role: "USER", user: {} };
  people.value = [{ id: 42, userName: "rania.h", displayName: "Rania Haddad" }];
  renderPalette();
  act(() => openGlobalSearch());

  fireEvent.change(input(), { target: { value: "ra" } });
  expect(screen.getByRole("group", { name: "People" })).toBeDefined();

  fireEvent.click(screen.getByText("@rania.h").closest("[role=option]"));
  expect(screen.getByTestId("path").textContent).toBe("/community/people/42");
});

it("closes on Escape", () => {
  renderPalette();
  act(() => openGlobalSearch());

  fireEvent.keyDown(input(), { key: "Escape" });

  expect(screen.queryByRole("dialog")).toBeNull();
});
