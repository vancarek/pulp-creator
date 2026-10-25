import type { Character, Characteristics } from '../model/character'

export interface DerivedStats {
  /** Punkty Wytrzymałości: w Pulp (KON+BC)/5, czyli dwa razy więcej niż w Zewie. */
  hp: number
  mp: number
  sanity: number
  move: number
  build: number
  damageBonus: string
}

export function pulpHp(c: Characteristics): number {
  return Math.floor((c.KON + c.BC) / 5)
}

export function cocHp(c: Characteristics): number {
  return Math.floor((c.KON + c.BC) / 10)
}

export function buildAndDamageBonus(c: Characteristics): { build: number; damageBonus: string } {
  const sum = c.S + c.BC
  if (sum <= 64) return { build: -2, damageBonus: '-2' }
  if (sum <= 84) return { build: -1, damageBonus: '-1' }
  if (sum <= 124) return { build: 0, damageBonus: '0' }
  if (sum <= 164) return { build: 1, damageBonus: '+1K4' }
  if (sum <= 204) return { build: 2, damageBonus: '+1K6' }
  // Powyżej 204: +1K6 i +1 Krzepy za każde rozpoczęte 80 punktów.
  const steps = Math.ceil((sum - 204) / 80)
  return { build: 2 + steps, damageBonus: `+${1 + steps}K6` }
}

export function move(c: Characteristics, age: number): number {
  let mov = 8
  if (c.ZR < c.BC && c.S < c.BC) mov = 7
  else if (c.ZR > c.BC && c.S > c.BC) mov = 9
  if (age >= 40) mov -= Math.min(5, Math.floor((age - 30) / 10))
  return mov
}

export function derive(ch: Character): DerivedStats {
  const c = ch.characteristics
  return {
    hp: pulpHp(c),
    mp: Math.floor(c.MOC / 5),
    sanity: c.MOC,
    move: move(c, ch.age),
    ...buildAndDamageBonus(c),
  }
}

/** Połowa i jedna piąta wartości, jak na karcie postaci. */
export const half = (v: number) => Math.floor(v / 2)
export const fifth = (v: number) => Math.floor(v / 5)

export interface SkillPointBudget {
  /** Domyślnie WYK×4; w profesjach o innym wzorze MG wpisuje wartość ręcznie. */
  occupation: number
  /** Zainteresowania: INT×2. */
  personal: number
  /** Punkty z archetypu Pulp. */
  archetype: number
}

export function skillPointBudget(c: Characteristics, occupation = c.WYK * 4): SkillPointBudget {
  return { occupation, personal: c.INT * 2, archetype: 100 }
}
