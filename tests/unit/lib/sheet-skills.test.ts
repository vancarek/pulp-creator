import { describe, expect, it } from "vitest";

import { SKILLS } from "@/lib/rules/skills";
import { sheetSkills, skillValue } from "@/lib/sheet-skills";

import { character } from "../fixtures";

describe("sheetSkills", () => {
  const sheet = sheetSkills(
    character({
      skills: [
        { id: "spostrzegawczosc", value: 60, ticked: true },
        { id: "nauka-chemia", label: "Nauka (chemia)", value: 41 },
        { id: "nauka-astronomia", value: 21 },
        { id: "wlasna", value: 15 },
      ],
    }),
  );
  const row = (key: string) => sheet.find((skill) => skill.key === key);

  it("lists every printed skill plus the character's own", () => {
    expect(sheet).toHaveLength(SKILLS.length + 3);
  });
  it("uses the character's value and tick, else the base", () => {
    expect(row("spostrzegawczosc")).toMatchObject({
      value: 60,
      base: 25,
      ticked: true,
    });
    expect(row("wspinaczka")).toMatchObject({ value: 20, ticked: false });
  });
  it("names specializations by label, base skill or id", () => {
    expect(row("nauka-chemia")).toMatchObject({
      name: "Nauka (chemia)",
      base: 1,
    });
    expect(row("nauka-astronomia")?.name).toBe("Nauka");
    expect(row("wlasna")).toMatchObject({ name: "wlasna", base: 0 });
  });
  it("prints bases as the sheet does", () => {
    expect(row("archeologia")?.baseLabel).toBe("01%");
    expect(row("unik")?.baseLabel).toBe("1/2 ZR");
    expect(row("jezyk-ojczysty")?.baseLabel).toBe("WYK");
    expect(row("wlasna")?.baseLabel).toBe("00%");
  });
  it("leaves the improvement box off Majętność and Mity Cthulhu", () => {
    expect(row("majetnosc")?.improvable).toBe(false);
    expect(row("mity-cthulhu")?.improvable).toBe(false);
    expect(row("wlasna")?.improvable).toBe(true);
  });
  it("sorts in Polish alphabetical order", () => {
    const names = sheet.map((skill) => skill.name);
    expect(names.indexOf("Ślusarstwo")).toBeGreaterThan(
      names.indexOf("Sztuka Przetrwania"),
    );
  });
});

describe("skillValue", () => {
  const investigator = character({ skills: [{ id: "unik", value: 50 }] });
  it("returns the character's value, the base, or 0 for an unknown skill", () => {
    expect(skillValue(investigator, "unik")).toBe(50);
    expect(skillValue(investigator, "walka-wrecz")).toBe(25);
    expect(skillValue(investigator, "nieznana")).toBe(0);
  });
});
