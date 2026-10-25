import { describe, expect, it } from 'vitest'
import type { Characteristics } from '../model/character'
import { buildAndDamageBonus, cocHp, fifth, half, move, pulpHp, skillPointBudget } from './derived'

const base: Characteristics = { S: 50, KON: 60, BC: 65, ZR: 55, WYG: 50, INT: 70, MOC: 60, WYK: 75 }

describe('pulpHp', () => {
  it('liczy (KON+BC)/5, dwa razy więcej niż w Zewie', () => {
    expect(pulpHp(base)).toBe(25)
    expect(cocHp(base)).toBe(12)
  })
})

describe('buildAndDamageBonus', () => {
  it.each([
    [30, 30, -2, '-2'],
    [40, 40, -1, '-1'],
    [60, 60, 0, '0'],
    [80, 80, 1, '+1K4'],
    [100, 100, 2, '+1K6'],
    [140, 140, 3, '+2K6'],
    [180, 180, 4, '+3K6'],
  ])('S %i + BC %i → Krzepa %i, MO %s', (S, BC, build, db) => {
    expect(buildAndDamageBonus({ ...base, S, BC })).toEqual({ build, damageBonus: db })
  })
})

describe('move', () => {
  it('7, gdy S i ZR są mniejsze od BC', () => {
    expect(move({ ...base, S: 40, ZR: 40, BC: 60 }, 25)).toBe(7)
  })
  it('9, gdy S i ZR są większe od BC', () => {
    expect(move({ ...base, S: 70, ZR: 70, BC: 60 }, 25)).toBe(9)
  })
  it('8 w pozostałych przypadkach', () => {
    expect(move({ ...base, S: 70, ZR: 40, BC: 60 }, 25)).toBe(8)
  })
  it('odejmuje 1 za każdą dekadę od czterdziestki', () => {
    expect(move({ ...base, S: 70, ZR: 40, BC: 60 }, 45)).toBe(7)
    expect(move({ ...base, S: 70, ZR: 40, BC: 60 }, 62)).toBe(5)
  })
})

describe('pomocnicze', () => {
  it('połowa i piąta część zaokrąglone w dół', () => {
    expect(half(55)).toBe(27)
    expect(fifth(55)).toBe(11)
  })
  it('budżet punktów umiejętności', () => {
    expect(skillPointBudget(base)).toEqual({ occupation: 300, personal: 140, archetype: 100 })
  })
})
