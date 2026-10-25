import { describe, expect, it } from "vitest";

import {
  bonusSpent,
  buildSkills,
  printedValues,
  rollCoreCharacteristic,
  rollPulpLuck,
  specializationId,
  specializationLabel,
  specializations,
} from "@/lib/conversion";

import { character } from "../fixtures";

const skills = [
  { id: "unik", value: 40, ticked: false },
  { id: "nauka-chemia", label: "Nauka (Chemia)", value: 30, ticked: false },
];

describe("splitting skills", () => {
  it("separates printed values from specializations", () => {
    expect(printedValues(skills)).toEqual({ unik: 40 });
    expect(specializations(skills).map((s) => s.id)).toEqual(["nauka-chemia"]);
  });
});

describe("buildSkills", () => {
  const { characteristics } = character();
  it("stores only what differs from the base, with the bonus added", () => {
    const built = buildSkills({
      values: { unik: 40, historia: 5 },
      extra: specializations(skills),
      bonus: { historia: 20, "nauka-chemia": 10 },
      ticked: new Set(["wspinaczka"]),
      characteristics,
    });
    expect(built).toEqual([
      { id: "historia", value: 25, ticked: false },
      { id: "unik", value: 40, ticked: false },
      { id: "wspinaczka", value: 20, ticked: true },
      { id: "nauka-chemia", label: "Nauka (Chemia)", value: 40, ticked: false },
    ]);
  });
  it("sums spent points", () => {
    expect(bonusSpent({ a: 20, b: 35 })).toBe(55);
  });
});

describe("specializations", () => {
  it("get an ASCII id and the base skill's label", () => {
    expect(specializationId("jezyk-obcy", " Łacina średniowieczna ")).toBe(
      "jezyk-obcy-lacina-sredniowieczna",
    );
    expect(specializationLabel("nauka", " Chemia ")).toBe("Nauka (Chemia)");
    expect(specializationLabel("nieznana", "X")).toBe("nieznana (X)");
  });
});

describe("Pulp rolls", () => {
  it("roll Luck as (2K6+6)×5", () => {
    expect(rollPulpLuck(() => 0)).toBe(40);
    expect(rollPulpLuck(() => 0.999)).toBe(90);
  });
  it("roll a core characteristic as (1K6+13)×5", () => {
    expect(rollCoreCharacteristic(() => 0)).toBe(70);
    expect(rollCoreCharacteristic(() => 0.999)).toBe(95);
  });
  it("default to Math.random within range", () => {
    expect(rollPulpLuck()).toBeGreaterThanOrEqual(40);
    expect(rollCoreCharacteristic()).toBeLessThanOrEqual(95);
  });
});
