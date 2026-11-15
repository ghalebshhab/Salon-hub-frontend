import { describe, expect, it, vi } from "vitest";

vi.mock("../../../shared/notifications/toast.jsx", () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
  showWarningToast: vi.fn(),
}));

const { isValid } = await import("./useEditSalon.js");

const saved = {
  name: "ghaleb shhab",
  description: "hair style",
  openTime: "09:00:00",
  closeTime: "18:00:00",
  maxNumOfEmployees: 3,
};

describe("salon section validation", () => {
  it("saves new hours when the old short description is unchanged", () => {
    expect(
      isValid({ ...saved, openTime: "10:00:00", closeTime: "20:00:00" }, saved),
    ).toBe(true);
  });

  it("still rejects a new short description", () => {
    expect(isValid({ ...saved, description: "short" }, saved)).toBe(false);
  });

  it("rejects a closing time before the opening time", () => {
    expect(
      isValid({ ...saved, openTime: "20:00:00", closeTime: "19:00:00" }, saved),
    ).toBe(false);
  });
});
