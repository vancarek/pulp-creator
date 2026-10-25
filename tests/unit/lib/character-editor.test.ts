import { describe, expect, it } from "vitest";

import {
  editorReducer,
  finishEditing,
  pointsLeft,
  sheetValue,
  startEditing,
  type EditorAction,
} from "@/lib/character-editor";

import { character } from "../fixtures";

function edit(...actions: EditorAction[]) {
  return actions.reduce(
    editorReducer,
    startEditing(
      character({
        skills: [
          { id: "unik", value: 40, ticked: true },
          { id: "nauka-chemia", label: "Nauka (Chemia)", value: 30 },
        ],
        talentIds: [],
      }),
    ),
  );
}

describe("startEditing", () => {
  it("splits the skills and remembers the CoC characteristics", () => {
    const state = edit();
    expect(state.values).toEqual({ unik: 40 });
    expect(state.extra.map((s) => s.id)).toEqual(["nauka-chemia"]);
    expect([...state.ticked]).toEqual(["unik"]);
    expect(state.original.INT).toBe(70);
  });
});

describe("editorReducer", () => {
  it("patches fields, characteristics and backstory", () => {
    const state = edit(
      { type: "field", patch: { name: "Nowe Imię" } },
      { type: "characteristic", key: "INT", value: 85.4 },
      { type: "characteristic", key: "S", value: Number.NaN },
      { type: "backstory", field: "phobias", value: "Ciemność" },
    );
    expect(state.character.name).toBe("Nowe Imię");
    expect(state.character.characteristics.INT).toBe(85);
    expect(state.character.characteristics.S).toBe(0);
    expect(state.character.backstory.phobias).toBe("Ciemność");
    expect(state.original.INT).toBe(70);
  });

  it("edits printed skills and specializations", () => {
    const state = edit(
      { type: "skill", id: "historia", value: 35 },
      { type: "skill", id: "nauka-chemia", value: 45 },
    );
    expect(sheetValue(state, "historia")).toBe(35);
    expect(sheetValue(state, "nauka-chemia")).toBe(45);
    expect(sheetValue(state, "wspinaczka")).toBe(20);
    expect(sheetValue(state, "nieznana")).toBe(0);
  });

  it("derives untouched bases from the current characteristics", () => {
    const state = edit({ type: "characteristic", key: "WYK", value: 90 });
    expect(sheetValue(state, "jezyk-ojczysty")).toBe(90);
  });

  it("adds a specialization once, and removes it with its bonus", () => {
    let state = edit(
      {
        type: "addSpecialization",
        baseId: "jezyk-obcy",
        name: "Francuski",
        value: 21,
      },
      {
        type: "addSpecialization",
        baseId: "jezyk-obcy",
        name: "francuski",
        value: 50,
      },
      { type: "addSpecialization", baseId: "nauka", name: "  ", value: 10 },
    );
    expect(state.extra.map((s) => [s.id, s.label, s.value])).toEqual([
      ["nauka-chemia", "Nauka (Chemia)", 30],
      ["jezyk-obcy-francuski", "Język Obcy (Francuski)", 21],
    ]);
    state = editorReducer(state, {
      type: "bonus",
      id: "jezyk-obcy-francuski",
      points: 10,
    });
    state = editorReducer(state, {
      type: "removeSpecialization",
      id: "jezyk-obcy-francuski",
    });
    expect(state.extra).toHaveLength(1);
    expect(state.bonus).toEqual({});
  });

  it("caps the archetype bonus at 100 points", () => {
    let state = edit(
      { type: "bonus", id: "historia", points: 70 },
      { type: "bonus", id: "unik", points: 50 },
    );
    expect(state.bonus).toEqual({ historia: 70, unik: 30 });
    expect(pointsLeft(state)).toBe(0);
    state = editorReducer(state, { type: "bonus", id: "unik", points: -5 });
    expect(state.bonus.unik).toBe(0);
    expect(pointsLeft(state)).toBe(30);
  });

  it("fills talent slots", () => {
    const state = edit({ type: "talent", index: 1, name: "Twardziel" });
    expect(state.character.talentIds).toEqual(["", "Twardziel"]);
  });

  it("adds, edits and removes weapons", () => {
    let state = edit({ type: "addWeapon" }, { type: "addWeapon" });
    state = editorReducer(state, {
      type: "weapon",
      index: 1,
      patch: { name: "Nóż" },
    });
    expect(state.character.weapons.map((w) => w.name)).toEqual(["", "Nóż"]);
    state = editorReducer(state, { type: "removeWeapon", index: 0 });
    expect(state.character.weapons.map((w) => w.name)).toEqual(["Nóż"]);
  });
});

describe("finishEditing", () => {
  it("rebuilds the skills with the bonus and drops blanks", () => {
    const done = finishEditing(
      edit(
        { type: "field", patch: { name: "  Jan  " } },
        { type: "bonus", id: "unik", points: 10 },
        { type: "talent", index: 0, name: " Szybki " },
        { type: "addWeapon" },
      ),
    );
    expect(done.name).toBe("Jan");
    expect(done.skills).toContainEqual({ id: "unik", value: 50, ticked: true });
    expect(done.talentIds).toEqual(["Szybki"]);
    expect(done.weapons).toEqual([]);
  });
});
