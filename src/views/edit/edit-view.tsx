import { useParams } from "react-router";

import { ViewHeader } from "@/components/view-header";
import { useAsync } from "@/hooks/use-async";
import { characterStore } from "@/lib/character-store";

import { CharacterEditor } from "./character-editor";

export function EditView() {
  const { slug = "" } = useParams();
  const character = useAsync(() => characterStore.get(slug), [slug]);

  if (character.status === "loading") return <p>Wczytywanie…</p>;
  if (character.status === "error") {
    return <p className="text-destructive">{character.error}</p>;
  }
  if (!character.data) return <p>Nie ma postaci „{slug}”.</p>;

  return (
    <section className="flex flex-col gap-4">
      <ViewHeader backTo={`/p/${slug}`} backLabel="Wróć do karty">
        Z Zewu do Pulp
      </ViewHeader>
      <CharacterEditor key={slug} character={character.data} />
    </section>
  );
}
