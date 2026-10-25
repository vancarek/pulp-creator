import { Link } from "react-router";

import { Portrait } from "@/components/portrait";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { useAsync } from "@/hooks/use-async";
import { characterStore } from "@/lib/character-store";
import { findArchetype } from "@/lib/rules/archetypes";

export function HomeView() {
  const characters = useAsync(() => characterStore.list(), []);

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading as="h1">Badacze</SectionHeading>
      <p className="text-center text-muted-foreground">
        Wybierz swoją postać. Edycja wymaga hasła od Strażnika Tajemnic.
      </p>
      {characters.status === "loading" && <p>Wczytywanie…</p>}
      {characters.status === "error" && (
        <p className="text-destructive">{characters.error}</p>
      )}
      {characters.status === "ok" && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {characters.data.map((character) => (
            <li key={character.slug}>
              <Link
                to={`/p/${character.slug}`}
                className="block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Card className="flex-row items-center gap-4 border-l-8 border-l-pulp-red px-4 transition-transform hover:-translate-y-0.5">
                  <Portrait character={character} size="sm" />
                  <div className="min-w-0">
                    <p className="pulp-heading truncate text-2xl">
                      {character.name}
                    </p>
                    <p className="pulp-label text-navy">
                      {[
                        character.occupation,
                        findArchetype(character.archetypeId)?.name,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Gracz: {character.player}
                    </p>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
