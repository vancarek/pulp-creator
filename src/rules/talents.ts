// Talenty Pulp Cthulhu. Lista do uzupełnienia z polskiego wydania:
// opisy własnymi słowami (treść podręcznika objęta jest prawami Chaosium).

export type TalentCategory = 'fizyczne' | 'umysłowe' | 'bojowe' | 'różne' | 'podstępne' | 'magiczne'

export interface TalentDef {
  id: string
  name: string
  category: TalentCategory
  summary: string
}

export const TALENTS: TalentDef[] = []

export const findTalent = (id: string) => TALENTS.find((t) => t.id === id)
