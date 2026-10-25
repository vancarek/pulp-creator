import { describe, expect, it } from "vitest";

import { characterStore, createCharacterStore } from "@/lib/character-store";

import { character, rawCharacter } from "../fixtures";
import { memoryStorage } from "../memory-storage";

function store(storage = memoryStorage()) {
  return createCharacterStore({
    bundled: [rawCharacter({ slug: "jan" }), { slug: "broken" }],
    storage,
    now: () => new Date("2026-11-01T12:00:00Z"),
  });
}

describe("createCharacterStore", () => {
  it("lists only the bundled characters that parse", async () => {
    expect((await store().list()).map((c) => c.slug)).toEqual(["jan"]);
  });

  it("gets one by slug, or null", async () => {
    expect((await store().get("jan"))?.slug).toBe("jan");
    expect(await store().get("broken")).toBeNull();
  });

  it("keeps a saved edit over the bundled character, stamped", async () => {
    const storage = memoryStorage();
    const saved = await store(storage).save(
      character({ slug: "jan", luck: 80 }),
    );
    expect(saved.updatedAt).toBe("2026-11-01T12:00:00.000Z");
    const reopened = store(storage);
    expect((await reopened.get("jan"))?.luck).toBe(80);
    expect(await reopened.list()).toHaveLength(1);
  });

  it("adds a saved character that isn't bundled", async () => {
    const s = store();
    await s.save(character({ slug: "nowa" }));
    expect((await s.list()).map((c) => c.slug)).toEqual(["jan", "nowa"]);
  });

  it("ignores stored drafts it can't read", async () => {
    const storage = memoryStorage();
    await storage.set("character-drafts", { jan: { slug: "jan" } });
    expect((await store(storage).get("jan"))?.luck).toBe(50);
    await storage.set("character-drafts", "garbage");
    expect(await store(storage).list()).toHaveLength(1);
  });

  it("ships a valid sample character, saved to IndexedDB", async () => {
    const sample = await characterStore.get("przyklad");
    expect(sample).not.toBeNull();
    await characterStore.save({ ...sample!, luck: 77 });
    expect((await characterStore.get("przyklad"))?.luck).toBe(77);
  });
});
