import { describe, expect, it } from "vitest";

import { findSkill, skillBase, SKILLS } from "@/lib/rules/skills";

import { character } from "../../fixtures";

describe("findSkill", () => {
  it("finds a printed skill by id", () => {
    expect(findSkill("nasluchiwanie")?.name).toBe("Nasłuchiwanie");
  });
  it("resolves a specialization to its base skill", () => {
    expect(findSkill("nauka-chemia")?.id).toBe("nauka");
  });
  it("doesn't treat a non-specialized prefix as a specialization", () => {
    expect(findSkill("historia-sztuki")).toBeUndefined();
  });
});

describe("skillBase", () => {
  const { characteristics } = character();
  it("uses fixed bases as printed", () => {
    expect(skillBase(findSkill("pierwsza-pomoc")!, characteristics)).toBe(30);
  });
  it("derives Unik and Język Ojczysty from characteristics", () => {
    expect(skillBase(findSkill("unik")!, characteristics)).toBe(27);
    expect(skillBase(findSkill("jezyk-ojczysty")!, characteristics)).toBe(75);
  });
  it("has unique ids", () => {
    expect(new Set(SKILLS.map((skill) => skill.id)).size).toBe(SKILLS.length);
  });
});
