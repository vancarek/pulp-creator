import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ValueBox } from "@/components/value-box";
import type { Character } from "@/lib/character";
import { CHARACTERISTICS } from "@/lib/rules/characteristics";
import type { DerivedStats } from "@/lib/rules/derived";
import { cn } from "@/lib/utils";

const statLabel =
  "w-11 font-display sm:w-14 text-3xl font-black text-navy italic [-webkit-text-stroke:0.5px_var(--pulp-red)]";

export function CharacteristicsCard({
  character,
  derived,
}: {
  character: Character;
  derived: DerivedStats;
}) {
  return (
    <Card>
      <SectionHeading className="px-4">Cechy</SectionHeading>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
        {CHARACTERISTICS.map(({ key, name }) => {
          const core = character.coreCharacteristic === key;
          return (
            <div key={key} className="flex items-center gap-2">
              <abbr title={name} className={cn(statLabel, "no-underline")}>
                {key}
              </abbr>
              <ValueBox
                value={character.characteristics[key]}
                size="lg"
                className={cn(core && "border-navy ring-2 ring-navy/40")}
              />
              {core && (
                <span className="pulp-label text-xs leading-tight text-navy uppercase">
                  cecha
                  <br />
                  główna
                </span>
              )}
            </div>
          );
        })}
        <div className="flex items-center gap-2">
          <span className={cn(statLabel, "text-2xl")}>Ruch</span>
          <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-pulp-red/75 bg-card font-display text-3xl font-bold">
            {derived.move}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
