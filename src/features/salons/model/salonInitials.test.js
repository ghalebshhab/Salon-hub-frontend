import { expect, it } from "vitest";
import { salonInitials } from "./salonInitials.js";

it("uses the first and last word of multi-word names", () => {
  expect(salonInitials("Maison Rose Salon")).toBe("MS");
  expect(salonInitials("ghaleb shhab")).toBe("GS");
});

it("uses one letter for single-word names", () => {
  expect(salonInitials("Lumière")).toBe("L");
});

it("falls back to S for missing or blank names", () => {
  expect(salonInitials(undefined)).toBe("S");
  expect(salonInitials("   ")).toBe("S");
});

it("handles non-Latin names", () => {
  expect(salonInitials("صالون الورد")).toBe("صا");
});
