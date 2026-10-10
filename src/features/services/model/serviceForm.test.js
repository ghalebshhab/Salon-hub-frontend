import { expect, it } from "vitest";
import { toServicePayload, validateService } from "./serviceForm.js";
const form = {
  name: " Haircut ",
  description: " Classic ",
  price: "15.5",
  durationMinutes: "30",
};
it("converts form strings to the backend service contract", () => {
  expect(toServicePayload(form)).toEqual({
    name: "Haircut",
    description: "Classic",
    price: 15.5,
    durationMinutes: 30,
  });
  expect(toServicePayload({ ...form, isActive: false }).isActive).toBe(false);
});
it.each(["0", "-1", "NaN", "Infinity", ""])(
  "rejects invalid numeric values: %s",
  (value) => {
    expect(validateService({ ...form, price: value })).toBeTruthy();
    expect(validateService({ ...form, durationMinutes: value })).toBeTruthy();
  },
);
it("accepts valid data and rejects blank names", () => {
  expect(validateService(form)).toBeNull();
  expect(validateService({ ...form, name: " " })).toBeTruthy();
});
