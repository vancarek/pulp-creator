import { createKeyValueStore } from "@maat-apps/core/storage";

/** The app's IndexedDB database (maat-core docs/storage.md). */
export const storage = createKeyValueStore({ name: "pulp-creator" });
