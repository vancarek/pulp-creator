import { MinusIcon, PlusIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pointsLeft, sheetValue } from "@/lib/character-editor";
import { ARCHETYPE_POINTS } from "@/lib/conversion";
import { findArchetype } from "@/lib/rules/archetypes";
import { SKILLS } from "@/lib/rules/skills";
import { cn } from "@/lib/utils";

import type { StepProps } from "./editor-props";

const STEP = 5;

export function StepBonus({ state, dispatch }: StepProps) {
  const archetype = findArchetype(state.character.archetypeId);
  const left = pointsLeft(state);
  // The archetype's own skills once they're filled in; every skill until then.
  const allowed = archetype?.skills.length ? new Set(archetype.skills) : null;
  const skills = [
    ...SKILLS.map((s) => ({ id: s.id, name: s.name })),
    ...state.extra.map((s) => ({ id: s.id, name: s.label ?? s.id })),
  ].filter((s) => !allowed || allowed.has(s.id));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">
        Archetyp daje {ARCHETYPE_POINTS} punktów na swoje umiejętności.
        {!allowed &&
          " Lista umiejętności archetypów nie jest jeszcze uzupełniona, więc na razie wybór jest dowolny."}
      </p>
      <div
        className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-[5] flex items-center justify-between rounded-lg border-2 border-navy bg-card px-4 py-2 shadow-[3px_3px_0_var(--navy)] sm:top-[calc(5rem+env(safe-area-inset-top))]"
        aria-live="polite"
      >
        <span className="pulp-label text-navy uppercase">Pozostało</span>
        <span
          className={cn(
            "font-display text-3xl font-bold tabular-nums",
            left === 0 && "text-pulp-red",
          )}
        >
          {left}
          <span className="text-lg text-muted-foreground">
            /{ARCHETYPE_POINTS}
          </span>
        </span>
      </div>
      <Card>
        <CardContent>
          <ul className="grid gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => {
              const bonus = state.bonus[skill.id] ?? 0;
              const value = sheetValue(state, skill.id);
              return (
                <li
                  key={skill.id}
                  className="flex items-center gap-2 py-1 even:bg-paper-deep/35"
                >
                  <span className="pulp-label min-w-0 flex-1 leading-tight">
                    {skill.name}
                    <span className="block font-sans text-sm font-normal text-muted-foreground">
                      {value}
                      {bonus > 0 && (
                        <>
                          {" "}
                          + <b className="text-pulp-red">{bonus}</b> ={" "}
                          <b className="text-ink">{value + bonus}</b>
                        </>
                      )}
                    </span>
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`${skill.name}: odejmij ${STEP}`}
                    disabled={bonus === 0}
                    onClick={() =>
                      dispatch({
                        type: "bonus",
                        id: skill.id,
                        points: bonus - STEP,
                      })
                    }
                  >
                    <MinusIcon weight="bold" />
                  </Button>
                  <span className="w-8 text-center font-display text-xl font-bold tabular-nums">
                    {bonus}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`${skill.name}: dodaj ${STEP}`}
                    disabled={left === 0}
                    onClick={() =>
                      dispatch({
                        type: "bonus",
                        id: skill.id,
                        points: bonus + STEP,
                      })
                    }
                  >
                    <PlusIcon weight="bold" />
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
