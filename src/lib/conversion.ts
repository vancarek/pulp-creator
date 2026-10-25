import type { Characteristics, SkillValue } from "./character";
import { findSkill, skillBase, SKILLS } from "./rules/skills";

// The Call of Cthulhu → Pulp Cthulhu upgrade: the sheet's skills as plain
// values, the archetype's bonus points on top, and the Pulp rolls.

export const ARCHETYPE_POINTS = 100;

/** Values the editor works with: every printed skill plus specializations, by id. */
export type SkillValues = Record<string, number>;

/** The printed skills these skills set explicitly, by id (the rest stay at their base). */
export function printedValues(skills: SkillValue[]): SkillValues {
  return Object.fromEntries(
    skills
      .filter((s) => SKILLS.some((def) => def.id === s.id))
      .map((s) => [s.id, s.value]),
  );
}

/** The skills that aren't printed on the sheet (specializations). */
export function specializations(skills: SkillValue[]): SkillValue[] {
  return skills.filter((s) => !SKILLS.some((def) => def.id === s.id));
}

/**
 * The stored skill list: printed skills only when they differ from their base
 * (or are ticked), specializations always; bonus points added on top.
 */
export function buildSkills({
  values,
  extra,
  bonus,
  ticked,
  characteristics,
}: {
  values: SkillValues;
  extra: SkillValue[];
  bonus: SkillValues;
  ticked: Set<string>;
  characteristics: Characteristics;
}): SkillValue[] {
  const withBonus = (id: string, value: number) => value + (bonus[id] ?? 0);
  const printed = SKILLS.flatMap((def) => {
    const value = withBonus(
      def.id,
      values[def.id] ?? skillBase(def, characteristics),
    );
    const isTicked = ticked.has(def.id);
    return value !== skillBase(def, characteristics) || isTicked
      ? [{ id: def.id, value, ticked: isTicked }]
      : [];
  });
  const own = extra.map((s) => ({
    ...s,
    value: withBonus(s.id, s.value),
    ticked: ticked.has(s.id),
  }));
  return [...printed, ...own];
}

export function bonusSpent(bonus: SkillValues): number {
  return Object.values(bonus).reduce((sum, points) => sum + points, 0);
}

const POLISH: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
};

/** A specialization's id from its base skill and name: `nauka` + "Chemia" → `nauka-chemia`. */
export function specializationId(baseId: string, name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => POLISH[char])
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${baseId}-${slug}`;
}

/** The label a specialization shows: "Nauka (Chemia)". */
export function specializationLabel(baseId: string, name: string): string {
  return `${findSkill(baseId)?.name ?? baseId} (${name.trim()})`;
}

const die = (sides: number, random: () => number) =>
  1 + Math.floor(random() * sides);

/** Pulp Luck: (2K6 + 6) × 5. */
export function rollPulpLuck(random = Math.random): number {
  return (die(6, random) + die(6, random) + 6) * 5;
}

/** A Pulp archetype's core characteristic: (1K6 + 13) × 5. */
export function rollCoreCharacteristic(random = Math.random): number {
  return (die(6, random) + 13) * 5;
}
