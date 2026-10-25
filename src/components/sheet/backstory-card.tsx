import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import type { Character } from "@/lib/character";

type Backstory = Character["backstory"];

// The two columns of the sheet's "Historia bohatera".
const FIELDS: [keyof Backstory, string][] = [
  ["description", "Opis postaci"],
  ["traits", "Przymioty"],
  ["ideology", "Ideologia/Przekonania"],
  ["injuries", "Urazy/Blizny"],
  ["significantPeople", "Ważne osoby"],
  ["phobias", "Fobie/Manie"],
  ["meaningfulLocations", "Znaczące miejsca"],
  ["arcaneTomes", "Tajemne księgi, zaklęcia i artefakty"],
  ["treasuredPossessions", "Rzeczy osobiste"],
  ["encounters", "Spotkania z dziwnymi istotami"],
];

export function BackstoryCard({ character }: { character: Character }) {
  return (
    <Card>
      <SectionHeading className="px-4">Historia Bohatera</SectionHeading>
      <CardContent>
        <dl className="grid gap-x-6 gap-y-4 md:grid-cols-2">
          {FIELDS.map(([field, label]) => (
            <div
              key={field}
              className="border-b border-dashed border-ink/30 pb-2"
            >
              <dt className="pulp-label text-sm text-navy">{label}</dt>
              <dd className="min-h-6 whitespace-pre-line">
                {character.backstory[field] || (
                  <span className="text-muted-foreground">—</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
