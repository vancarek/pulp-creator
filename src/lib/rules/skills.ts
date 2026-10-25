import type { Characteristics } from "../character";

// Skills and base values exactly as printed on the Polish Pulp Cthulhu
// character sheet (Black Monk, "1930" edition).

export type SkillDef = {
  id: string;
  name: string;
  /** Base value; a function for skills derived from a characteristic. */
  base: number | ((c: Characteristics) => number);
  /** Needs a specialization (Nauka, Sztuka/Rzemiosło, …); the sheet leaves blank lines under it. */
  specialization?: boolean;
  /** What the sheet prints instead of a number for a derived base. */
  baseLabel?: string;
  /** Not ticked for improvement (no checkbox on the sheet). */
  noImprovement?: boolean;
};

export const SKILLS: SkillDef[] = [
  { id: "archeologia", name: "Archeologia", base: 1 },
  { id: "bron-dluga", name: "Broń Palna (Karabin/Strzelba)", base: 25 },
  { id: "bron-krotka", name: "Broń Palna (Krótka)", base: 20 },
  { id: "bron-pm", name: "Broń Palna (Pistolet Maszynowy)", base: 15 },
  { id: "charakteryzacja", name: "Charakteryzacja", base: 5 },
  { id: "czytanie-z-ruchu-warg", name: "Czytanie z Ruchu Warg", base: 1 },
  { id: "elektryka", name: "Elektryka", base: 10 },
  { id: "gadanina", name: "Gadanina", base: 5 },
  { id: "historia", name: "Historia", base: 5 },
  { id: "jezdziectwo", name: "Jeździectwo", base: 5 },
  { id: "jezyk-obcy", name: "Język Obcy", base: 1, specialization: true },
  {
    id: "jezyk-ojczysty",
    name: "Język Ojczysty",
    base: (c) => c.WYK,
    baseLabel: "WYK",
  },
  { id: "korzystanie-z-bibliotek", name: "Korzystanie z Bibliotek", base: 20 },
  { id: "korzystanie-z-komputerow", name: "Korzystanie z Komputerów", base: 0 },
  { id: "ksiegowosc", name: "Księgowość", base: 5 },
  { id: "majetnosc", name: "Majętność", base: 0, noImprovement: true },
  { id: "materialy-wybuchowe", name: "Materiały Wybuchowe", base: 1 },
  { id: "mechanika", name: "Mechanika", base: 10 },
  { id: "medycyna", name: "Medycyna", base: 1 },
  { id: "mity-cthulhu", name: "Mity Cthulhu", base: 0, noImprovement: true },
  { id: "nasluchiwanie", name: "Nasłuchiwanie", base: 20 },
  { id: "nauka", name: "Nauka", base: 1, specialization: true },
  { id: "nawigacja", name: "Nawigacja", base: 10 },
  { id: "nurkowanie", name: "Nurkowanie", base: 1 },
  { id: "ciezki-sprzet", name: "Obsługa Ciężkiego Sprzętu", base: 1 },
  { id: "okultyzm", name: "Okultyzm", base: 5 },
  { id: "perswazja", name: "Perswazja", base: 10 },
  { id: "pierwsza-pomoc", name: "Pierwsza Pomoc", base: 30 },
  { id: "pilotowanie", name: "Pilotowanie", base: 1, specialization: true },
  { id: "plywanie", name: "Pływanie", base: 20 },
  { id: "prawo", name: "Prawo", base: 5 },
  { id: "prowadzenie-samochodu", name: "Prowadzenie Samochodu", base: 20 },
  { id: "psychoanaliza", name: "Psychoanaliza", base: 1 },
  { id: "psychologia", name: "Psychologia", base: 10 },
  { id: "rzucanie", name: "Rzucanie", base: 20 },
  { id: "skakanie", name: "Skakanie", base: 20 },
  { id: "spostrzegawczosc", name: "Spostrzegawczość", base: 25 },
  {
    id: "sztuka-rzemioslo",
    name: "Sztuka/Rzemiosło",
    base: 5,
    specialization: true,
  },
  {
    id: "sztuka-przetrwania",
    name: "Sztuka Przetrwania",
    base: 10,
    specialization: true,
  },
  { id: "slusarstwo", name: "Ślusarstwo", base: 1 },
  { id: "tropienie", name: "Tropienie", base: 10 },
  { id: "ukrywanie", name: "Ukrywanie", base: 20 },
  {
    id: "unik",
    name: "Unik",
    base: (c) => Math.floor(c.ZR / 2),
    baseLabel: "1/2 ZR",
  },
  { id: "urok-osobisty", name: "Urok Osobisty", base: 15 },
  { id: "walka-wrecz", name: "Walka Wręcz (Bijatyka)", base: 25 },
  { id: "wiedza-o-naturze", name: "Wiedza o Naturze", base: 10 },
  { id: "wspinaczka", name: "Wspinaczka", base: 20 },
  { id: "wycena", name: "Wycena", base: 5 },
  { id: "zastraszanie", name: "Zastraszanie", base: 15 },
  { id: "zreczne-palce", name: "Zręczne Palce", base: 10 },
];

const byId = new Map(SKILLS.map((skill) => [skill.id, skill]));

/** The definition by id; a specialization (`nauka-chemia`) resolves to its base skill (`nauka`). */
export function findSkill(id: string): SkillDef | undefined {
  return (
    byId.get(id) ??
    SKILLS.find(
      (skill) => skill.specialization && id.startsWith(`${skill.id}-`),
    )
  );
}

export function skillBase(def: SkillDef, c: Characteristics): number {
  return typeof def.base === "function" ? def.base(c) : def.base;
}
