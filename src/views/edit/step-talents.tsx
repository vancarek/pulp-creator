import { DiceFiveIcon } from "@phosphor-icons/react";

import { NumberInput } from "@/components/number-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TALENT_SLOTS } from "@/lib/character-editor";
import { rollPulpLuck } from "@/lib/conversion";
import { cocHp, pulpHp } from "@/lib/rules/derived";

import type { StepProps } from "./editor-props";

export function StepTalents({ state, dispatch }: StepProps) {
  const { character } = state;
  const slots = Math.max(TALENT_SLOTS, character.talentIds.length);
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3">
          <h2 className="pulp-heading text-xl">Talenty</h2>
          <p className="text-muted-foreground">
            Bohater Pulp ma {TALENT_SLOTS} talenty. Wpisz ich nazwy z
            podręcznika.
          </p>
          {Array.from({ length: slots }, (_, index) => (
            <Field key={index}>
              <FieldLabel>Talent {index + 1}</FieldLabel>
              <Input
                value={character.talentIds[index] ?? ""}
                onChange={(event) =>
                  dispatch({ type: "talent", index, name: event.target.value })
                }
              />
            </Field>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-3">
          <h2 className="pulp-heading text-xl">Szczęście i wytrzymałość</h2>
          <Field>
            <FieldLabel>Szczęście w Pulp: (2K6+6)×5</FieldLabel>
            <div className="flex gap-2">
              <NumberInput
                className="w-28"
                value={character.luck}
                onValueChange={(luck) =>
                  dispatch({ type: "field", patch: { luck } })
                }
              />
              <Button
                variant="outline"
                onClick={() =>
                  dispatch({ type: "field", patch: { luck: rollPulpLuck() } })
                }
              >
                <DiceFiveIcon data-icon="inline-start" weight="bold" />
                Rzuć 2K6+6
              </Button>
            </div>
          </Field>
          <Field>
            <FieldLabel>Punkty Wytrzymałości</FieldLabel>
            <p className="font-display text-2xl font-bold">
              {pulpHp(character.characteristics)}{" "}
              <span className="text-base font-normal text-muted-foreground">
                (w Zewie {cocHp(character.characteristics)})
              </span>
            </p>
            <FieldDescription>
              W Pulp liczone jako (KON+BC)/5, przeliczają się same.
            </FieldDescription>
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
