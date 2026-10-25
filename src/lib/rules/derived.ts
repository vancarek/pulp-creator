import type { Character, Characteristics } from "../character";

export type DerivedStats = {
  /** Hit points: (KON+BC)/5 in Pulp, twice Call of Cthulhu's. */
  hp: number;
  mp: number;
  /** Starting Sanity = MOC. */
  sanity: number;
  /** Maximum Sanity: 99 minus Mity Cthulhu. */
  maxSanity: number;
  move: number;
  build: number;
  damageBonus: string;
};

export function pulpHp(c: Characteristics): number {
  return Math.floor((c.KON + c.BC) / 5);
}

export function cocHp(c: Characteristics): number {
  return Math.floor((c.KON + c.BC) / 10);
}

export function buildAndDamageBonus(c: Characteristics): {
  build: number;
  damageBonus: string;
} {
  const sum = c.S + c.BC;
  if (sum <= 64) return { build: -2, damageBonus: "-2" };
  if (sum <= 84) return { build: -1, damageBonus: "-1" };
  if (sum <= 124) return { build: 0, damageBonus: "0" };
  if (sum <= 164) return { build: 1, damageBonus: "+1K4" };
  if (sum <= 204) return { build: 2, damageBonus: "+1K6" };
  // Above 204: +1K6 and +1 Build for every started 80 points.
  const steps = Math.ceil((sum - 204) / 80);
  return { build: 2 + steps, damageBonus: `+${1 + steps}K6` };
}

export function move(c: Characteristics, age: number): number {
  let mov = 8;
  if (c.ZR < c.BC && c.S < c.BC) mov = 7;
  else if (c.ZR > c.BC && c.S > c.BC) mov = 9;
  if (age >= 40) mov -= Math.min(5, Math.floor((age - 30) / 10));
  return mov;
}

export function derive(ch: Character): DerivedStats {
  const c = ch.characteristics;
  return {
    hp: pulpHp(c),
    mp: Math.floor(c.MOC / 5),
    sanity: c.MOC,
    maxSanity:
      99 - (ch.skills.find((s) => s.id === "mity-cthulhu")?.value ?? 0),
    move: move(c, ch.age),
    ...buildAndDamageBonus(c),
  };
}

/** Half and fifth of a value, as on the sheet. */
export const half = (v: number) => Math.floor(v / 2);
export const fifth = (v: number) => Math.floor(v / 5);

export type SkillPointBudget = {
  /** WYK×4 by default; occupations with another formula pass their own. */
  occupation: number;
  /** Personal interests: INT×2. */
  personal: number;
  /** The Pulp archetype's bonus points. */
  archetype: number;
};

export function skillPointBudget(
  c: Characteristics,
  occupation = c.WYK * 4,
): SkillPointBudget {
  return { occupation, personal: c.INT * 2, archetype: 100 };
}
