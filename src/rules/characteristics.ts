import type { CharacteristicKey } from '../model/character'

export const CHARACTERISTICS: { key: CharacteristicKey; name: string }[] = [
  { key: 'S', name: 'Siła' },
  { key: 'KON', name: 'Kondycja' },
  { key: 'BC', name: 'Budowa ciała' },
  { key: 'ZR', name: 'Zręczność' },
  { key: 'WYG', name: 'Wygląd' },
  { key: 'INT', name: 'Inteligencja' },
  { key: 'MOC', name: 'Moc' },
  { key: 'WYK', name: 'Wykształcenie' },
]
