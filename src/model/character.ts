/** Klucze cech, wspólne dla Zewu Cthulhu 7ed i Pulp Cthulhu. */
export type CharacteristicKey = 'S' | 'KON' | 'BC' | 'ZR' | 'WYG' | 'INT' | 'MOC' | 'WYK'

export type Characteristics = Record<CharacteristicKey, number>

/** Skąd pochodzi postać: przeniesiona z karty Zewu Cthulhu czy stworzona od zera. */
export type CharacterOrigin = 'conversion' | 'new'

export interface SkillValue {
  /** Id umiejętności z `rules/skills.ts` albo własne id dla specjalizacji (np. `nauka-chemia`). */
  id: string
  /** Nazwa wyświetlana, gdy różni się od bazowej (np. „Nauka (chemia)”). */
  label?: string
  value: number
}

export interface Character {
  /** Część linku: `#/p/<slug>`. Ustala MG w `players.json` w repo z danymi. */
  slug: string
  origin: CharacterOrigin
  name: string
  player: string
  occupation: string
  archetypeId: string | null
  /** Cecha główna archetypu wybrana dla tej postaci. */
  coreCharacteristic: CharacteristicKey | null
  age: number
  sex: string
  residence: string
  birthplace: string
  characteristics: Characteristics
  luck: number
  /** Bieżące wartości; gdy puste, przyjmuje się wartości startowe. */
  currentHp?: number
  currentSanity?: number
  currentMp?: number
  skills: SkillValue[]
  talentIds: string[]
  /** Nazwa pliku portretu z `portraits/` w repo z danymi. */
  portrait: string | null
  backstory: {
    description: string
    ideology: string
    significantPeople: string
    meaningfulLocations: string
    treasuredPossessions: string
    traits: string
  }
  equipment: string
  cash: string
  notes: string
  updatedAt: string
}
