import { LabeledValue } from "@/components/labeled-value";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import type { Character } from "@/lib/character";
import { findTalent } from "@/lib/rules/talents";

function Empty() {
  return <p className="text-muted-foreground">Jeszcze nic tu nie ma.</p>;
}

export function Possessions({ character }: { character: Character }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <SectionHeading className="px-4">Talenty</SectionHeading>
        <CardContent>
          {character.talentIds.length === 0 ? (
            <Empty />
          ) : (
            <ul className="flex flex-col gap-2">
              {character.talentIds.map((id) => {
                const talent = findTalent(id);
                return (
                  <li key={id}>
                    <strong className="pulp-label">{talent?.name ?? id}</strong>
                    {talent && ` — ${talent.summary}`}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <SectionHeading className="px-4">Gotówka i Dobytek</SectionHeading>
        <CardContent>
          <dl className="flex flex-col gap-2">
            <LabeledValue label="Poziom wydatków">
              {character.spendingLevel}
            </LabeledValue>
            <LabeledValue label="Gotówka">{character.cash}</LabeledValue>
            <LabeledValue label="Dobytek">{character.assets}</LabeledValue>
          </dl>
        </CardContent>
      </Card>
      <Card>
        <SectionHeading className="px-4">Ekwipunek</SectionHeading>
        <CardContent className="whitespace-pre-line">
          {character.equipment || <Empty />}
        </CardContent>
      </Card>
      <Card>
        <SectionHeading className="px-4">Znajomi Bohaterowie</SectionHeading>
        <CardContent>
          {character.fellows.length === 0 ? (
            <Empty />
          ) : (
            <dl className="grid grid-cols-2 gap-2">
              {character.fellows.map((fellow) => (
                <LabeledValue
                  key={`${fellow.character}-${fellow.player}`}
                  label={fellow.player || "Gracz"}
                >
                  {fellow.character}
                </LabeledValue>
              ))}
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
