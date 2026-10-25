import { type Character, parseCharacter } from "./character";
import { DEMO_CHARACTERS } from "./demo-characters";

/**
 * Access to the characters. In stage 1 they are bundled with the app; stage 2
 * replaces this with an implementation reading the private data repository
 * through @maat-apps/core/github.
 */
export type CharacterStore = {
  list(): Promise<Character[]>;
  get(slug: string): Promise<Character | null>;
};

export function createBundledStore(raw: unknown[]): CharacterStore {
  const characters = raw
    .map(parseCharacter)
    .filter((character) => character !== null);
  return {
    async list() {
      return characters;
    },
    async get(slug) {
      return characters.find((character) => character.slug === slug) ?? null;
    },
  };
}

export const characterStore: CharacterStore =
  createBundledStore(DEMO_CHARACTERS);
