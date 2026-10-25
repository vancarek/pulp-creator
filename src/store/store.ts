import type { Character } from '../model/character'
import { DEMO_CHARACTERS } from '../data/demo'

/**
 * Dostęp do danych postaci. W etapie 1 dane są wbudowane w aplikację;
 * w etapie 2 ten moduł zastąpi implementacja czytająca prywatne repo przez API GitHuba.
 */
export interface CharacterStore {
  list(): Promise<Character[]>
  get(slug: string): Promise<Character | null>
}

export const demoStore: CharacterStore = {
  async list() {
    return DEMO_CHARACTERS
  },
  async get(slug) {
    return DEMO_CHARACTERS.find((c) => c.slug === slug) ?? null
  },
}

export const store: CharacterStore = demoStore
