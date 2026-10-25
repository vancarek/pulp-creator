// Pulp Cthulhu talents, to be filled in from the Polish edition. Summaries in
// our own words: the rulebook's text is Chaosium's copyright and this repo is public.

export type TalentCategory =
  "fizyczne" | "umysłowe" | "bojowe" | "różne" | "podstępne" | "magiczne";

export type TalentDef = {
  id: string;
  name: string;
  category: TalentCategory;
  summary: string;
};

export const TALENTS: TalentDef[] = [];

export const findTalent = (id: string) => TALENTS.find((t) => t.id === id);
