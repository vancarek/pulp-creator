import type {
  Character,
  CharacteristicKey,
  SkillValue,
  Weapon,
} from "./character";
import {
  ARCHETYPE_POINTS,
  bonusSpent,
  buildSkills,
  printedValues,
  type SkillValues,
  specializationId,
  specializationLabel,
  specializations,
} from "./conversion";
import { findSkill, skillBase } from "./rules/skills";

// The sheet editor's state: the character being edited, with its skills split
// into what the Call of Cthulhu sheet says (`values`, `extra`) and the Pulp
// archetype's bonus points on top (`bonus`), so the bonus can be spent and
// taken back without losing the original values.

export type EditorState = {
  character: Character;
  /** The characteristics as they were before editing (the CoC sheet's). */
  original: Character["characteristics"];
  values: SkillValues;
  extra: SkillValue[];
  bonus: SkillValues;
  ticked: Set<string>;
};

type Backstory = Character["backstory"];

export type EditorAction =
  | { type: "field"; patch: Partial<Omit<Character, "skills">> }
  | { type: "characteristic"; key: CharacteristicKey; value: number }
  | { type: "backstory"; field: keyof Backstory; value: string }
  | { type: "skill"; id: string; value: number }
  | { type: "addSpecialization"; baseId: string; name: string; value: number }
  | { type: "removeSpecialization"; id: string }
  | { type: "bonus"; id: string; points: number }
  | { type: "talent"; index: number; name: string }
  | { type: "weapon"; index: number; patch: Partial<Weapon> }
  | { type: "addWeapon" }
  | { type: "removeWeapon"; index: number };

export const TALENT_SLOTS = 2;

export function startEditing(character: Character): EditorState {
  return {
    character,
    original: character.characteristics,
    values: printedValues(character.skills),
    extra: specializations(character.skills),
    bonus: {},
    ticked: new Set(character.skills.filter((s) => s.ticked).map((s) => s.id)),
  };
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(
    max,
    Math.max(min, Number.isFinite(value) ? Math.round(value) : min),
  );

/** A skill's value before the bonus: what the CoC sheet says, or its base. */
export function sheetValue(state: EditorState, id: string): number {
  const own = state.values[id] ?? state.extra.find((s) => s.id === id)?.value;
  if (own !== undefined) return own;
  const def = findSkill(id);
  return def ? skillBase(def, state.character.characteristics) : 0;
}

export function pointsLeft(state: EditorState): number {
  return ARCHETYPE_POINTS - bonusSpent(state.bonus);
}

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  const { character } = state;
  switch (action.type) {
    case "field":
      return { ...state, character: { ...character, ...action.patch } };
    case "characteristic":
      return {
        ...state,
        character: {
          ...character,
          characteristics: {
            ...character.characteristics,
            [action.key]: clamp(action.value, 0, 999),
          },
        },
      };
    case "backstory":
      return {
        ...state,
        character: {
          ...character,
          backstory: { ...character.backstory, [action.field]: action.value },
        },
      };
    case "skill": {
      const value = clamp(action.value, 0, 999);
      if (state.extra.some((s) => s.id === action.id)) {
        return {
          ...state,
          extra: state.extra.map((s) =>
            s.id === action.id ? { ...s, value } : s,
          ),
        };
      }
      return { ...state, values: { ...state.values, [action.id]: value } };
    }
    case "addSpecialization": {
      const name = action.name.trim();
      const id = specializationId(action.baseId, name);
      if (!name || state.extra.some((s) => s.id === id)) return state;
      return {
        ...state,
        extra: [
          ...state.extra,
          {
            id,
            label: specializationLabel(action.baseId, name),
            value: clamp(action.value, 0, 999),
            ticked: false,
          },
        ],
      };
    }
    case "removeSpecialization": {
      const bonus = { ...state.bonus };
      delete bonus[action.id];
      return {
        ...state,
        extra: state.extra.filter((s) => s.id !== action.id),
        bonus,
      };
    }
    case "bonus": {
      const current = state.bonus[action.id] ?? 0;
      const points = clamp(action.points, 0, current + pointsLeft(state));
      return { ...state, bonus: { ...state.bonus, [action.id]: points } };
    }
    case "talent": {
      const talents = Array.from(
        { length: Math.max(TALENT_SLOTS, character.talentIds.length) },
        (_, index) => character.talentIds[index] ?? "",
      );
      talents[action.index] = action.name;
      return { ...state, character: { ...character, talentIds: talents } };
    }
    case "weapon":
      return {
        ...state,
        character: {
          ...character,
          weapons: character.weapons.map((weapon, index) =>
            index === action.index ? { ...weapon, ...action.patch } : weapon,
          ),
        },
      };
    case "addWeapon":
      return {
        ...state,
        character: {
          ...character,
          weapons: [
            ...character.weapons,
            {
              name: "",
              skill: 0,
              damage: "",
              range: "",
              attacks: "1",
              ammo: "",
              malfunction: "",
            },
          ],
        },
      };
    case "removeWeapon":
      return {
        ...state,
        character: {
          ...character,
          weapons: character.weapons.filter((_, i) => i !== action.index),
        },
      };
  }
}

/** The character to save: skills rebuilt with the bonus, blanks dropped. */
export function finishEditing(state: EditorState): Character {
  const { character } = state;
  return {
    ...character,
    name: character.name.trim(),
    skills: buildSkills({
      values: state.values,
      extra: state.extra,
      bonus: state.bonus,
      ticked: state.ticked,
      characteristics: character.characteristics,
    }),
    talentIds: character.talentIds.map((t) => t.trim()).filter(Boolean),
    weapons: character.weapons
      .map((w) => ({ ...w, name: w.name.trim() }))
      .filter((w) => w.name),
  };
}
