import { type DependencyList, useEffect, useState } from "react";

type Settled<T> =
  { status: "ok"; data: T } | { status: "error"; error: string };

export type AsyncState<T> = { status: "loading" } | Settled<T>;

/**
 * Runs `load` whenever `deps` change. A result only counts for the deps it
 * was loaded for, so changing them reads as loading again and a stale result
 * never overwrites a newer one.
 */
export function useAsync<T>(
  load: () => Promise<T>,
  deps: DependencyList,
): AsyncState<T> {
  const [result, setResult] = useState<{
    deps: DependencyList;
    state: Settled<T>;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    load().then(
      (data) => {
        if (!cancelled) setResult({ deps, state: { status: "ok", data } });
      },
      (error: unknown) => {
        if (!cancelled) {
          setResult({ deps, state: { status: "error", error: String(error) } });
        }
      },
    );
    return () => {
      cancelled = true;
    };
    // `load` is a fresh closure every render; `deps` is what decides a reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const fresh =
    result !== null &&
    result.deps.every((dep, index) => Object.is(dep, deps[index]));
  return fresh ? result.state : { status: "loading" };
}
