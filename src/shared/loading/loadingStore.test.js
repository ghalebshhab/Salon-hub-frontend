import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getLoadingSnapshot,
  resetLoadingForTests,
  startLoading,
  stopLoading,
  subscribeLoading,
} from "./loadingStore.js";

afterEach(resetLoadingForTests);

describe("loadingStore", () => {
  it("stays active until every tracked request finishes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeLoading(listener);
    const first = startLoading("Signing you in…");
    const second = startLoading("Saving your booking…");

    expect(getLoadingSnapshot()).toMatchObject({
      active: true,
      count: 2,
      message: "Saving your booking…",
    });
    stopLoading(first);
    expect(getLoadingSnapshot().active).toBe(true);
    stopLoading(second);
    expect(getLoadingSnapshot()).toMatchObject({ active: false, count: 0 });
    expect(listener).toHaveBeenCalledTimes(4);
    unsubscribe();
  });
});
