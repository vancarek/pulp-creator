import { LabeledValue } from "@/components/labeled-value";
import { Portrait } from "@/components/portrait";
import { Card } from "@/components/ui/card";
import type { Character } from "@/lib/character";
import { findArchetype } from "@/lib/rules/archetypes";

export function IdentityCard({ character }: { character: Character }) {
  const archetype = findArchetype(character.archetypeId);
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="bg-chrome py-1 text-center font-display text-xl font-bold tracking-[0.3em] text-pulp-red italic [-webkit-text-stroke:0.5px_#f7dbb4] [paint-order:stroke_fill]">
        1930
      </div>
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        <Portrait character={character} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="pulp-label text-xs text-navy uppercase">
            Imię Bohatera
          </p>
          <h1 className="pulp-heading mb-3 text-4xl leading-tight sm:text-5xl">
            {character.name}
          </h1>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-3">
            <LabeledValue label="Gracz">{character.player}</LabeledValue>
            <LabeledValue label="Profesja">{character.occupation}</LabeledValue>
            <LabeledValue label="Archetyp">{archetype?.name}</LabeledValue>
            <LabeledValue label="Wiek">{character.age}</LabeledValue>
            <LabeledValue label="Płeć">{character.sex}</LabeledValue>
            <LabeledValue label="Miejsce zamieszkania">
              {character.residence}
            </LabeledValue>
            <LabeledValue label="Miejsce urodzenia">
              {character.birthplace}
            </LabeledValue>
          </dl>
        </div>
      </div>
    </Card>
  );
}
