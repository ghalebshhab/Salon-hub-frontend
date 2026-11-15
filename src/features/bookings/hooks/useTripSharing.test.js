import { describe, expect, it } from "vitest";
import {
  MAX_SILENCE_MS,
  MIN_INTERVAL_MS,
  metersBetween,
  shouldSendPosition,
} from "./useTripSharing.js";

const amman = { latitude: 31.9508, longitude: 35.9241 };

describe("trip position throttling", () => {
  it("sends the first position", () => {
    expect(shouldSendPosition(null, amman, 0)).toBe(true);
  });

  it("waits the minimum interval even after a big move", () => {
    const last = { ...amman, sentAt: 0 };
    const far = { latitude: 31.96, longitude: 35.93 };
    expect(shouldSendPosition(last, far, MIN_INTERVAL_MS - 1)).toBe(false);
    expect(shouldSendPosition(last, far, MIN_INTERVAL_MS)).toBe(true);
  });

  it("skips small moves until the silence limit", () => {
    const last = { ...amman, sentAt: 0 };
    const near = { latitude: 31.9509, longitude: 35.9241 };
    expect(metersBetween(last, near)).toBeLessThan(20);
    expect(shouldSendPosition(last, near, MIN_INTERVAL_MS + 1000)).toBe(false);
    expect(shouldSendPosition(last, near, MAX_SILENCE_MS)).toBe(true);
  });
});
