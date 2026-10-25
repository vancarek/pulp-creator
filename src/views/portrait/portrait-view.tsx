import { CheckCircleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { PortraitArt } from "@/components/portrait";
import { Button } from "@/components/ui/button";
import { ViewHeader } from "@/components/view-header";
import { useAsync } from "@/hooks/use-async";
import { characterStore } from "@/lib/character-store";
import { PORTRAITS, takenPortraits } from "@/lib/portraits";
import { cn } from "@/lib/utils";

export function PortraitView() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const characters = useAsync(() => characterStore.list(), [slug]);
  const [picked, setPicked] = useState<string | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  if (characters.status === "loading") return <p>Wczytywanie…</p>;
  if (characters.status === "error") {
    return <p className="text-destructive">{characters.error}</p>;
  }
  const character = characters.data.find((c) => c.slug === slug);
  if (!character) return <p>Nie ma postaci „{slug}”.</p>;

  const sheet = `/p/${slug}`;
  const selected = picked === undefined ? character.portrait : picked;
  const taken = takenPortraits(characters.data, slug);

  async function save() {
    if (!character) return;
    setSaving(true);
    await characterStore.save({ ...character, portrait: selected });
    navigate(sheet);
  }

  return (
    <section className="flex flex-col gap-4 pb-24">
      <ViewHeader backTo={sheet} backLabel="Wróć do karty">
        Portret
      </ViewHeader>
      <p className="text-center text-muted-foreground">
        Wybierz portret dla postaci {character.name}. Portret zajęty przez inną
        postać jest niedostępny.
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {PORTRAITS.map((portrait) => {
          const owner = taken.get(portrait.id);
          const active = selected === portrait.id;
          return (
            <li key={portrait.id}>
              <button
                type="button"
                aria-pressed={active}
                disabled={owner !== undefined}
                onClick={() => setPicked(portrait.id)}
                className={cn(
                  "relative flex w-full flex-col overflow-hidden rounded-lg border-2 border-navy/50 bg-card text-left transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
                  active &&
                    "border-pulp-red shadow-[4px_4px_0_var(--navy)] ring-2 ring-pulp-red",
                )}
              >
                <PortraitArt
                  portrait={portrait}
                  className="aspect-[4/5] w-full"
                />
                <span className="pulp-label flex min-h-11 items-center justify-between gap-2 px-3 text-navy">
                  {portrait.label}
                  {active && (
                    <CheckCircleIcon
                      weight="fill"
                      className="size-5 text-pulp-red"
                      aria-hidden="true"
                    />
                  )}
                </span>
                {owner && (
                  <span className="absolute inset-x-0 top-2 mx-2 rounded bg-chrome px-2 py-1 text-center text-sm font-bold text-chrome-foreground">
                    Zajęty: {owner}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="fixed inset-x-0 bottom-0 z-10 border-t-4 border-double border-pulp-red bg-chrome pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <Button
            variant="ghost"
            className="text-chrome-foreground hover:bg-white/10 hover:text-chrome-foreground"
            disabled={selected === null}
            onClick={() => setPicked(null)}
          >
            Bez portretu
          </Button>
          <Button variant="accent" disabled={saving} onClick={save}>
            Zapisz portret
          </Button>
        </div>
      </div>
    </section>
  );
}
