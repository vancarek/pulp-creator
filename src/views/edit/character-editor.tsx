import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FloppyDiskIcon,
} from "@phosphor-icons/react";
import { useReducer, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import type { Character } from "@/lib/character";
import {
  editorReducer,
  finishEditing,
  startEditing,
} from "@/lib/character-editor";
import { characterStore } from "@/lib/character-store";
import { cn } from "@/lib/utils";

import { StepArchetype } from "./step-archetype";
import { StepBonus } from "./step-bonus";
import { StepSheet } from "./step-sheet";
import { StepSkills } from "./step-skills";
import { StepStory } from "./step-story";
import { StepTalents } from "./step-talents";

const STEPS = [
  { title: "Karta Zewu", Step: StepSheet },
  { title: "Umiejętności", Step: StepSkills },
  { title: "Archetyp", Step: StepArchetype },
  { title: "Punkty archetypu", Step: StepBonus },
  { title: "Talenty", Step: StepTalents },
  { title: "Historia", Step: StepStory },
];

export function CharacterEditor({ character }: { character: Character }) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(editorReducer, character, startEditing);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const { title, Step } = STEPS[step];
  const last = step === STEPS.length - 1;

  function go(next: number) {
    setStep(next);
    window.scrollTo({ top: 0 });
  }

  async function save() {
    setSaving(true);
    await characterStore.save(finishEditing(state));
    navigate(`/p/${character.slug}`);
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <nav aria-label="Kroki">
        <ol className="flex gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, index) => (
            <li key={s.title} className="shrink-0">
              <button
                type="button"
                aria-current={index === step ? "step" : undefined}
                onClick={() => go(index)}
                className={cn(
                  "pulp-label flex min-h-11 items-center gap-2 rounded-md border-2 border-navy/40 bg-card px-3 text-sm whitespace-nowrap text-navy uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  index === step &&
                    "border-navy bg-navy text-chrome-foreground",
                )}
              >
                <span className="font-display text-base">{index + 1}</span>
                <span className={cn(index !== step && "max-sm:sr-only")}>
                  {s.title}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <h2 className="pulp-heading text-3xl">{title}</h2>
      <Step state={state} dispatch={dispatch} />
      <div className="fixed inset-x-0 bottom-0 z-10 border-t-4 border-double border-pulp-red bg-chrome pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <Button
            variant="ghost"
            className="text-chrome-foreground hover:bg-white/10 hover:text-chrome-foreground"
            disabled={step === 0}
            onClick={() => go(step - 1)}
          >
            <ArrowLeftIcon data-icon="inline-start" weight="bold" />
            Wstecz
          </Button>
          <Button
            variant={last ? "accent" : "outline"}
            className={cn(!last && "border-chrome-foreground/50")}
            disabled={saving || !state.character.name.trim()}
            onClick={save}
          >
            <FloppyDiskIcon data-icon="inline-start" weight="bold" />
            Zapisz
          </Button>
          {!last && (
            <Button variant="accent" onClick={() => go(step + 1)}>
              Dalej
              <ArrowRightIcon data-icon="inline-end" weight="bold" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
