import { describe, expect, it } from "vitest";

import type { Characteristics } from "@/lib/character";
import {
  buildAndDamageBonus,
  cocHp,
  derive,
  fifth,
  half,
  move,
  pulpHp,
  skillPointBudget,
} from "@/lib/rules/derived";

import { character } from "../../fixtures";

const base: Characteristics = {
  S: 50,
  KON: 60,
  BC: 65,
  ZR: 55,
  WYG: 50,
  INT: 70,
  MOC: 60,
  WYK: 75,
};

describe("hit points", () => {
  it("are (KON+BC)/5 in Pulp, twice Call of Cthulhu's", () => {
    expect(pulpHp(base)).toBe(25);
    expect(cocHp(base)).toBe(12);
  });
});

describe("buildAndDamageBonus", () => {
  it.each([
    [30, 30, -2, "-2"],
    [40, 40, -1, "-1"],
    [60, 60, 0, "0"],
    [80, 80, 1, "+1K4"],
    [100, 100, 2, "+1K6"],
    [140, 140, 3, "+2K6"],
    [180, 180, 4, "+3K6"],
  ])("S %i + BC %i → Build %i, damage %s", (S, BC, build, damageBonus) => {
    expect(buildAndDamageBonus({ ...base, S, BC })).toEqual({
      build,
      damageBonus,
    });
  });
});

describe("move", () => {
  it("is 7 when S and ZR are both below BC", () => {
    expect(move({ ...base, S: 40, ZR: 40, BC: 60 }, 25)).toBe(7);
  });
  it("is 9 when S and ZR are both above BC", () => {
    expect(move({ ...base, S: 70, ZR: 70, BC: 60 }, 25)).toBe(9);
  });
  it("is 8 otherwise", () => {
    expect(move({ ...base, S: 70, ZR: 40, BC: 60 }, 25)).toBe(8);
  });
  it("drops by one per decade from forty", () => {
    expect(move({ ...base, S: 70, ZR: 40, BC: 60 }, 45)).toBe(7);
    expect(move({ ...base, S: 70, ZR: 40, BC: 60 }, 62)).toBe(5);
  });
});

describe("derive", () => {
  it("computes the sheet's derived values", () => {
    expect(
      derive(
        character({ skills: [{ id: "mity-cthulhu", value: 6 }], age: 25 }),
      ),
    ).toEqual({
      hp: 25,
      mp: 12,
      sanity: 60,
      maxSanity: 93,
      move: 7,
      build: 0,
      damageBonus: "0",
    });
  });
  it("allows 99 Sanity without Cthulhu Mythos", () => {
    expect(derive(character()).maxSanity).toBe(99);
  });
});

describe("helpers", () => {
  it("round half and fifth down", () => {
    expect(half(55)).toBe(27);
    expect(fifth(55)).toBe(11);
  });
  it("budget skill points", () => {
    expect(skillPointBudget(base)).toEqual({
      occupation: 300,
      personal: 140,
      archetype: 100,
    });
    expect(skillPointBudget(base, 250).occupation).toBe(250);
  });
});
