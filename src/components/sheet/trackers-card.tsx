import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Character } from "@/lib/character";
import type { DerivedStats } from "@/lib/rules/derived";

function Tracker({
  label,
  current,
  max,
}: {
  label: string;
  current: number;
  max?: number;
}) {
  return (
    <div className="flex flex-col rounded-md border-2 border-navy/50 bg-card px-3 py-2">
      <span className="pulp-label text-xs text-navy uppercase">{label}</span>
      <span className="font-display text-3xl font-bold tabular-nums">
        {current}
        {max !== undefined && (
          <span className="text-lg text-muted-foreground">/{max}</span>
        )}
      </span>
    </div>
  );
}

function Flag({ label, checked }: { label: string; checked: boolean }) {
  return (
    <label className="pulp-label flex items-center gap-2 text-sm">
      <Checkbox checked={checked} readOnly />
      {label}
    </label>
  );
}

export function TrackersCard({
  character,
  derived,
}: {
  character: Character;
  derived: DerivedStats;
}) {
  return (
    <Card className="bg-[color-mix(in_oklab,var(--salmon)_22%,var(--card))]">
      <SectionHeading className="px-4" as="h2">
        Punkty
      </SectionHeading>
      <CardContent className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <Tracker
            label="Punkty Wytrzymałości"
            current={character.currentHp ?? derived.hp}
            max={derived.hp}
          />
          <Tracker
            label="Punkty Poczytalności"
            current={character.currentSanity ?? derived.sanity}
            max={derived.maxSanity}
          />
          <Tracker
            label="Punkty Magii"
            current={character.currentMp ?? derived.mp}
            max={derived.mp}
          />
          <Tracker
            label="Szczęście"
            current={character.currentLuck ?? character.luck}
          />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Flag label="Agonia" checked={character.majorWound} />
          <Flag
            label="Chwilowa Niepoczytalność"
            checked={character.temporaryInsanity}
          />
          <Flag
            label="Czasowa Niepoczytalność"
            checked={character.indefiniteInsanity}
          />
        </div>
      </CardContent>
    </Card>
  );
}
