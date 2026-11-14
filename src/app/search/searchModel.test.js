import { describe, expect, it } from "vitest";
import {
  highlightParts,
  matchText,
  normalizeQuery,
  searchItems,
} from "./searchModel.js";

describe("matchText", () => {
  it("matches the start of the text regardless of case", () => {
    expect(matchText("Booking requests", "BOO")).toEqual({
      score: 3,
      ranges: [[0, 3]],
    });
  });

  it("matches the start of any word", () => {
    expect(matchText("Booking requests", "req")).toEqual({
      score: 2,
      ranges: [[8, 11]],
    });
  });

  it("requires every query word to start a word", () => {
    expect(matchText("Team & schedules", "team sch")).toEqual({
      score: 2,
      ranges: [
        [0, 4],
        [7, 10],
      ],
    });
    expect(matchText("Team & schedules", "sch tea")?.ranges).toEqual([
      [0, 3],
      [7, 10],
    ]);
    expect(matchText("Team & schedules", "team xyz")).toBeNull();
  });

  it("never matches inside a word", () => {
    expect(matchText("Booking requests", "ook")).toBeNull();
  });

  it("ignores empty queries", () => {
    expect(matchText("Home", "   ")).toBeNull();
    expect(normalizeQuery("  My   Salon ")).toBe("my salon");
  });
});

describe("searchItems", () => {
  const items = [
    { title: "Services", keywords: ["menu", "prices"] },
    { title: "My salon" },
    { title: "Salon dashboard" },
  ];

  it("ranks whole-title prefixes before word prefixes", () => {
    expect(
      searchItems(items, "sal").map((result) => result.item.title),
    ).toEqual(["Salon dashboard", "My salon"]);
  });

  it("falls back to keywords", () => {
    expect(
      searchItems(items, "pri").map((result) => result.item.title),
    ).toEqual(["Services"]);
  });

  it("returns nothing for an empty query and honors the limit", () => {
    expect(searchItems(items, "")).toEqual([]);
    expect(searchItems(items, "s", 1)).toHaveLength(1);
  });
});

it("splits text into highlighted parts", () => {
  expect(highlightParts("My salon", [[3, 6]])).toEqual([
    { text: "My " },
    { text: "sal", match: true },
    { text: "on" },
  ]);
});
