import { expect, it } from "vitest";
import {
  assistantMessage,
  errorMessage,
  matchPages,
  mergeLinks,
  starterPrompts,
  toHistory,
  userMessage,
} from "./assistantConversation.js";

const PAGES = [
  {
    title: "My bookings",
    subtitle: "My activity",
    to: "/my-bookings",
    keywords: ["appointments"],
  },
  {
    title: "Career opportunities",
    subtitle: "Discover",
    to: "/hiring-posts",
    keywords: ["jobs", "vacancies"],
  },
  {
    title: "Notifications",
    subtitle: "My activity",
    to: "/notifications",
    keywords: ["alerts"],
  },
];

it("finds pages by word starts in the title and keywords", () => {
  expect(matchPages(PAGES, "where are my book").map((page) => page.to)).toEqual(
    ["/my-bookings"],
  );
  expect(matchPages(PAGES, "show me JOBS").map((page) => page.to)).toEqual([
    "/hiring-posts",
  ]);
});

it("ignores filler words", () => {
  expect(matchPages(PAGES, "how do I open the page")).toEqual([]);
});

it("keeps one link per destination with server links first", () => {
  const merged = mergeLinks(
    [{ label: "Server", to: "/my-bookings" }],
    [
      { label: "Local", to: "/my-bookings" },
      { label: "Jobs", to: "/hiring-posts" },
    ],
  );
  expect(merged).toEqual([
    { label: "Server", to: "/my-bookings" },
    { label: "Jobs", to: "/hiring-posts" },
  ]);
});

it("sends only real turns as history", () => {
  const messages = [
    userMessage("hi"),
    assistantMessage({ reply: "Lamsa!", mode: "guide" }),
    errorMessage("Network error"),
  ];
  expect(toHistory(messages)).toEqual([
    { role: "user", text: "hi" },
    { role: "assistant", text: "Lamsa!" },
  ]);
});

it("offers owner prompts to owners", () => {
  expect(starterPrompts({ loggedIn: true, isOwner: true })).toContain(
    "Find employees for my salon",
  );
  expect(starterPrompts({ loggedIn: false, isOwner: false })).toContain(
    "Open jobs in Irbid",
  );
});

it("treats a link to a section as the same page", () => {
  expect(
    mergeLinks(
      [{ label: "All salons", to: "/#discover" }],
      [{ label: "Home", to: "/" }],
    ),
  ).toEqual([{ label: "All salons", to: "/#discover" }]);
});
