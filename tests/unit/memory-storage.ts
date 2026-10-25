import type { KeyValueStore } from "@maat-apps/core/storage";

/** An in-memory KeyValueStore, so store tests don't share a database. */
export function memoryStorage(): KeyValueStore {
  const data = new Map<string, unknown>();
  return {
    async get<T>(key: string) {
      return data.get(key) as T | undefined;
    },
    async set(key, value) {
      data.set(key, structuredClone(value));
    },
    async delete(key) {
      data.delete(key);
    },
  };
}
