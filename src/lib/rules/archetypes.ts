import type { CharacteristicKey } from "../character";

// Pulp Cthulhu archetypes.
// DRAFT, NOT VERIFIED: the Polish names are working translations, and the core
// characteristics and skill lists must be checked against the Polish edition.
// `skills` are the skills the archetype's 100 bonus points go to.

export type ArchetypeDef = {
  id: string;
  name: string;
  coreOptions: CharacteristicKey[];
  skills: string[];
  description?: string;
};

export const ARCHETYPES: ArchetypeDef[] = [
  {
    id: "adventurer",
    name: "Poszukiwacz przygód",
    coreOptions: ["ZR", "WYG"],
    skills: [],
  },
  { id: "beefcake", name: "Osiłek", coreOptions: ["S"], skills: [] },
  { id: "bon-vivant", name: "Bon vivant", coreOptions: ["WYG"], skills: [] },
  {
    id: "cold-blooded",
    name: "Zimnokrwisty",
    coreOptions: ["INT"],
    skills: [],
  },
  { id: "dreamer", name: "Marzyciel", coreOptions: ["MOC"], skills: [] },
  { id: "egghead", name: "Jajogłowy", coreOptions: ["WYK"], skills: [] },
  { id: "explorer", name: "Odkrywca", coreOptions: ["ZR", "MOC"], skills: [] },
  {
    id: "femme-fatale",
    name: "Femme fatale",
    coreOptions: ["WYG", "INT"],
    skills: [],
  },
  {
    id: "grease-monkey",
    name: "Złota rączka",
    coreOptions: ["INT"],
    skills: [],
  },
  { id: "hard-boiled", name: "Twardziel", coreOptions: ["KON"], skills: [] },
  { id: "harlequin", name: "Arlekin", coreOptions: ["WYG"], skills: [] },
  { id: "hunter", name: "Łowca", coreOptions: ["INT", "KON"], skills: [] },
  { id: "mystic", name: "Mistyk", coreOptions: ["MOC"], skills: [] },
  { id: "outsider", name: "Outsider", coreOptions: ["INT", "KON"], skills: [] },
  { id: "rogue", name: "Łotr", coreOptions: ["ZR", "WYG"], skills: [] },
  { id: "scholar", name: "Uczony", coreOptions: ["WYK"], skills: [] },
  { id: "seeker", name: "Badacz", coreOptions: ["INT"], skills: [] },
  {
    id: "sidekick",
    name: "Pomocnik",
    coreOptions: ["ZR", "KON", "MOC"],
    skills: [],
  },
  { id: "steadfast", name: "Niezłomny", coreOptions: ["KON"], skills: [] },
  { id: "swashbuckler", name: "Zawadiaka", coreOptions: ["ZR"], skills: [] },
  {
    id: "thrill-seeker",
    name: "Łowca wrażeń",
    coreOptions: ["ZR", "MOC"],
    skills: [],
  },
  { id: "two-fisted", name: "Zabijaka", coreOptions: ["S", "KON"], skills: [] },
];

export const findArchetype = (id: string | null) =>
  ARCHETYPES.find((a) => a.id === id);
