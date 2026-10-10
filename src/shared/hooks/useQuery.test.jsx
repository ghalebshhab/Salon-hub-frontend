import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useQuery from "./useQuery.js";
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
describe("query lifecycle", () => {
  it("ignores old responses when the resource changes and aborts on unmount", async () => {
    const old = deferred(),
      next = deferred();
    const first = vi.fn(() => old.promise),
      second = vi.fn(() => next.promise);
    const { result, rerender, unmount } = renderHook(
      ({ loader }) => useQuery(loader),
      { initialProps: { loader: first } },
    );
    expect(result.current.loading).toBe(true);
    rerender({ loader: second });
    expect(first.mock.calls[0][0].aborted).toBe(true);
    await act(async () => next.resolve("new salon"));
    expect(result.current.data).toBe("new salon");
    await act(async () => old.resolve("old salon"));
    expect(result.current.data).toBe("new salon");
    unmount();
    expect(second.mock.calls[0][0].aborted).toBe(true);
  });
  it("supports refresh after mutations", async () => {
    const loader = vi
      .fn()
      .mockResolvedValueOnce([1])
      .mockResolvedValueOnce([2]);
    const { result } = renderHook(() => useQuery(loader));
    await waitFor(() => expect(result.current.data).toEqual([1]));
    act(() => result.current.refetch());
    await waitFor(() => expect(result.current.data).toEqual([2]));
    expect(loader).toHaveBeenCalledTimes(2);
  });
  it("reports failures and can recover", async () => {
    const onError = vi.fn();
    const loader = vi
      .fn()
      .mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValueOnce("recovered");
    const { result } = renderHook(() => useQuery(loader, { onError }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(onError).toHaveBeenCalledWith("Offline");
    act(() => result.current.refetch());
    await waitFor(() => expect(result.current.data).toBe("recovered"));
    expect(result.current.error).toBeNull();
  });
  it("does not notify for a failure after unmount", async () => {
    const pending = deferred();
    const onError = vi.fn();
    const loader = () => pending.promise;
    const { unmount } = renderHook(() => useQuery(loader, { onError }));
    unmount();
    await act(async () => pending.reject(new Error("Aborted")));
    expect(onError).not.toHaveBeenCalled();
  });
});
