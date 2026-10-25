import { BackstoryCard } from "@/components/sheet/backstory-card";
import { CharacteristicsCard } from "@/components/sheet/characteristics-card";
import { CombatCard } from "@/components/sheet/combat-card";
import { IdentityCard } from "@/components/sheet/identity-card";
import { Possessions } from "@/components/sheet/possessions";
import { SkillsCard } from "@/components/sheet/skills-card";
import { TrackersCard } from "@/components/sheet/trackers-card";
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { Character } from "@/lib/character";
import { derive } from "@/lib/rules/derived";

/**
 * The sheet's two printed pages as tabs: the investigator, then their story
 * and belongings. Both stay mounted so printing (PDF) gets everything.
 */
export function CharacterSheet({ character }: { character: Character }) {
  const derived = derive(character);
  return (
    <Tabs defaultValue="investigator">
      <TabsList className="print:hidden">
        <TabsTrigger value="investigator">Badacz</TabsTrigger>
        <TabsTrigger value="story">Historia</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent
        value="investigator"
        keepMounted
        className="flex flex-col gap-4 print:break-after-page"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <IdentityCard character={character} />
          <CharacteristicsCard character={character} derived={derived} />
        </div>
        <TrackersCard character={character} derived={derived} />
        <SkillsCard character={character} />
        <CombatCard character={character} derived={derived} />
      </TabsContent>
      <TabsContent
        value="story"
        keepMounted
        className="flex flex-col gap-4 print:mt-4"
      >
        <BackstoryCard character={character} />
        <Possessions character={character} />
      </TabsContent>
    </Tabs>
  );
}
