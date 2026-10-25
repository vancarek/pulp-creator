import type { Character } from "./character";
import { findSkill, skillBase, SKILLS, type SkillDef } from "./rules/skills";

export type SheetSkill = {
  key: string;
  name: string;
  value: number;
  base: number;
  /** The base as the sheet prints it: "(25%)", "(1/2 ZR)". */
  baseLabel: string;
  ticked: boolean;
  /** Whether the sheet has an improvement box for it. */
  improvable: boolean;
};

function printedBase(def: SkillDef | undefined, base: number): string {
  return def?.baseLabel ?? `${String(base).padStart(2, "0")}%`;
}

/**
 * Every skill as the sheet lists it: the printed ones with this character's
 * values (or their base), plus the character's specializations, in Polish
 * alphabetical order.
 */
export function sheetSkills(character: Character): SheetSkill[] {
  const own = new Map(character.skills.map((skill) => [skill.id, skill]));
  const rows: SheetSkill[] = SKILLS.map((def) => {
    const skill = own.get(def.id);
    const base = skillBase(def, character.characteristics);
    return {
      key: def.id,
      name: def.name,
      value: skill?.value ?? base,
      base,
      baseLabel: printedBase(def, base),
      ticked: skill?.ticked ?? false,
      improvable: !def.noImprovement,
    };
  });
  for (const skill of character.skills) {
    if (SKILLS.some((def) => def.id === skill.id)) continue;
    const def = findSkill(skill.id);
    const base = def ? skillBase(def, character.characteristics) : 0;
    rows.push({
      key: skill.id,
      name: skill.label ?? def?.name ?? skill.id,
      value: skill.value,
      base,
      baseLabel: printedBase(def, base),
      ticked: skill.ticked,
      improvable: !def?.noImprovement,
    });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name, "pl"));
}

/** The value of one skill for this character (its base when not raised). */
export function skillValue(character: Character, id: string): number {
  const own = character.skills.find((skill) => skill.id === id);
  if (own) return own.value;
  const def = findSkill(id);
  return def ? skillBase(def, character.characteristics) : 0;
}
