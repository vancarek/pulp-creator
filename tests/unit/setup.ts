import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom has no IndexedDB; the storage layer runs against a fake one.
import "fake-indexeddb/auto";

afterEach(() => {
  // @testing-library/react only registers its own cleanup when it finds a
  // *global* afterEach, which never happens without `test.globals` — see
  // maat-core/docs/testing-unit.md.
  cleanup();
});
