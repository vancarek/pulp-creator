import { describe, expect, it } from "vitest";

import { characterStore, createBundledStore } from "@/lib/character-store";

import { rawCharacter } from "../fixtures";

describe("createBundledStore", () => {
  const store = createBundledStore([
    rawCharacter({ slug: "jan" }),
    { slug: "broken" },
  ]);

  it("lists only the characters that parse", async () => {
    expect((await store.list()).map((c) => c.slug)).toEqual(["jan"]);
  });
  it("gets one by slug, or null", async () => {
    expect((await store.get("jan"))?.slug).toBe("jan");
    expect(await store.get("broken")).toBeNull();
  });
  it("ships a valid sample character", async () => {
    expect(await characterStore.get("przyklad")).not.toBeNull();
  });
});
