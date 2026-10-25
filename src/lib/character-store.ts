import type { KeyValueStore } from "@maat-apps/core/storage";
import { isRecord } from "@maat-apps/core/validation";

import { type Character, parseCharacter } from "./character";
import { DEMO_CHARACTERS } from "./demo-characters";
import { storage } from "./storage";

/**
 * Access to the characters. Until the data repository is wired in (stage 2),
 * the bundled characters are the starting point and edits are kept on this
 * device, in IndexedDB, as one record of slug → character.
 */
export type CharacterStore = {
  list(): Promise<Character[]>;
  get(slug: string): Promise<Character | null>;
  save(character: Character): Promise<Character>;
};

const DRAFTS_KEY = "character-drafts";

function parseAll(values: unknown[]): Character[] {
  return values.map(parseCharacter).filter((c) => c !== null);
}

export function createCharacterStore({
  bundled,
  storage,
  now = () => new Date(),
}: {
  bundled: unknown[];
  storage: KeyValueStore;
  now?: () => Date;
}): CharacterStore {
  const base = parseAll(bundled);

  async function drafts(): Promise<Map<string, Character>> {
    const stored = await storage.get<unknown>(DRAFTS_KEY);
    const values = isRecord(stored) ? Object.values(stored) : [];
    return new Map(parseAll(values).map((c) => [c.slug, c]));
  }

  async function list(): Promise<Character[]> {
    const edited = await drafts();
    const merged = base.map((c) => edited.get(c.slug) ?? c);
    for (const c of edited.values()) {
      if (!base.some((b) => b.slug === c.slug)) merged.push(c);
    }
    return merged;
  }

  return {
    list,
    async get(slug) {
      return (await list()).find((c) => c.slug === slug) ?? null;
    },
    async save(character) {
      const saved = { ...character, updatedAt: now().toISOString() };
      const edited = await drafts();
      edited.set(saved.slug, saved);
      await storage.set(DRAFTS_KEY, Object.fromEntries(edited));
      return saved;
    },
  };
}

export const characterStore: CharacterStore = createCharacterStore({
  bundled: DEMO_CHARACTERS,
  storage,
});
