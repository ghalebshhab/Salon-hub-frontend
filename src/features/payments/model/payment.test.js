import { describe, expect, it } from "vitest";
import {
  formatMoney,
  formatRate,
  getMethodLabel,
  getPaymentStatus,
  hasReceipt,
  isCardMethod,
  periodRange,
  toFils,
} from "./payment.js";

describe("payment model", () => {
  it("shows dinars with three decimals", () => {
    expect(formatMoney(19500)).toBe("19.500 JOD");
    expect(formatMoney(5)).toBe("0.005 JOD");
    expect(formatMoney(1234500)).toBe("1,234.500 JOD");
    expect(formatMoney(null)).toBe("—");
    expect(formatMoney("x")).toBe("—");
  });

  it("turns a price into whole fils", () => {
    expect(toFils("19.50")).toBe(19500);
    expect(toFils(7.125)).toBe(7125);
    expect(toFils(undefined)).toBe(0);
  });

  it("names methods and statuses", () => {
    expect(getMethodLabel("CASH")).toBe("Cash at the salon");
    expect(getPaymentStatus("PAID")).toEqual({
      label: "Paid",
      tone: "success",
    });
    expect(getPaymentStatus("NEW").tone).toBe("muted");
    expect(isCardMethod("CARD_PREPAID")).toBe(true);
    expect(isCardMethod("CASH")).toBe(false);
  });

  it("has a receipt only after the money was received", () => {
    expect(hasReceipt({ receiptNumber: "SH-1-000001" })).toBe(true);
    expect(hasReceipt({ receiptNumber: null })).toBe(false);
    expect(hasReceipt(null)).toBe(false);
  });

  it("formats the commission rate", () => {
    expect(formatRate(0)).toBe("0%");
    expect(formatRate(250)).toBe("2.50%");
    expect(formatRate(500)).toBe("5%");
  });

  it("builds report periods from today", () => {
    const today = new Date(2026, 10, 16);
    expect(periodRange("month", today)).toEqual({
      from: "2026-11-01",
      to: "2026-11-16",
    });
    expect(periodRange("7d", today)).toEqual({
      from: "2026-11-10",
      to: "2026-11-16",
    });
    expect(periodRange("today", today)).toEqual({
      from: "2026-11-16",
      to: "2026-11-16",
    });
  });
});
