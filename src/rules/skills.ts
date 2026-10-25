import type { Characteristics } from '../model/character'

// Nazwy i wartości bazowe umiejętności z lat 20./30.
// DO WERYFIKACJI z polskim wydaniem Pulp Cthulhu: nazwy mogą się różnić od podręcznika.

export interface SkillDef {
  id: string
  name: string
  /** Wartość bazowa; funkcja dla umiejętności zależnych od cech. */
  base: number | ((c: Characteristics) => number)
  /** Umiejętność wymagająca specjalizacji (np. Nauka, Sztuka/Rzemiosło). */
  specialization?: boolean
}

export const SKILLS: SkillDef[] = [
  { id: 'antropologia', name: 'Antropologia', base: 1 },
  { id: 'archeologia', name: 'Archeologia', base: 1 },
  { id: 'bron-krotka', name: 'Broń palna (krótka)', base: 20 },
  { id: 'bron-dluga', name: 'Broń palna (karabin/strzelba)', base: 25 },
  { id: 'charakteryzacja', name: 'Charakteryzacja', base: 5 },
  { id: 'elektryka', name: 'Elektryka', base: 10 },
  { id: 'gadanina', name: 'Gadanina', base: 5 },
  { id: 'historia', name: 'Historia', base: 5 },
  { id: 'jezdziectwo', name: 'Jeździectwo', base: 5 },
  { id: 'jezyk-obcy', name: 'Język obcy', base: 1, specialization: true },
  { id: 'jezyk-ojczysty', name: 'Język ojczysty', base: (c) => c.WYK },
  { id: 'korzystanie-z-bibliotek', name: 'Korzystanie z bibliotek', base: 20 },
  { id: 'ksiegowosc', name: 'Księgowość', base: 5 },
  { id: 'majetnosc', name: 'Majętność', base: 0 },
  { id: 'mechanika', name: 'Mechanika', base: 10 },
  { id: 'medycyna', name: 'Medycyna', base: 1 },
  { id: 'mity-cthulhu', name: 'Mity Cthulhu', base: 0 },
  { id: 'nasluchiwanie', name: 'Nasłuchiwanie', base: 20 },
  { id: 'nauka', name: 'Nauka', base: 1, specialization: true },
  { id: 'nawigacja', name: 'Nawigacja', base: 10 },
  { id: 'ciezki-sprzet', name: 'Obsługa ciężkiego sprzętu', base: 1 },
  { id: 'okultyzm', name: 'Okultyzm', base: 5 },
  { id: 'perswazja', name: 'Perswazja', base: 10 },
  { id: 'pierwsza-pomoc', name: 'Pierwsza pomoc', base: 30 },
  { id: 'pilotowanie', name: 'Pilotowanie', base: 1, specialization: true },
  { id: 'plywanie', name: 'Pływanie', base: 20 },
  { id: 'prawo', name: 'Prawo', base: 5 },
  { id: 'prowadzenie-samochodu', name: 'Prowadzenie samochodu', base: 20 },
  { id: 'psychoanaliza', name: 'Psychoanaliza', base: 1 },
  { id: 'psychologia', name: 'Psychologia', base: 10 },
  { id: 'rzucanie', name: 'Rzucanie', base: 20 },
  { id: 'skakanie', name: 'Skakanie', base: 20 },
  { id: 'spostrzegawczosc', name: 'Spostrzegawczość', base: 25 },
  { id: 'sztuka-rzemioslo', name: 'Sztuka/Rzemiosło', base: 5, specialization: true },
  { id: 'sztuka-przetrwania', name: 'Sztuka przetrwania', base: 10, specialization: true },
  { id: 'slusarstwo', name: 'Ślusarstwo', base: 1 },
  { id: 'tropienie', name: 'Tropienie', base: 10 },
  { id: 'ukrywanie', name: 'Ukrywanie', base: 20 },
  { id: 'unik', name: 'Unik', base: (c) => Math.floor(c.ZR / 2) },
  { id: 'urok-osobisty', name: 'Urok osobisty', base: 15 },
  { id: 'walka-wrecz', name: 'Walka wręcz (bijatyka)', base: 25 },
  { id: 'wiedza-o-naturze', name: 'Wiedza o naturze', base: 10 },
  { id: 'wspinaczka', name: 'Wspinaczka', base: 20 },
  { id: 'wycena', name: 'Wycena', base: 5 },
  { id: 'zastraszanie', name: 'Zastraszanie', base: 15 },
  { id: 'zreczne-palce', name: 'Zręczne palce', base: 10 },
]

const byId = new Map(SKILLS.map((s) => [s.id, s]))

/** Znajduje definicję po id; specjalizacje (`nauka-chemia`) dopasowuje do bazowej (`nauka`). */
export function findSkill(id: string): SkillDef | undefined {
  if (byId.has(id)) return byId.get(id)
  return SKILLS.find((s) => s.specialization && id.startsWith(s.id + '-'))
}

export function skillBase(def: SkillDef, c: Characteristics): number {
  return typeof def.base === 'function' ? def.base(c) : def.base
}
