import { PrinterIcon } from "@phosphor-icons/react";
import { useParams } from "react-router";

import { CharacterSheet } from "@/components/character-sheet";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/use-async";
import { characterStore } from "@/lib/character-store";

export function CharacterView() {
  const { slug = "" } = useParams();
  const character = useAsync(() => characterStore.get(slug), [slug]);

  if (character.status === "loading") return <p>Wczytywanie…</p>;
  if (character.status === "error") {
    return <p className="text-destructive">{character.error}</p>;
  }
  if (!character.data) return <p>Nie ma postaci „{slug}”.</p>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end print:hidden">
        <Button variant="accent" onClick={() => window.print()}>
          <PrinterIcon data-icon="inline-start" weight="bold" />
          Drukuj / PDF
        </Button>
      </div>
      <CharacterSheet character={character.data} />
    </div>
  );
}
