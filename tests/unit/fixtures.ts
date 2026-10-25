import { type Character, parseCharacter } from "@/lib/character";

/** A minimal valid character as stored, for tests to override. */
export function rawCharacter(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    slug: "test",
    origin: "conversion",
    name: "Test Testowy",
    archetypeId: null,
    coreCharacteristic: null,
    age: 30,
    characteristics: {
      S: 50,
      KON: 60,
      BC: 65,
      ZR: 55,
      WYG: 50,
      INT: 70,
      MOC: 60,
      WYK: 75,
    },
    luck: 50,
    skills: [],
    portrait: null,
    backstory: {},
    updatedAt: "2026-10-25T00:00:00Z",
    ...overrides,
  };
}

export function character(overrides: Record<string, unknown> = {}): Character {
  const parsed = parseCharacter(rawCharacter(overrides));
  if (!parsed) throw new Error("Invalid test character");
  return parsed;
}
