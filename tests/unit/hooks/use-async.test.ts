import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAsync } from "@/hooks/use-async";

describe("useAsync", () => {
  it("starts loading, then holds the data", async () => {
    const { result } = renderHook(() => useAsync(async () => 42, []));
    expect(result.current).toEqual({ status: "loading" });
    await waitFor(() =>
      expect(result.current).toEqual({ status: "ok", data: 42 }),
    );
  });

  it("reports a failure", async () => {
    const { result } = renderHook(() =>
      useAsync(() => Promise.reject(new Error("offline")), []),
    );
    await waitFor(() =>
      expect(result.current).toEqual({
        status: "error",
        error: "Error: offline",
      }),
    );
  });

  it("ignores a stale result after the deps change", async () => {
    let resolveFirst: (value: string) => void = () => {};
    const first = new Promise<string>((resolve) => (resolveFirst = resolve));
    const { result, rerender } = renderHook(
      ({ id }) =>
        useAsync(() => (id === 1 ? first : Promise.resolve("two")), [id]),
      { initialProps: { id: 1 } },
    );
    rerender({ id: 2 });
    await waitFor(() =>
      expect(result.current).toEqual({ status: "ok", data: "two" }),
    );
    resolveFirst("one");
    await first;
    expect(result.current).toEqual({ status: "ok", data: "two" });
  });

  it("ignores a stale failure after unmounting", async () => {
    let rejectLoad: (error: Error) => void = () => {};
    const load = new Promise<never>((_, reject) => (rejectLoad = reject));
    const { result, unmount } = renderHook(() => useAsync(() => load, []));
    unmount();
    rejectLoad(new Error("late"));
    await load.catch(() => undefined);
    expect(result.current).toEqual({ status: "loading" });
  });
});
