import {
  ImageIcon,
  PencilSimpleIcon,
  PrinterIcon,
} from "@phosphor-icons/react";
import { Link, useParams } from "react-router";

import { CharacterSheet } from "@/components/character-sheet";
import { Button, buttonVariants } from "@/components/ui/button";
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
      <div className="flex flex-wrap justify-end gap-2 print:hidden">
        <Link to="edytuj" className={buttonVariants({ variant: "outline" })}>
          <PencilSimpleIcon data-icon="inline-start" weight="bold" />
          Edytuj
        </Link>
        <Link to="portret" className={buttonVariants({ variant: "outline" })}>
          <ImageIcon data-icon="inline-start" weight="bold" />
          Portret
        </Link>
        <Button variant="accent" onClick={() => window.print()}>
          <PrinterIcon data-icon="inline-start" weight="bold" />
          Drukuj / PDF
        </Button>
      </div>
      <CharacterSheet character={character.data} />
    </div>
  );
}
