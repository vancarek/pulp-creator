import { describe, expect, it } from "vitest";

import { parseCharacter } from "@/lib/character";

import { rawCharacter } from "../fixtures";

describe("parseCharacter", () => {
  it("fills defaults for optional fields", () => {
    const parsed = parseCharacter(rawCharacter());
    expect(parsed).toMatchObject({
      player: "",
      talentIds: [],
      weapons: [],
      fellows: [],
      majorWound: false,
      backstory: { description: "", encounters: "" },
    });
  });
  it("drops a malformed skill or weapon instead of the whole sheet", () => {
    const parsed = parseCharacter(
      rawCharacter({
        skills: [{ id: "unik", value: 40 }, { id: "", value: 10 }, "nonsense"],
        weapons: [{ name: "Nóż", skill: 25 }, { skill: 10 }],
      }),
    );
    expect(parsed?.skills).toEqual([{ id: "unik", value: 40, ticked: false }]);
    expect(parsed?.weapons.map((w) => w.name)).toEqual(["Nóż"]);
  });
  it.each([
    ["not an object", "hello"],
    ["an array", []],
    ["a bad slug", rawCharacter({ slug: "Jan Kowalski" })],
    ["a negative value", rawCharacter({ luck: -5 })],
    [
      "an unknown core characteristic",
      rawCharacter({ coreCharacteristic: "X" }),
    ],
  ])("refuses %s", (_, value) => {
    expect(parseCharacter(value)).toBeNull();
  });
});
