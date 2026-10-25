import { describe, expect, it } from "vitest";

import { ARCHETYPES, findArchetype } from "@/lib/rules/archetypes";
import { CHARACTERISTICS } from "@/lib/rules/characteristics";
import { findTalent } from "@/lib/rules/talents";

describe("catalogs", () => {
  it("finds an archetype by id, or nothing for null", () => {
    expect(findArchetype("seeker")?.coreOptions).toEqual(["INT"]);
    expect(findArchetype(null)).toBeUndefined();
    expect(new Set(ARCHETYPES.map((a) => a.id)).size).toBe(ARCHETYPES.length);
  });
  it("finds no talent that isn't listed", () => {
    expect(findTalent("missing")).toBeUndefined();
  });
});

describe("characteristics", () => {
  it("lists all eight in the sheet's order", () => {
    expect(CHARACTERISTICS.map((c) => c.key)).toEqual([
      "S",
      "ZR",
      "MOC",
      "KON",
      "WYG",
      "WYK",
      "BC",
      "INT",
    ]);
  });
});
