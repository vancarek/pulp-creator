import { isRecord, parseEach } from "@maat-apps/core/validation";
import * as v from "valibot";

// The character as stored in the data repository (characters/<slug>.json).
// It crosses a trust boundary (hand edits in the repository, older app
// versions), so it's validated with Valibot and types are inferred from the
// schemas — see maat-core STRUCTURE.md's Conventions.

/** Characteristic keys, shared by Call of Cthulhu 7e and Pulp Cthulhu. */
export const CHARACTERISTIC_KEYS = [
  "S",
  "KON",
  "BC",
  "ZR",
  "WYG",
  "INT",
  "MOC",
  "WYK",
] as const;

const CharacteristicKeySchema = v.picklist(CHARACTERISTIC_KEYS);
export type CharacteristicKey = v.InferOutput<typeof CharacteristicKeySchema>;

const valueSchema = v.pipe(v.number(), v.integer(), v.minValue(0));

const CharacteristicsSchema = v.object({
  S: valueSchema,
  KON: valueSchema,
  BC: valueSchema,
  ZR: valueSchema,
  WYG: valueSchema,
  INT: valueSchema,
  MOC: valueSchema,
  WYK: valueSchema,
});
export type Characteristics = v.InferOutput<typeof CharacteristicsSchema>;

const SkillValueSchema = v.object({
  /** An id from `rules/skills.ts`, or its own id for a specialization (`nauka-chemia`). */
  id: v.pipe(v.string(), v.nonEmpty()),
  /** Display name when it differs from the base skill's ("Nauka (chemia)"). */
  label: v.optional(v.string()),
  value: valueSchema,
  /** Ticked for an improvement check (the box next to the skill on the sheet). */
  ticked: v.optional(v.boolean(), false),
});
export type SkillValue = v.InferOutput<typeof SkillValueSchema>;

const text = v.optional(v.string(), "");

// The "Historia bohatera" page of the sheet, field by field.
const BackstorySchema = v.object({
  description: text,
  ideology: text,
  significantPeople: text,
  meaningfulLocations: text,
  treasuredPossessions: text,
  traits: text,
  injuries: text,
  phobias: text,
  arcaneTomes: text,
  encounters: text,
});

const WeaponSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  /** The skill value the weapon rolls against. */
  skill: valueSchema,
  damage: text,
  range: text,
  attacks: text,
  ammo: text,
  malfunction: text,
});
export type Weapon = v.InferOutput<typeof WeaponSchema>;

const FellowSchema = v.object({
  character: text,
  player: text,
});

/** Where the character comes from: a Call of Cthulhu sheet or made from scratch. */
const OriginSchema = v.picklist(["conversion", "new"]);
export type CharacterOrigin = v.InferOutput<typeof OriginSchema>;

const CharacterSchema = v.object({
  /** The link's path segment (`/p/<slug>`); set by the keeper in players.json. */
  slug: v.pipe(v.string(), v.regex(/^[a-z0-9-]+$/)),
  origin: OriginSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  player: text,
  occupation: text,
  archetypeId: v.nullable(v.string()),
  /** The archetype's core characteristic chosen for this character. */
  coreCharacteristic: v.nullable(CharacteristicKeySchema),
  age: valueSchema,
  sex: text,
  residence: text,
  birthplace: text,
  characteristics: CharacteristicsSchema,
  luck: valueSchema,
  /** Current values; when missing, the starting values apply. */
  currentHp: v.optional(valueSchema),
  currentSanity: v.optional(valueSchema),
  currentMp: v.optional(valueSchema),
  currentLuck: v.optional(valueSchema),
  majorWound: v.optional(v.boolean(), false),
  temporaryInsanity: v.optional(v.boolean(), false),
  indefiniteInsanity: v.optional(v.boolean(), false),
  skills: v.array(v.unknown()),
  weapons: v.optional(v.array(v.unknown()), []),
  talentIds: v.optional(v.array(v.string()), []),
  /** A file name in the data repository's portraits/. */
  portrait: v.nullable(v.string()),
  backstory: BackstorySchema,
  equipment: text,
  spendingLevel: text,
  cash: text,
  assets: text,
  fellows: v.optional(v.array(FellowSchema), []),
  notes: text,
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
});

export type Character = Omit<
  v.InferOutput<typeof CharacterSchema>,
  "skills" | "weapons"
> & { skills: SkillValue[]; weapons: Weapon[] };

/**
 * The character, or null when `value` isn't one. Skills and weapons are
 * validated one by one, so a single malformed entry is dropped rather than
 * losing the whole sheet.
 */
export function parseCharacter(value: unknown): Character | null {
  if (!isRecord(value)) return null;
  const result = v.safeParse(CharacterSchema, value);
  if (!result.success) return null;
  return {
    ...result.output,
    skills: parseEach(SkillValueSchema, result.output.skills),
    weapons: parseEach(WeaponSchema, result.output.weapons),
  };
}
